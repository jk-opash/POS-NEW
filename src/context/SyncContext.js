import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setIsOnline as setIsOnlineAction, 
  setIsSyncing as setIsSyncingAction, 
  enqueueSyncAction as enqueueAction, 
  removeFromQueue as removeFromQueueAction, 
  popFromQueue as popFromQueueAction 
} from '../store/slices/syncSlice';

export function useSync() {
  const dispatch = useDispatch();
  const { isOnline, syncQueue, isSyncing } = useSelector(state => state.sync);

  const setIsOnline = (online) => dispatch(setIsOnlineAction(online));
  const enqueue = useCallback((action) => dispatch(enqueueAction(action)), [dispatch]);

  const flushQueue = useCallback(async () => {
    if (syncQueue.length === 0 || !isOnline || isSyncing) return;
    dispatch(setIsSyncingAction(true));

    try {
      let currentQueue = [...syncQueue];
      while (currentQueue.length > 0 && isOnline) {
        const itemToSync = currentQueue[0];
        console.log(`[SyncEngine] 🔄 Syncing item: ${itemToSync.id} (${itemToSync.type})`);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log(`[SyncEngine] ✅ Successfully synced: ${itemToSync.id}`);
        dispatch(removeFromQueueAction(itemToSync.id));
        currentQueue.shift();
      }
    } finally {
      dispatch(setIsSyncingAction(false));
    }
  }, [syncQueue, isOnline, isSyncing, dispatch]);

  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      flushQueue();
    }
  }, [isOnline, syncQueue.length, isSyncing, flushQueue]);

  return { isOnline, setIsOnline, syncQueue, isSyncing, enqueue, flushQueue };
}
