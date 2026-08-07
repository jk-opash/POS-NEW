import { inventoryApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchInventoryItems = createAsyncThunk(
  "inventory/fetchItems",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getItems(branchId);
      return response.data?.data || response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchInventoryItemById = createAsyncThunk(
  "inventory/fetchItemById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getItemById(id);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  "inventory/createItem",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createItem(payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateItem(id, payload);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await inventoryApi.deleteItem(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchInventoryLedger = createAsyncThunk(
  "inventory/fetchLedger",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getLedger(branchId);
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    ledger: [],
    selectedItem: null,
    isLedgerLoading: false,
    isItemLoading: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearInventory: (state) => {
      state.items = [];
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInventoryItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Item
      .addCase(fetchInventoryItemById.pending, (state) => {
        state.isItemLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItemById.fulfilled, (state, action) => {
        state.isItemLoading = false;
        state.selectedItem = action.payload;
        // Optionally update the item in the list if it exists
        if (action.payload) {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(fetchInventoryItemById.rejected, (state, action) => {
        state.isItemLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchInventoryLedger
      .addCase(fetchInventoryLedger.pending, (state) => {
        state.isLedgerLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryLedger.fulfilled, (state, action) => {
        state.isLedgerLoading = false;
        state.ledger = action.payload || [];
      })
      .addCase(fetchInventoryLedger.rejected, (state, action) => {
        state.isLedgerLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInventory, clearSelectedItem } = inventorySlice.actions;
export default inventorySlice.reducer;
