import { expenseApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getByBranch(branchId);
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createExpense = createAsyncThunk(
  "expense/createExpense",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await expenseApi.create(payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearExpenses: (state) => {
      state.expenses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload || [];
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: action.payload?.message || action.payload || "Request failed.",
        });
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Expense
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.expenses.unshift(action.payload); // Add new expense to the top
        }
      })
      .addCase(createExpense.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: action.payload?.message || action.payload || "Request failed.",
        });
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
