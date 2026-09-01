import { supplierApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async ({ businessId, status }, { rejectWithValue }) => {
    try {
      if (!businessId) return rejectWithValue("Business ID is required");
      
      const response = await supplierApi.getAll(businessId);
      // Client-side filtering if status is provided since backend might not support it yet
      let data = response.data.data;
      if (status && status !== "All") {
        data = data.filter(s => s.status === status);
      }
      return data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch suppliers";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  },
);

export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await supplierApi.create(supplierData);
      Toast.show({ type: "success", text1: "Success", text2: "Supplier created" });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create supplier";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await supplierApi.update(id, data);
      Toast.show({ type: "success", text1: "Success", text2: "Supplier updated" });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update supplier";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      await supplierApi.delete(supplierId);
      Toast.show({ type: "success", text1: "Success", text2: "Supplier deleted" });
      return supplierId;
    } catch (error) {
      const message = error.response?.data?.error || "Failed to delete supplier";
      Toast.show({ type: "error", text1: "Error", text2: message });
      return rejectWithValue(message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export default supplierSlice.reducer;
