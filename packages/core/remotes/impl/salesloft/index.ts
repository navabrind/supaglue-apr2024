import axios, { AxiosError } from '@supaglue/core/remotes/sg_axios';
import type {
  ConnectionUnsafe,
  EngagementOauthProvider,
  Provider,
  SendPassthroughRequestRequest,
  SendPassthroughRequestResponse,
} from '@supaglue/types';
import type {
  Account,
  AccountCreateParams,
  Contact,
  ContactCreateParams,
  EngagementCommonObjectType,
  EngagementCommonObjectTypeMap,
  Sequence,
  SequenceCreateParams,
  SequenceState,
  SequenceStateCreateParams,
  SequenceStepCreateParams,
  User,
} from '@supaglue/types/engagement';
import { Readable } from 'stream';
import { BadRequestError, InternalServerError, RemoteProviderError } from '../../../errors';
import { REFRESH_TOKEN_THRESHOLD_MS, retryWhenAxiosRateLimited } from '../../../lib';
import type { ConnectorAuthConfig } from '../../base';
import { AbstractEngagementRemoteClient } from '../../categories/engagement/base';
import { paginator } from '../../utils/paginator';
import {
  fromSalesloftAccountToAccount,
  fromSalesloftCadenceMembershipToSequenceState,
  fromSalesloftCadenceToSequence,
  fromSalesloftPersonToContact,
  fromSalesloftUserToUser,
  toSalesloftAccountCreateParams,
  toSalesloftCadenceImportParams,
  toSalesloftCadenceStepImportParams,
  toSalesloftContactCreateParams,
  toSalesloftSequenceStateCreateParams,
} from './mappers';

type Credentials = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null; // ISO string
  clientId: string;
  clientSecret: string;
};

const SALESLOFT_RECORD_LIMIT = 100;

const DEFAULT_LIST_PARAMS = {
  per_page: SALESLOFT_RECORD_LIMIT,
};

type SalesloftPaginatedRecords = {
  metadata: {
    paging?: {
      per_page: number;
      current_page: number;
      next_page: number | null;
      prev_page: number | null;
      total_pages?: number;
      total_count?: number;
    };
  };
  data: Record<string, any>[];
};

class SalesloftClient extends AbstractEngagementRemoteClient {
  readonly #credentials: Credentials;
  #headers: Record<string, string>;
  readonly #baseURL: string;

  public constructor(credentials: Credentials) {
    super('https://api.salesloft.com');
    this.#baseURL = 'https://api.salesloft.com';
    this.#credentials = credentials;
    this.#headers = { Authorization: `Bearer ${this.#credentials.accessToken}` };
  }

  protected override getAuthHeadersForPassthroughRequest(): Record<string, string> {
    return this.#headers;
  }

