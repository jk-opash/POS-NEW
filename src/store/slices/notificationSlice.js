import { notificationApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await notificationApi.getByBranch(branchId);
      const dataArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      return dataArray;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // Optimistically update the UI is handled in extraReducers (or immediately locally)
      // but let's dispatch an optimistic action here
      dispatch(notificationSlice.actions.optimisticMarkRead(id));
      
      const res = await notificationApi.markAsRead(id);
      return res.data;
    } catch (err) {
      // If offline or fails, we log it into offlineReads
      dispatch(notificationSlice.actions.addOfflineRead(id));
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const syncOfflineReads = createAsyncThunk(
  "notification/syncOfflineReads",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const offlineReads = state.notification?.offlineReads || [];
    
    if (offlineReads.length === 0) return;

    for (const id of offlineReads) {
      try {
        await notificationApi.markAsRead(id);
        dispatch(notificationSlice.actions.removeOfflineRead(id));
      } catch (e) {
        // keep it in offline reads if it fails again
      }
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    offlineReads: [],
  },
  reducers: {
    addNotification: (state, action) => {
      // Add socket notification to the front
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    optimisticMarkRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    addOfflineRead: (state, action) => {
      const id = action.payload;
      if (!state.offlineReads.includes(id)) {
        state.offlineReads.push(id);
      }
    },
    removeOfflineRead: (state, action) => {
      const id = action.payload;
      state.offlineReads = state.offlineReads.filter((readId) => readId !== id);
    },
    clearOfflineReads: (state) => {
      state.offlineReads = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        // Check for offline reads that might have been fetched as unread
        if (state.offlineReads.length > 0) {
          state.notifications.forEach((n) => {
            if (state.offlineReads.includes(n.id)) {
              n.isRead = true;
            }
          });
        }
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
