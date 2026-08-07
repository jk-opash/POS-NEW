import { menuApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMenuData = createAsyncThunk(
  "menu/fetchMenuData",
  async (branchId, { rejectWithValue }) => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        menuApi.getItems(branchId),
        menuApi.getCategories(branchId),
      ]);
      return {
        items: itemsRes.data?.data || itemsRes.data || [],
        categories: catsRes.data?.data || catsRes.data || [],
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id, { rejectWithValue }) => {
    try {
      await menuApi.deleteItem(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateMenuItemStatus = createAsyncThunk(
  "menu/updateMenuItemStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await menuApi.updateItem(id, { status });
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await menuApi.createItem(payload);
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await menuApi.updateItem(id, payload);
      return res.data?.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearMenu: (state) => {
      state.items = [];
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const rawCategories = action.payload.categories || [];
        state.categories = rawCategories;
        
        state.items = (action.payload.items || []).map((item) => {
          let categoryName = "Uncategorized";
          let subCategoryName = item.food_type || "Other";

          if (item.category && item.category.name) {
             categoryName = item.category.name;
             if (item.sub_category && item.category.sub_categories) {
                const subCat = item.category.sub_categories.find(sc => sc.id === item.sub_category);
                if (subCat) {
                    subCategoryName = subCat.name;
                }
             }
          }

          return {
             ...item,
             category: categoryName,
             subCategory: subCategoryName,
             pricing: {
               sellingPrice: parseFloat(item.base_price) || 0
             }
          };
        });
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deleteMenuItem - optimistic: remove from list, refetch on error
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => {
          const id = item._id || item.id;
          return id !== action.payload;
        });
      })
      // updateMenuItemStatus - update in place
      .addCase(updateMenuItemStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const id = action.payload._id || action.payload.id;
          const index = state.items.findIndex((item) => (item._id || item.id) === id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], status: action.payload.status };
          }
        }
      })
      // createMenuItem - will be followed by a full refetch in the component
      .addCase(createMenuItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      // updateMenuItem - update in place
      .addCase(updateMenuItem.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