  private async maybeRefreshAccessToken(): Promise<void> {
    if (
      !this.#credentials.expiresAt ||
      Date.parse(this.#credentials.expiresAt) < Date.now() + REFRESH_TOKEN_THRESHOLD_MS
    ) {
      const response = await axios.post<{ refresh_token: string; access_token: string; expires_in: number }>(
        `${authConfig.tokenHost}${authConfig.tokenPath}`,
        {
          client_id: this.#credentials.clientId,
          client_secret: this.#credentials.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: this.#credentials.refreshToken,
        }
      );

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const newExpiresAt = new Date(Date.now() + response.data.expires_in * 1000).toISOString();

      this.#credentials.accessToken = newAccessToken;
      this.#credentials.refreshToken = newRefreshToken;
      this.#credentials.expiresAt = newExpiresAt;
      this.#headers = { Authorization: `Bearer ${newAccessToken}` };

      this.emit('token_refreshed', {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
      });
    }
  }

  public override async sendPassthroughRequest(
    request: SendPassthroughRequestRequest
  ): Promise<SendPassthroughRequestResponse> {
    await this.maybeRefreshAccessToken();
    return await super.sendPassthroughRequest(request);
  }

  public override async getCommonObjectRecord<T extends EngagementCommonObjectType>(
    commonObjectType: T,
    id: string
  ): Promise<EngagementCommonObjectTypeMap<T>['object']> {
    switch (commonObjectType) {
      case 'contact':
        return await this.#getRecord<Contact>(id, '/v2/people', fromSalesloftPersonToContact);
      case 'user':
        return await this.#getRecord<User>(id, '/v2/users', (r: any) => fromSalesloftUserToUser(r));
      case 'account':
        return await this.#getRecord<Account>(id, '/v2/accounts', fromSalesloftAccountToAccount);
      case 'sequence': {
        const stepCount = await this.#getCadenceStepCount(id);
        return await this.#getRecord<Sequence>(id, '/v2/cadences', (data: any) =>
          fromSalesloftCadenceToSequence(data, stepCount)
        );
      }
      case 'sequence_state':
        return await this.#getRecord<SequenceState>(
          id,
          '/v2/cadence_memberships',
          fromSalesloftCadenceMembershipToSequenceState
        );
      default:
        throw new BadRequestError(`Common object ${commonObjectType} not supported for Salesloft`);
    }
  }

  async #getRecord<T>(id: string, path: string, mapper: (data: Record<string, unknown>) => T): Promise<T> {
    const response = await axios.get<{ data: Record<string, unknown> }>(`${this.#baseURL}${path}/${id}`, {
      headers: this.#headers,
    });
    return mapper(response.data.data);
  }

  #getListRecordsFetcher(
    endpoint: string,
    updatedAfter?: Date,
    heartbeat?: () => void
  ): (next?: string) => Promise<SalesloftPaginatedRecords> {
    return async (next?: string) => {
      return await retryWhenAxiosRateLimited(async () => {
        if (heartbeat) {
          heartbeat();
        }
        await this.maybeRefreshAccessToken();
        const response = await axios.get<SalesloftPaginatedRecords>(endpoint, {
          params: updatedAfter
            ? {
                ...DEFAULT_LIST_PARAMS,
                ...getUpdatedAfterPathParam(updatedAfter),
                page: next ? parseInt(next) : undefined,
              }
            : {
                ...DEFAULT_LIST_PARAMS,
                page: next ? parseInt(next) : undefined,
              },
          headers: this.#headers,
        });
        return response.data;
      });
    };
  }

  async #getCadenceStepCount(cadenceId: string): Promise<number> {
    const response = await axios.get<SalesloftPaginatedRecords>(
      `${this.#baseURL}/v2/steps?cadence_id=${cadenceId}&include_paging_counts=1`,
      {
        headers: this.#headers,
      }
    );
    return response.data.metadata.paging?.total_count || 0;
  }

  async #getCadenceStepCounts(heartbeat?: () => void): Promise<Record<string, number>> {
    const normalPageFetcher = this.#getListRecordsFetcher(`${this.#baseURL}/v2/steps`, undefined, heartbeat);
    const stream = await paginator([
      {
        pageFetcher: normalPageFetcher,
        createStreamFromPage: (response) => Readable.from(response.data),
        getNextCursorFromPage: (response) => response.metadata.paging?.next_page?.toString(),
      },
    ]);
    // Mapping from cadenceId => number of steps
    const stepCountMapping: Record<string, number> = {};

    for await (const step of stream) {
      const cadenceId = step.cadence?.id?.toString();
      if (!cadenceId) {
        // This should never happen
        continue;
      }
      if (stepCountMapping[cadenceId]) {
        stepCountMapping[cadenceId] += 1;
      } else {
        stepCountMapping[cadenceId] = 1;
      }
    }
    return stepCountMapping;
  }

  private async listSequences(updatedAfter?: Date, heartbeat?: () => void): Promise<Readable> {
    const stepCounts = await this.#getCadenceStepCounts(heartbeat);
    return await this.#listRecords(
      '/v2/cadences',
      (data: any) => fromSalesloftCadenceToSequence(data, stepCounts[data.id?.toString()] ?? 0),
      updatedAfter,
      heartbeat
    );
  }

  async #listRecords<T>(
    path: string,
    mapper: (data: Record<string, any>) => T,
    updatedAfter?: Date,
    heartbeat?: () => void
  ): Promise<Readable> {
    const normalPageFetcher = this.#getListRecordsFetcher(`${this.#baseURL}${path}`, updatedAfter, heartbeat);
    return await paginator([
      {
        pageFetcher: normalPageFetcher,
        createStreamFromPage: (response) => {
          const emittedAt = new Date();
          return Readable.from(
            response.data.map((result) => ({
              record: mapper(result),
              emittedAt,
            }))
          );
        },
        getNextCursorFromPage: (response) => response.metadata.paging?.next_page?.toString(),
      },
    ]);
  }

  public override async listCommonObjectRecords(
    commonObjectType: EngagementCommonObjectType,
    updatedAfter?: Date,
    heartbeat?: () => void
  ): Promise<Readable> {
    switch (commonObjectType) {
      case 'contact':
        return await this.#listRecords(`/v2/people`, fromSalesloftPersonToContact, updatedAfter, heartbeat);
      case 'user':
        return await this.#listRecords(`/v2/users`, (r: any) => fromSalesloftUserToUser(r), updatedAfter, heartbeat);
      case 'account':
        return await this.#listRecords(`/v2/accounts`, fromSalesloftAccountToAccount, updatedAfter, heartbeat);
      case 'sequence':
        return await this.listSequences(updatedAfter, heartbeat);
      case 'mailbox':
        return Readable.from([]);
      case 'sequence_state':
        return await this.#listRecords(
          '/v2/cadence_memberships',
          fromSalesloftCadenceMembershipToSequenceState,
          updatedAfter,
          heartbeat
        );
      default:
        throw new BadRequestError(`Common object ${commonObjectType} not supported for salesloft`);
    }
  }

  async #createRecord(path: string, salesloftParams: Record<string, unknown>): Promise<string> {
    await this.maybeRefreshAccessToken();
    const response = await axios.post<{ data: { id: number } }>(`${this.#baseURL}${path}`, salesloftParams, {
      headers: this.#headers,
    });
    return response.data.data.id.toString();
  }

  async #importSequence(params: SequenceCreateParams): Promise<string> {
    await this.maybeRefreshAccessToken();
    const response = await axios.post<{ data: { cadence: { id: number } } }>(
      `${this.#baseURL}/v2/cadence_imports`,
      toSalesloftCadenceImportParams(params),
      { headers: this.#headers }
    );
    return response.data.data.cadence.id.toString();
  }

  async #importSequenceStep(params: SequenceStepCreateParams): Promise<string> {
    await this.maybeRefreshAccessToken();

    const response = await axios.post<{ data: { cadence: { id: number } } }>(
      `${this.#baseURL}/v2/cadence_imports`,
      toSalesloftCadenceStepImportParams(params),
      { headers: this.#headers }
    );
    // TODO: The response does not contain step Id... So the return value is only the cadence ID
    // Should we do a fetch on the cadence instead? But the problem is we also don't have a way to
    // definitively idenfiy the step we just created
    return response.data.data.cadence.id.toString();
  }

  public override async createCommonObjectRecord<T extends EngagementCommonObjectType>(
    commonObjectType: T,
    params: EngagementCommonObjectTypeMap<T>['createParams']
  ): Promise<{ id: string; record?: EngagementCommonObjectTypeMap<T>['object'] }> {
    switch (commonObjectType) {
      case 'sequence_state':
        return {
          id: await this.#createRecord(
            '/v2/cadence_memberships',
            toSalesloftSequenceStateCreateParams(params as SequenceStateCreateParams)
          ),
        };
      case 'account':
        return {
          id: await this.#createRecord('/v2/accounts', toSalesloftAccountCreateParams(params as AccountCreateParams)),
        };
      case 'contact':
        return {
          id: await this.#createRecord('/v2/people', toSalesloftContactCreateParams(params as ContactCreateParams)),
        };
      case 'sequence':
        return { id: await this.#importSequence(params as SequenceCreateParams) };
      case 'sequence_step':
        return { id: await this.#importSequenceStep(params as SequenceStepCreateParams) };
      case 'mailbox':
      case 'user':
        throw new BadRequestError(`Create operation not supported for ${commonObjectType} object in Salesloft`);
      default:
        throw new BadRequestError(`Common object ${commonObjectType} not supported for Salesloft`);
    }
  }

  public override async updateCommonObjectRecord<T extends EngagementCommonObjectType>(
    commonObjectType: T,
    params: EngagementCommonObjectTypeMap<T>['updateParams']
  ): Promise<{ id: string; record?: EngagementCommonObjectTypeMap<T>['object'] }> {
    switch (commonObjectType) {
      case 'account':
        return {
          id: await this.#updateRecord(
            params.id,
            '/v2/accounts',
            toSalesloftAccountCreateParams(params as AccountCreateParams)
          ),
        };
      case 'contact':
        return {
          id: await this.#updateRecord(
            params.id,
            '/v2/people',
            toSalesloftContactCreateParams(params as ContactCreateParams)
          ),
        };
      default:
        throw new BadRequestError(`Update not supported for common object ${commonObjectType}`);
    }
  }

  async #updateRecord(id: string, path: string, salesloftParams: Record<string, unknown>): Promise<string> {
    await this.maybeRefreshAccessToken();
    const response = await axios.put<{ data: { id: number } }>(`${this.#baseURL}${path}/${id}`, salesloftParams, {
      headers: this.#headers,
    });
    return response.data.data.id.toString();
  }

  public override handleErr(err: unknown): unknown {
    if (!(err instanceof AxiosError)) {
      return err;
    }

    // https://developers.salesloft.com/docs/platform/api-basics/request-response-format
    const errorTitle = err.response?.data?.error ?? err.response?.statusText;
    const errorCause = err.response?.data;

    switch (err.response?.status) {
      case 400:
        return new InternalServerError(errorTitle, errorCause);
      // The following are unmapped to Supaglue errors, but we want to pass
      // them back as 4xx so they aren't 500 and developers can view error messages
      // NOTE: `429` is omitted below since we process it differently for syncs
      case 401:
      case 402:
      case 403:
      case 404:
      case 405:
      case 406:
      case 407:
      case 408:
      case 410:
      case 411:
      case 412:
      case 413:
      case 414:
      case 415:
      case 416:
      case 417:
      case 418:
      case 419:
      case 420:
      case 421:
      case 422:
      case 423:
      case 424:
      case 425:
      case 426:
      case 427:
      case 428:
      case 430:
      case 431:
      case 432:
      case 433:
      case 434:
      case 435:
      case 436:
      case 437:
      case 438:
      case 439:
      case 440:
      case 441:
      case 442:
      case 443:
      case 444:
      case 445:
      case 446:
      case 447:
      case 448:
      case 449:
      case 450:
      case 451:
        return new RemoteProviderError(errorTitle, errorCause);
      default:
        return err;
    }
  }
}

export function newClient(connection: ConnectionUnsafe<'salesloft'>, provider: Provider): SalesloftClient {
  return new SalesloftClient({
    ...connection.credentials,
    clientId: (provider as EngagementOauthProvider).config.oauth.credentials.oauthClientId,
    clientSecret: (provider as EngagementOauthProvider).config.oauth.credentials.oauthClientSecret,
  });
}

// TODO: support other geographies
export const authConfig: ConnectorAuthConfig = {
  tokenHost: 'https://accounts.salesloft.com',
  tokenPath: '/oauth/token',
  authorizeHost: 'https://accounts.salesloft.com',
  authorizePath: '/oauth/authorize',
};

function getUpdatedAfterPathParam(updatedAfter: Date) {
  return {
    'updated_at[gt]': updatedAfter.toISOString(),
  };
}
