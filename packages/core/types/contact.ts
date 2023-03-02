import { CrmAccount, CrmContact } from '@prisma/client';
import { Account } from './account';
import { Address, EmailAddress, PhoneNumber } from './base';

export type CrmContactExpanded = CrmContact & {
  account?: CrmAccount | null;
};

export type BaseContact = {
  firstName: string | null;
  lastName: string | null;
  addresses: Address[];
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  lastActivityAt: Date | null;
};

export type Contact = BaseContact & {
  id: string;
  accountId: string | null;
  account?: Account;
  createdAt: Date | null;
  updatedAt: Date | null;
  wasDeleted: boolean;
  // TODO: Support remote data and field mappings
};

export type RemoteContact = BaseContact & {
  remoteId: string;
  remoteAccountId: string | null;
  remoteCreatedAt: Date | null;
  remoteUpdatedAt: Date | null;
  remoteWasDeleted: boolean;
};

type BaseContactCreateParams = {
  firstName?: string | null;
  lastName?: string | null;
  accountId?: string | null;

  // TODO: Need extra permissions to create/update this derived field in SF
  // lastActivityAt?: Date | null;
};

export type ContactCreateParams = BaseContactCreateParams;
export type RemoteContactCreateParams = BaseContactCreateParams;

export type ContactUpdateParams = ContactCreateParams & {
  id: string;
};

export type RemoteContactUpdateParams = RemoteContactCreateParams & {
  remoteId: string;
};

export type ContactSyncUpsertParams = RemoteContact & {
  customerId: string;
  connectionId: string;
};
