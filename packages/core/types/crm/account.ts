import { CrmAccount, CrmUser } from '@supaglue/db';
import type { Address, CustomFields, PhoneNumber, User } from '..';
import { Filter } from '../filter';

export type CrmAccountExpanded = CrmAccount & {
  owner?: CrmUser | null;
};

type BaseAccount = {
  name: string | null;
  description: string | null;
  industry: string | null;
  website: string | null;
  numberOfEmployees: number | null;
  addresses: Address[];
  phoneNumbers: PhoneNumber[];
  lastActivityAt: Date | null;
};

export type Account = BaseAccount & {
  id: string;
  ownerId: string | null;
  owner?: User;
  createdAt: Date | null;
  updatedAt: Date | null;
  wasDeleted: boolean;
  // TODO: Support remote data
};

export type RemoteAccount = BaseAccount & {
  remoteId: string;
  remoteOwnerId: string | null;
  remoteCreatedAt: Date | null;
  remoteUpdatedAt: Date | null;
  remoteWasDeleted: boolean;
};

type BaseAccountCreateParams = {
  // TODO: Associations
  // owner?: string | null;

  name?: string | null;
  description?: string | null;
  industry?: string | null;
  website?: string | null;
  numberOfEmployees?: number | null;
  addresses?: Address[];
  phoneNumbers?: PhoneNumber[];

  // TODO: Need extra permissions to create/update this derived field in SF
  // lastActivityAt?: Date | null;
  customFields?: CustomFields;
};

export type AccountCreateParams = BaseAccountCreateParams;
export type RemoteAccountCreateParams = BaseAccountCreateParams;

export type AccountUpdateParams = AccountCreateParams & {
  id: string;
};

export type RemoteAccountUpdateParams = RemoteAccountCreateParams & {
  remoteId: string;
};

export type AccountFilters = {
  website?: Filter;
};
