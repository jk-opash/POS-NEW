import { createSlice } from '@reduxjs/toolkit';

const MOCK_INVENTORY = [
  { id: 'INV-101', name: 'Classic Burger Patty', sku: 'PAT-001', category: 'Raw Materials', inStock: 450, reserved: 50, reorderLevel: 200, unit: 'pcs', price: 25, status: 'Normal', lastCounted: '2023-10-01' },
  { id: 'INV-102', name: 'Burger Buns (Pack of 12)', sku: 'BUN-012', category: 'Raw Materials', inStock: 45, reserved: 10, reorderLevel: 100, unit: 'packs', price: 60, status: 'Low', lastCounted: '2023-10-05' },
];
const MOCK_TRANSFERS = [];
const MOCK_ADJUSTMENTS = [];
const MOCK_QUARANTINE = [];
const MOCK_AUDIT_LOG = [];

const DUMMY_SUPPLIERS = [
  {
    id: "SUP-001", name: "Fresh Farms Corp", businessName: "Fresh Farms Agriculture", category: "Manufacturer", status: "Active",
    stats: { totalOrders: 145, totalSpend: 54200.50, outstandingBalance: 1200.00, lastOrderDate: "2026-06-25", avgDeliveryTime: "2 Days", returnRate: "1.2%" },
    communications: []
  },
];

const MOCK_POS = [
  {
    id: 'PO-1001', supplierId: 'SUP-001', supplierName: 'Metro Wholesale', status: 'Draft',
    items: [ { itemId: 'ITM-001', name: 'Whole Milk 1L', quantity: 50, costPrice: 45, received: 0 } ],
    total: 2250, createdAt: '2026-06-28T10:00:00Z', createdBy: 'EMP-1001', notes: 'Monthly restock',
  }
];

const initialState = {
  // Inventory
  inventory: MOCK_INVENTORY,
  transfers: MOCK_TRANSFERS,
  adjustments: MOCK_ADJUSTMENTS,
  quarantine: MOCK_QUARANTINE,
  auditLogs: MOCK_AUDIT_LOG,
  activeLocation: 'All',
  stockLedger: [],
  stockAdjustments: [],
  lowStockAlerts: [],

  // Suppliers
  suppliers: DUMMY_SUPPLIERS,

  // Purchase Orders
  purchaseOrders: MOCK_POS,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Inventory Actions
    setInventory: (state, action) => { state.inventory = action.payload; },
    addInventoryItem: (state, action) => { state.inventory.unshift(action.payload); },
    deleteInventoryItem: (state, action) => { state.inventory = state.inventory.filter(i => i.id !== action.payload); },
    deductRawMaterials: (state, action) => {
      const { recipeArray, multiplier } = action.payload;
      recipeArray.forEach(recipeItem => {
        const item = state.inventory.find(i => i.id === recipeItem.rawMaterialId);
        if (item) item.inStock = Math.max(0, item.inStock - (recipeItem.qty * multiplier));
      });
    },
    setActiveLocation: (state, action) => { state.activeLocation = action.payload; },
    logStockMovement: (state, action) => {
      const entry = { id: `SL-${Date.now()}`, ...action.payload, timestamp: new Date().toISOString() };
      state.stockLedger.unshift(entry);
    },
    addStockAdjustment: (state, action) => {
      const adjustment = { id: `ADJ-${Date.now()}`, ...action.payload, timestamp: new Date().toISOString() };
      state.stockAdjustments.unshift(adjustment);
    },
    setLowStockAlerts: (state, action) => { state.lowStockAlerts = action.payload; },

    // Supplier Actions
    addSupplier: (state, action) => { state.suppliers.push({ ...action.payload, id: `SUP-${String(state.suppliers.length + 1).padStart(3, '0')}` }); },
    updateSupplier: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.suppliers.findIndex(s => s.id === id);
      if (index !== -1) Object.assign(state.suppliers[index], updates);
    },
    recordSupplierPayment: (state, action) => {
      const { supplierId, amount, method, reference } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplier.stats.outstandingBalance = Math.max(0, supplier.stats.outstandingBalance - (parseFloat(amount) || 0));
        supplier.communications.unshift({
          id: Date.now(), type: "Payment", date: new Date().toISOString().split('T')[0],
          summary: `Paid ₹${amount} via ${method} (Ref: ${reference || 'N/A'})`
        });
      }
    },
    createSupplierPO: (state, action) => {
      const { supplierId, poData } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplier.stats.totalOrders += 1;
        supplier.stats.lastOrderDate = new Date().toISOString().split('T')[0];
        supplier.communications.unshift({
          id: Date.now(), type: "PO Created", date: new Date().toISOString().split('T')[0],
          summary: `PO generated for Expected Delivery: ${poData.expectedDate}. Notes: ${poData.notes}`
        });
      }
    },
    logSupplierCommunication: (state, action) => {
      const { supplierId, comm } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplier.communications.unshift({ id: Date.now(), ...comm });
      }
    },
    mapSupplierProduct: (state, action) => {
      const { supplierId, product } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      if (supplier) {
        if (!supplier.products) supplier.products = [];
        supplier.products.push(product.name);
      }
    },

    // Purchase Order Actions
    createPO: (state, action) => {
      const poData = action.payload;
      state.purchaseOrders.unshift({
        ...poData,
        id: `PO-${1000 + state.purchaseOrders.length + 1}`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        items: poData.items.map(i => ({ ...i, received: 0 })),
        total: poData.items.reduce((sum, i) => sum + (i.quantity * i.costPrice), 0),
      });
    },
    updatePOStatus: (state, action) => {
      const { poId, newStatus } = action.payload;
      const po = state.purchaseOrders.find(p => p.id === poId);
      if (po) po.status = newStatus;
    },
    receivePOItems: (state, action) => {
      const { poId, receivedMap } = action.payload;
      const po = state.purchaseOrders.find(p => p.id === poId);
      if (po) {
        po.items.forEach(item => {
          if (receivedMap[item.itemId] !== undefined) item.received = receivedMap[item.itemId];
        });
        const allReceived = po.items.every(i => i.received >= i.quantity);
        const someReceived = po.items.some(i => i.received > 0);
        po.status = allReceived ? 'Fully Received' : someReceived ? 'Partially Received' : po.status;
      }
    },
    deletePO: (state, action) => {
      state.purchaseOrders = state.purchaseOrders.filter(p => p.id !== action.payload);
    },
  }
});

export const {
  setInventory, addInventoryItem, deleteInventoryItem, deductRawMaterials,
  setActiveLocation, logStockMovement, addStockAdjustment, setLowStockAlerts,
  addSupplier, updateSupplier, recordSupplierPayment, createSupplierPO, logSupplierCommunication, mapSupplierProduct,
  createPO, updatePOStatus, receivePOItems, deletePO
} = inventorySlice.actions;

export default inventorySlice.reducer;
