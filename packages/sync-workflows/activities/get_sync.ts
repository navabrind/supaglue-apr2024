import type { Sync } from '@supaglue/types/sync';
import type { SyncService } from '../services/sync_service';

export type GetSyncArgs = {
  syncId: string;
};

export type GetSyncResult = {
  sync: Sync;
};

export function createGetSync(syncService: SyncService) {
  return async function getSync({ syncId }: GetSyncArgs): Promise<GetSyncResult> {
    const sync = await syncService.getSyncById(syncId);
    return {
      sync,
    };
  };
}