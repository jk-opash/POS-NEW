import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SyncContext = createContext();

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

export function SyncProvider({ children }) {
  // Manual mock for online/offline status
  const [isOnline, setIsOnline] = useState(true);
  
  // The local queue of actions pending sync
  const [syncQueue, setSyncQueue] = useState([]);
  
  // Track if we are currently draining the queue
  const [isSyncing, setIsSyncing] = useState(false);

  // Push an action to the queue
  const enqueue = useCallback((action) => {
    setSyncQueue((prev) => {
      const newQueue = [...prev, {
        id: `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...action,
      }];
      return newQueue;
    });
  }, []);

  // Process the queue one by one
  const flushQueue = useCallback(async () => {
    if (syncQueue.length === 0 || !isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      // Create a copy of the current queue to process
      let currentQueue = [...syncQueue];

      while (currentQueue.length > 0 && isOnline) {
        const itemToSync = currentQueue[0];
        
        console.log(`[SyncEngine] 🔄 Syncing item: ${itemToSync.id} (${itemToSync.type})`);
        
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log(`[SyncEngine] ✅ Successfully synced: ${itemToSync.id}`);
        
        // Remove from local state
        setSyncQueue(prev => prev.filter(q => q.id !== itemToSync.id));
        
        // Update our working array
        currentQueue.shift();
      }
    } finally {
      setIsSyncing(false);
    }
  }, [syncQueue, isOnline, isSyncing]);

  // Attempt to flush whenever connection is restored or queue grows
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      flushQueue();
    }
  }, [isOnline, syncQueue.length, isSyncing, flushQueue]);

  const value = {
    isOnline,
    setIsOnline,
    syncQueue,
    isSyncing,
    enqueue,
    flushQueue
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}
