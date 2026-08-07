import { businessApi, branchApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async ({ businessId, branchId }, { rejectWithValue }) => {
    try {
      const [bizRes, branchRes] = await Promise.all([
        businessApi.getById(businessId),
        branchId
          ? branchApi.getById(branchId)
          : Promise.resolve({ data: { data: {} } }),
      ]);

      return {
        business: bizRes.data || {},
        branch: branchRes.data?.data || {},
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "settings/updateBusiness",
  async ({ businessId, data }, { rejectWithValue }) => {
    try {
      const res = await businessApi.update(businessId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateBranchSettings = createAsyncThunk(
  "settings/updateBranch",
  async ({ branchId, data }, { rejectWithValue }) => {
    try {
      const res = await branchApi.update(branchId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    business: {},
    branch: {},
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    clearSettings: (state) => {
      state.business = {};
      state.branch = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.business = action.payload.business;
        state.branch = action.payload.branch;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // updateBusiness
      .addCase(updateBusiness.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      // updateBranchSettings
      .addCase(updateBranchSettings.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateBranchSettings.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(updateBranchSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
