import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_TAX_RULES = [
  { id: 't1', name: 'CGST', rate: 2.5, type: 'percentage', active: true },
  { id: 't2', name: 'SGST', rate: 2.5, type: 'percentage', active: true },
  { id: 't3', name: 'Service Charge', rate: 5.0, type: 'percentage', active: false },
];

const DEFAULT_TAX_SETTINGS = {
  inclusive: false,
  compound: false,
  exemptionsEnabled: true,
  taxId: '24AABCU9603R1ZM'
};

const DEFAULT_DISCOUNT_RULES = [
  { id: 'd1', name: 'Employee Discount', type: 'percentage', value: 10, active: true },
  { id: 'd2', name: 'Happy Hour', type: 'percentage', value: 15, active: true },
  { id: 'd3', name: 'VIP Customer', type: 'percentage', value: 20, active: false },
  { id: 'd4', name: 'Flat Off 50', type: 'fixed', value: 50, active: true },
];

const DEFAULT_BILLING_CONFIG = {
  showItemImages: true,
  defaultCategoryView: 'grid', 
  autoPrintBill: false,
  quickCashButtons: true,
  requirePasscodeForVoid: true,
};

// I will keep it empty initially for invoices to avoid bloating initial state too much,
// but the original code generated 50 invoices on load. I'll just leave it empty and let a thunk/action populate it or just include a few.
const mockInvoices = [
  {
    id: "INV-2026-000101", type: "Sales Invoice", date: "2026-06-30T10:15:00Z",
    customer: { name: "John Doe", phone: "+1 234 567 8900", email: "john@example.com" },
    store: "Downtown Branch", cashier: "Alice Smith", paymentMethod: "Credit Card",
    status: "Paid", subtotal: 120.0, discount: 10.0, tax: 8.8, grandTotal: 118.8,
    amountPaid: 118.8, outstandingBalance: 0,
    items: [ { name: "Wireless Mouse", sku: "WM-01", qty: 2, unitPrice: 40.0, tax: 6.4, total: 86.4 } ]
  }
];

const initialState = {
  taxRules: DEFAULT_TAX_RULES,
  taxSettings: DEFAULT_TAX_SETTINGS,
  discountRules: DEFAULT_DISCOUNT_RULES,
  billingConfig: DEFAULT_BILLING_CONFIG,
  invoices: mockInvoices,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    // Tax Reducers
    addTaxRule: (state, action) => {
      state.taxRules.push({ ...action.payload, id: `t${Date.now()}` });
    },
    updateTaxRule: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.taxRules.findIndex(rule => rule.id === id);
      if (index !== -1) Object.assign(state.taxRules[index], updates);
    },
    deleteTaxRule: (state, action) => {
      state.taxRules = state.taxRules.filter(rule => rule.id !== action.payload);
    },
    updateTaxSetting: (state, action) => {
      const { key, value } = action.payload;
      state.taxSettings[key] = value;
    },

    // Discount Reducers
    addDiscountRule: (state, action) => {
      state.discountRules.push({ ...action.payload, id: `d${Date.now()}` });
    },
    updateDiscountRule: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.discountRules.findIndex(rule => rule.id === id);
      if (index !== -1) Object.assign(state.discountRules[index], updates);
    },
    deleteDiscountRule: (state, action) => {
      state.discountRules = state.discountRules.filter(rule => rule.id !== action.payload);
    },

    // Billing Config Reducers
    updateBillingConfig: (state, action) => {
      const { key, value } = action.payload;
      state.billingConfig[key] = value;
    },

    // Invoice Reducers
    addInvoice: (state, action) => {
      const newId = `INV-2026-000${100 + state.invoices.length + 1}`;
      state.invoices.unshift({
        id: newId,
        date: new Date().toISOString(),
        ...action.payload,
      });
    },
    updateInvoiceStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      const index = state.invoices.findIndex(inv => inv.id === id);
      if (index !== -1) state.invoices[index].status = newStatus;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    }
  }
});

export const {
  addTaxRule, updateTaxRule, deleteTaxRule, updateTaxSetting,
  addDiscountRule, updateDiscountRule, deleteDiscountRule,
  updateBillingConfig,
  addInvoice, updateInvoiceStatus, setInvoices
} = billingSlice.actions;

export default billingSlice.reducer;
