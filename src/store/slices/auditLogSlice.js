import { auditLogApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchAuditLogs = createAsyncThunk(
  "auditLog/fetchLogs",
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await auditLogApi.getAll(branchId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const auditLogSlice = createSlice({
  name: "auditLog",
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload || [];
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        Toast.show({ type: "error", text1: "Error", text2: action.payload?.message || action.payload || "Request failed." });
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default auditLogSlice.reducer;
