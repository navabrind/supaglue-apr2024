import type { SyncHistoryStatus } from '@supaglue/types';
import type { ObjectSyncRun } from '@supaglue/types/object_sync_run';
import { parseCustomerIdPk } from '../lib/customer_id';
import type { ObjectSyncRunModelExpanded } from '../types/object_sync_run';

export const fromObjectSyncRunModelAndSync = (args: ObjectSyncRunModelExpanded): ObjectSyncRun => {
  const { id, status, errorMessage, startTimestamp, endTimestamp, objectSync, numRecordsSynced } = args;
  const { connection } = objectSync;
  const { applicationId, externalCustomerId } = parseCustomerIdPk(connection.customerId);
  return {
    id,
    objectSyncId: objectSync.id,
    status: status as SyncHistoryStatus,
    errorMessage,
    startTimestamp,
    endTimestamp,
    connectionId: connection.id,
    applicationId,
    customerId: externalCustomerId,
    providerName: connection.providerName,
    category: connection.category as 'crm',
    numRecordsSynced,
  };
};