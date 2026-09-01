import { withdrawalApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchWithdrawals = createAsyncThunk(
  "withdrawal/fetchWithdrawals",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await withdrawalApi.getByBranch(branchId);
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createWithdrawal = createAsyncThunk(
  "withdrawal/createWithdrawal",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await withdrawalApi.create(payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState: {
    withdrawals: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearWithdrawals: (state) => {
      state.withdrawals = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Withdrawals
      .addCase(fetchWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawals = action.payload || [];
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: action.payload?.message || action.payload || "Request failed.",
        });
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Withdrawal
      .addCase(createWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.withdrawals.unshift(action.payload);
        }
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Withdrawal added successfully.",
        });
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: action.payload?.message || action.payload || "Failed to create.",
        });
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWithdrawals } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
