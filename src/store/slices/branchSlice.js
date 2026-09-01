import { branchApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchZonesAndTables = createAsyncThunk(
  "branch/fetchZonesAndTables",
  async (branchId, { rejectWithValue }) => {
    try {
      const [zonesRes, tablesRes] = await Promise.all([
        branchApi.getZones(branchId),
        branchApi.getTables(branchId),
      ]);
      return {
        zones: zonesRes.data.data,
        tables: tablesRes.data.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createTable = createAsyncThunk(
  "branch/createTable",
  async (tableData, { rejectWithValue }) => {
    try {
      const res = await branchApi.createTable(tableData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateTable = createAsyncThunk(
  "branch/updateTable",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await branchApi.updateTable(id, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteTable = createAsyncThunk(
  "branch/deleteTable",
  async (id, { rejectWithValue }) => {
    try {
      await branchApi.deleteTable(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchBranchDetails = createAsyncThunk(
  "branch/fetchBranchDetails",
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await branchApi.getById(branchId);
      return res.data?.data || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  activeBranch: null,
  branches: [],
  floors: [],
  tables: [],
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setActiveBranch: (state, action) => {
      state.activeBranch = action.payload;
    },
    updateTableStatus: (state, action) => {
      const { tableId, newStatus } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) table.status = newStatus;
    },
    updateTablePosition: (state, action) => {
      const { tableId, x, y } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.x = x;
        table.y = y;
      }
    },
    updateTableRotation: (state, action) => {
      const { tableId, rotation } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) table.rotation = rotation;
    },
  },
  extraReducers: (builder) => {
    // Set active branch on login
    builder.addCase('auth/performLogin/fulfilled', (state, action) => {
      if (action.payload?.user?.branch_id) {
        state.activeBranch = action.payload.user.branch_id;
      }
    });

    builder.addCase(fetchZonesAndTables.fulfilled, (state, action) => {
      // Map backend zones to floors array
      state.floors = action.payload.zones.map((z) => ({
        id: z.id,
        name: z.name,
      }));

      // Map backend tables to tables array
      state.tables = action.payload.tables.map((t) => ({
        id: t.id,
        name: t.name,
        capacity: t.capacity || 4,
        floorId: t.zone_id,
        status: t.status || "Available",
        span: t.capacity >= 12 ? 3 : t.capacity >= 6 ? 2 : 1,
        shape: t.shape || "rectangle",
        x: t.position_x !== undefined ? t.position_x : 100,
        y: t.position_y !== undefined ? t.position_y : 100,
        rotation: t.rotation || 0,
        order: t.order_data || null,
        merged_tables: t.merged_tables || null,
      }));
    });

    builder.addCase(createTable.fulfilled, (state, action) => {
      const t = action.payload;
      state.tables.push({
        id: t.id,
        name: t.name,
        capacity: t.capacity || 4,
        floorId: t.zone_id,
        status: t.status || "Available",
        span: t.capacity >= 12 ? 3 : t.capacity >= 6 ? 2 : 1,
        shape: t.shape || "rectangle",
        x: t.position_x !== undefined ? t.position_x : 100,
        y: t.position_y !== undefined ? t.position_y : 100,
        rotation: t.rotation || 0,
        order: t.order_data || null,
        merged_tables: t.merged_tables || null,
      });
    });

    builder.addCase(updateTable.fulfilled, (state, action) => {
      const t = action.payload;
      const index = state.tables.findIndex((table) => table.id === t.id);
      if (index !== -1) {
        state.tables[index] = {
          ...state.tables[index],
          name: t.name,
          capacity: t.capacity || 4,
          floorId: t.zone_id,
          status: t.status || "Available",
          span: t.capacity >= 12 ? 3 : t.capacity >= 6 ? 2 : 1,
          shape: t.shape || "rectangle",
          x: t.position_x !== undefined ? t.position_x : 100,
          y: t.position_y !== undefined ? t.position_y : 100,
          rotation: t.rotation || 0,
          order: t.order_data || null,
          merged_tables: t.merged_tables || null,
        };
      }
    });

    builder.addCase(deleteTable.fulfilled, (state, action) => {
      state.tables = state.tables.filter((t) => t.id !== action.payload);
    });
  },
});

export const {
  setActiveBranch,
  updateTableStatus,
  updateTablePosition,
  updateTableRotation,
} = branchSlice.actions;

export default branchSlice.reducer;
