import { utilityBillApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchUtilityBills = createAsyncThunk(
  "utilityBill/fetchUtilityBills",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await utilityBillApi.getByBranch(branchId);
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createUtilityBill = createAsyncThunk(
  "utilityBill/createUtilityBill",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await utilityBillApi.create(payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const utilityBillSlice = createSlice({
  name: "utilityBill",
  initialState: {
    bills: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearUtilityBills: (state) => {
      state.bills = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Utility Bills
      .addCase(fetchUtilityBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUtilityBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload || [];
      })
      .addCase(fetchUtilityBills.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: action.payload?.message || action.payload || "Request failed.",
        });
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Utility Bill
      .addCase(createUtilityBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUtilityBill.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.bills.unshift(action.payload);
        }
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Utility bill created successfully.",
        });
      })
      .addCase(createUtilityBill.rejected, (state, action) => {
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

export const { clearUtilityBills } = utilityBillSlice.actions;
export default utilityBillSlice.reducer;
