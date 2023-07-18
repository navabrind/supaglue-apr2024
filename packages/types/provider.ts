import type {
  CommonObjectForCategory,
  OAuthConfigDecrypted,
  OAuthConfigEncrypted,
  ProviderCategory,
  Schema,
  SchemaCreateParams,
} from '.';
import type { CRMProviderName } from './crm';
import type { ObjectType } from './object_sync';

type BaseProvider = {
  id: string;
  applicationId: string;
};

type BaseOauthProvider = BaseProvider & {
  authType: 'oauth2';
  config: ProviderOauthConfigDecrypted;
};

type BaseApiKeyProvider = BaseProvider & {
  authType: 'api_key';
};

export type CRMProvider = BaseOauthProvider & {
  category: 'crm';
  name: CRMProviderName;
  objects?: ProviderObjects<'crm'>;
};

export type EngagementOauthProvider = BaseOauthProvider & {
  category: 'engagement';
  name: 'outreach' | 'gong';
  objects?: ProviderObjects<'engagement'>;
};

export type EngagementApiKeyProvider = BaseApiKeyProvider & {
  category: 'engagement';
  name: 'apollo';
  objects?: ProviderObjects<'engagement'>;
};

// TODO: Template based on provider name
export type EngagementProvider = EngagementOauthProvider | EngagementApiKeyProvider;

export type OauthProvider = CRMProvider | EngagementOauthProvider;

export type ProviderObjects<T extends ProviderCategory> = {
  common?: ProviderCommonObject<T>[];
  standard?: ProviderObject[];
  custom?: ProviderObject[];
};

export type ProviderCommonObject<T extends ProviderCategory> = {
  name: CommonObjectForCategory<T>;
  schemaId?: string;
};

export type ProviderObject = {
  name: string;
  schemaId?: string;
};

export type ProviderOauthConfigDecrypted = {
  providerAppId: string;
  oauth: OAuthConfigDecrypted;
  useManagedOauth?: boolean;
};

export type ProviderOauthConfigEncrypted = {
  providerAppId: string;
  oauth: OAuthConfigEncrypted;
  useManagedOauth?: boolean;
};

export type CRMProviderCreateParams = Omit<CRMProvider, 'id'>;
export type CRMProviderUpdateParams = Omit<CRMProvider, 'id' | 'applicationId'>;

export type EngagementProviderCreateParams = Omit<EngagementProvider, 'id'>;
export type EngagementProviderUpdateParams = Omit<EngagementProvider, 'id' | 'applicationId'>;

export type Provider = CRMProvider | EngagementProvider;

export type ProviderCreateParams = CRMProviderCreateParams | EngagementProviderCreateParams;
export type ProviderUpdateParams = CRMProviderUpdateParams | EngagementProviderUpdateParams;

export type ProviderConfigMapperArgs = {
  managedOauthConfig: OAuthConfigDecrypted;
};

export type AddObjectToProviderParams = {
  name: string;
  type: ObjectType;
  enableSync?: boolean;
  schemaId?: string;
  schema?: Omit<SchemaCreateParams, 'applicationId'>;
};

export type ObjectsWithExpandedSchemasAndFieldMappings<T extends ProviderCategory> = {
  common?: (Omit<ProviderCommonObject<T>, 'schemaId'> & { schema?: Schema })[];
  standard?: (Omit<ProviderObject, 'schemaId'> & { schema?: Schema })[];
  custom?: (Omit<ProviderObject, 'schemaId'> & { schema?: Schema })[];
};
