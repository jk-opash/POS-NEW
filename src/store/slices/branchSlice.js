import { createSlice } from '@reduxjs/toolkit';

const MOCK_FLOORS = [
  { id: 'F1', name: '1st Floor' },
  { id: 'F2', name: '2nd Floor' },
  { id: 'F3', name: '3rd Floor' },
];

const MOCK_TABLES = [
  { id: 'T1', name: 'A1', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 50 },
  { id: 'T2', name: 'A2', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 200, y: 50 },
  { id: 'T3', name: 'A3', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 350, y: 50 },
  { id: 'T4', name: 'A4', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 600, y: 50 },
  { id: 'T5', name: 'A5', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 50 },
  { id: 'T6', name: 'A6', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 200 },
  { id: 'T7', name: 'A7', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 200, y: 200 },
  { id: 'T8', name: 'A8', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 350, y: 200 },
  { id: 'T9', name: 'A9', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 500, y: 200 },
  { id: 'T10', name: 'A10', capacity: 2, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 200 },
  { id: 'T11', name: 'A11', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 50, y: 350 },
  { id: 'T12', name: 'A12', capacity: 6, floorId: 'F1', status: 'Available', span: 2, x: 200, y: 350 },
  { id: 'T13', name: 'A13', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 450, y: 350 },
  { id: 'T14', name: 'A14', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 600, y: 350 },
  { id: 'T15', name: 'A15', capacity: 4, floorId: 'F1', status: 'Available', span: 1, x: 750, y: 350 },
  { id: 'T16', name: 'B1', capacity: 4, floorId: 'F2', status: 'Available', span: 1, x: 50, y: 50 },
  { id: 'T17', name: 'B2', capacity: 4, floorId: 'F2', status: 'Available', span: 1, x: 200, y: 50 },
];

