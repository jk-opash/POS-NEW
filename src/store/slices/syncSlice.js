import { createSlice } from '@reduxjs/toolkit';

const syncSlice = createSlice({
  name: 'sync',
  initialState: {
    isOnline: true,
    syncQueue: [],
    isSyncing: false,
  },
  reducers: {
    setIsOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    enqueueSyncAction: (state, action) => {
      state.syncQueue.push({
        id: `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    removeFromQueue: (state, action) => {
      state.syncQueue = state.syncQueue.filter(q => q.id !== action.payload);
    },
    popFromQueue: (state) => {
      state.syncQueue.shift();
    }
  }
});

export const { setIsOnline, setIsSyncing, enqueueSyncAction, removeFromQueue, popFromQueue } = syncSlice.actions;
export default syncSlice.reducer;