const MOCK_BRANCHES = [
  {
    id: "br-1",
    name: "CG Road - Navrangpura",
    code: "SGR-01",
    type: "Restaurant",
    company: "Spice Garden Restaurants Pvt Ltd",
    region: "West India",
    contact: "+91 79 2345 6789",
    email: "cg-road@spicegarden.in",
    address: "12, CG Road, Navrangpura",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    taxJurisdiction: "GST - Gujarat",
    storeSize: "3000 sqft",
    openingDate: "2021-03-15",
    taxRegistration: "24AABCU9603R1ZM",
    status: "Operational",
    manager: "Rajesh Patel",
    capacity: 80,
    tables: 20,
    schedule: {
      weekday: "11:00 AM - 11:00 PM",
      weekend: "11:00 AM - 11:30 PM",
    },
    metrics: {
      todaySales: 42800,
      ordersProcessed: 67,
      revenue: 1280000,
      profit: 512000,
      inventoryValue: 180000,
      employeeCount: 18,
      customerCount: 4200,
      averageCheckoutTime: "3m 30s",
      conversionRate: "N/A",
      shrinkage: "1.2%",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "br-2",
    name: "SG Highway - Bodakdev",
    code: "SGR-02",
    type: "Restaurant + Banquet",
    company: "Spice Garden Restaurants Pvt Ltd",
    region: "West India",
    contact: "+91 79 2345 6790",
    email: "sg-highway@spicegarden.in",
    address: "A-5, SG Business Hub, SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    taxJurisdiction: "GST - Gujarat",
    storeSize: "5500 sqft",
    openingDate: "2022-08-10",
    taxRegistration: "24AABCU9603R2ZM",
    status: "Operational",
    manager: "Meena Shah",
    capacity: 120,
    tables: 30,
    schedule: {
      weekday: "11:00 AM - 11:30 PM",
      weekend: "11:00 AM - 12:00 AM",
    },
    metrics: {
      todaySales: 58500,
      ordersProcessed: 92,
      revenue: 1750000,
      profit: 700000,
      inventoryValue: 250000,
      employeeCount: 25,
      customerCount: 6800,
      averageCheckoutTime: "4m 00s",
      conversionRate: "N/A",
      shrinkage: "0.9%",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "br-3",
    name: "Surat - Adajan",
    code: "SGR-03",
    type: "Restaurant",
    company: "Spice Garden Restaurants Pvt Ltd",
    region: "South Gujarat",
    contact: "+91 261 234 5678",
    email: "surat@spicegarden.in",
    address: "22, Ring Road, Adajan",
    city: "Surat",
    state: "Gujarat",
    country: "India",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    taxJurisdiction: "GST - Gujarat",
    storeSize: "2800 sqft",
    openingDate: "2023-11-01",
    taxRegistration: "24AABCU9603R3ZM",
    status: "Operational",
    manager: "Vijay Singh",
    capacity: 60,
    tables: 15,
    schedule: {
      weekday: "11:00 AM - 10:30 PM",
      weekend: "11:00 AM - 11:00 PM",
    },
    metrics: {
      todaySales: 28500,
      ordersProcessed: 45,
      revenue: 850000,
      profit: 340000,
      inventoryValue: 140000,
      employeeCount: 12,
      customerCount: 2800,
      averageCheckoutTime: "3m 15s",
      conversionRate: "N/A",
      shrinkage: "1.5%",
    },
    createdAt: new Date().toISOString(),
  },
];

const initialState = {
  activeBranch: "br-1",
  branches: MOCK_BRANCHES,
  floors: MOCK_FLOORS,
  tables: MOCK_TABLES,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setActiveBranch: (state, action) => {
      state.activeBranch = action.payload;
    },
    addBranch: (state, action) => {
      state.branches.push({
        ...action.payload,
        id: `br-${Date.now()}`,
        metrics: {
          todaySales: 0, ordersProcessed: 0, revenue: 0, profit: 0, inventoryValue: 0,
          employeeCount: 0, customerCount: 0, averageCheckoutTime: "0s", conversionRate: "0%", shrinkage: "0%",
        },
        createdAt: new Date().toISOString(),
      });
    },
    updateBranch: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.branches.findIndex(b => b.id === id);
      if (index !== -1) {
        state.branches[index] = { ...state.branches[index], ...updates };
      }
    },
    deleteBranch: (state, action) => {
      state.branches = state.branches.filter(b => b.id !== action.payload);
    },
    updateTableStatus: (state, action) => {
      const { tableId, newStatus } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) table.status = newStatus;
    },
    updateTablePosition: (state, action) => {
      const { tableId, x, y } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) { table.x = x; table.y = y; }
    },
    updateTableRotation: (state, action) => {
      const { tableId, rotation } = action.payload;
      const table = state.tables.find(t => t.id === tableId);
      if (table) table.rotation = rotation;
    },
    addTable: (state, action) => {
      const { floorId, config } = action.payload;
      state.tables.push({
        id: `T${Date.now()}`,
        name: config.name || `New`,
        floorId,
        status: 'Available',
        rotation: 0,
        x: 100, y: 100,
        ...config,
      });
    },
    updateTableDetails: (state, action) => {
      const { tableId, newDetails } = action.payload;
      const index = state.tables.findIndex(t => t.id === tableId);
      if (index !== -1) {
        state.tables[index] = { ...state.tables[index], ...newDetails };
      }
    },
    deleteTable: (state, action) => {
      state.tables = state.tables.filter(t => t.id !== action.payload);
    },
    mergeTables: (state, action) => {
      const tableIds = action.payload;
      if (!tableIds || tableIds.length < 2) return;
      
      const tablesToMerge = state.tables.filter(t => tableIds.includes(t.id));
      if (tablesToMerge.length < 2) return;
      
      const newName = tablesToMerge.map(t => t.name).join('+');
      const newCapacity = tablesToMerge.reduce((sum, t) => sum + (t.capacity || 0), 0);
      const avgX = tablesToMerge.reduce((sum, t) => sum + t.x, 0) / tablesToMerge.length;
      const avgY = tablesToMerge.reduce((sum, t) => sum + t.y, 0) / tablesToMerge.length;
      
      let newStatus = 'Available';
      if (tablesToMerge.some(t => t.status === 'Occupied')) newStatus = 'Occupied';
      else if (tablesToMerge.some(t => t.status === 'Reserved')) newStatus = 'Reserved';
      
      const allOrders = tablesToMerge.map(t => t.order).filter(Boolean).flat();
      const newOrder = allOrders.length > 0 ? allOrders : null;
      
      const mergedTable = {
        id: `T${Date.now()}`,
        name: newName,
        capacity: newCapacity,
        floorId: tablesToMerge[0].floorId,
        status: newStatus,
        x: avgX, y: avgY,
        rotation: 0,
        span: Math.max(...tablesToMerge.map(t => t.span || 1)) + (tablesToMerge.length > 2 ? 1 : 0),
        order: newOrder,
        originalTables: tablesToMerge 
      };
      
      state.tables = state.tables.filter(t => !tableIds.includes(t.id));
      state.tables.push(mergedTable);
    },
    unmergeTable: (state, action) => {
      const tableId = action.payload;
      const tableToUnmerge = state.tables.find(t => t.id === tableId);
      if (!tableToUnmerge || !tableToUnmerge.originalTables) return;
      
      const restoredTables = tableToUnmerge.originalTables.map(t => ({
        ...t, status: 'Available', order: null
      }));
      
      state.tables = state.tables.filter(t => t.id !== tableId);
      state.tables.push(...restoredTables);
    },
  },
});

export const {
  setActiveBranch, addBranch, updateBranch, deleteBranch,
  updateTableStatus, updateTablePosition, updateTableRotation, addTable, updateTableDetails, deleteTable, mergeTables, unmergeTable
} = branchSlice.actions;

export default branchSlice.reducer;
