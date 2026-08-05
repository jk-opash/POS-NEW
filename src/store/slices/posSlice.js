import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tableSessions: {},
  takeawaySessions: {},
  activeTakeawayId: null,
  cart: [],
  runningOrder: [],
  kots: [],
  customer: null,
  activeTable: null,
  orderType: "Dine-In",
  draftSplitState: null,
  globalDiscount: { type: "none", value: 0 },
  taxRate: 5,
  compoundingTaxes: [],
  parkedSales: [],
  voidLog: [],
  lastKOTNumber: 0,
  openTabs: [],
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // Session state save
    saveCurrentSession: (state) => {
      if (state.activeTable) {
        state.tableSessions[state.activeTable.id] = {
          cart: state.cart,
          runningOrder: state.runningOrder,
          kots: state.kots,
          customer: state.customer,
          orderType: state.orderType,
          globalDiscount: state.globalDiscount,
          draftSplitState: state.draftSplitState,
        };
      } else if (state.activeTakeawayId) {
        state.takeawaySessions[state.activeTakeawayId] = {
          cart: state.cart,
          runningOrder: state.runningOrder,
          kots: state.kots,
          customer: state.customer,
          orderType: state.orderType,
          globalDiscount: state.globalDiscount,
          draftSplitState: state.draftSplitState,
          createdAt: state.takeawaySessions[state.activeTakeawayId]?.createdAt || new Date().toISOString(),
        };
      }
    },
    createNewTakeaway: (state) => {
      posSlice.caseReducers.saveCurrentSession(state);
      state.activeTable = null;
      state.activeTakeawayId = null;
      state.cart = [];
      state.runningOrder = [];
      state.kots = [];
      state.customer = null;
      state.orderType = "Takeaway";
      state.globalDiscount = { type: "none", value: 0 };
      state.draftSplitState = null;
    },
    setActiveTakeaway: (state, action) => {
      posSlice.caseReducers.saveCurrentSession(state);
      const id = action.payload;
      state.activeTable = null;
      state.activeTakeawayId = id;
      const session = state.takeawaySessions[id] || {
        cart: [], runningOrder: [], kots: [], customer: null, orderType: "Takeaway", globalDiscount: { type: "none", value: 0 }, draftSplitState: null
      };
      state.cart = session.cart;
      state.runningOrder = session.runningOrder;
      state.kots = session.kots;
      state.customer = session.customer;
      state.orderType = session.orderType;
      state.globalDiscount = session.globalDiscount;
      state.draftSplitState = session.draftSplitState;
    },
    setActiveTable: (state, action) => {
      posSlice.caseReducers.saveCurrentSession(state);
      const newTable = action.payload;
      state.activeTakeawayId = null;
      if (newTable) {
        const session = state.tableSessions[newTable.id] || {
          cart: [], runningOrder: [], kots: [], customer: null, orderType: "Dine-In", globalDiscount: { type: "none", value: 0 }, draftSplitState: null
        };
        state.cart = session.cart;
        state.runningOrder = session.runningOrder;
        state.kots = session.kots;
        state.customer = session.customer;
        state.orderType = session.orderType;
        state.globalDiscount = session.globalDiscount;
        state.draftSplitState = session.draftSplitState;
      } else {
        state.cart = [];
        state.runningOrder = [];
        state.kots = [];
        state.customer = null;
        state.orderType = "Takeaway";
        state.globalDiscount = { type: "none", value: 0 };
        state.draftSplitState = null;
      }
      state.activeTable = newTable;
    },

    setCart: (state, action) => { state.cart = action.payload; },
    setRunningOrder: (state, action) => { state.runningOrder = action.payload; },
    setKots: (state, action) => { state.kots = action.payload; },
    setCustomer: (state, action) => { state.customer = action.payload; },
    setOrderType: (state, action) => { state.orderType = action.payload; },
    setDraftSplitState: (state, action) => { state.draftSplitState = action.payload; },
    setGlobalDiscount: (state, action) => { state.globalDiscount = action.payload; },
    setTaxRate: (state, action) => { state.taxRate = action.payload; },
    setCompoundingTaxes: (state, action) => { state.compoundingTaxes = action.payload; },

    // Cart operations
    addToCart: (state, action) => {
      const { product, variant, addons, quantity, notes } = action.payload;
      const runningIdx = state.runningOrder.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id && JSON.stringify(item.addons) === JSON.stringify(addons)
      );
      let existingId = runningIdx >= 0 ? state.runningOrder[runningIdx].id : null;

      const existingIdx = state.cart.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id && JSON.stringify(item.addons) === JSON.stringify(addons)
      );
      if (existingIdx >= 0) {
        state.cart[existingIdx].quantity += quantity;
        if (notes) state.cart[existingIdx].notes = notes;
      } else {
        state.cart.push({
          id: existingId || `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product, variant, addons, quantity, discount: { type: "none", value: 0 }, notes, employee: null,
        });
      }
    },
    updateQuantity: (state, action) => {
      const { cartItemId, newQuantity } = action.payload;
      if (newQuantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== cartItemId);
        state.runningOrder = state.runningOrder.filter(i => i.id !== cartItemId);
        return;
      }
      const runningItem = state.runningOrder.find(i => i.id === cartItemId);
      const runningQty = runningItem ? runningItem.quantity : 0;

      if (newQuantity > runningQty) {
        const cartQty = newQuantity - runningQty;
        const existingIdx = state.cart.findIndex(i => i.id === cartItemId);
        if (existingIdx >= 0) {
          state.cart[existingIdx].quantity = cartQty;
        } else if (runningItem) {
          state.cart.push({ ...runningItem, quantity: cartQty });
        } else {
          const cartItem = state.cart.find(i => i.id === cartItemId);
          if (cartItem) cartItem.quantity = newQuantity;
        }
      } else {
        state.cart = state.cart.filter(i => i.id !== cartItemId);
        const rItem = state.runningOrder.find(i => i.id === cartItemId);
        if (rItem) rItem.quantity = newQuantity;
      }
    },
    updateCartItem: (state, action) => {
      const { cartItemId, updates } = action.payload;
      const cItem = state.cart.find(i => i.id === cartItemId);
      if (cItem) Object.assign(cItem, updates);
      const rItem = state.runningOrder.find(i => i.id === cartItemId);
      if (rItem) Object.assign(rItem, updates);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(i => i.id !== action.payload);
      state.runningOrder = state.runningOrder.filter(i => i.id !== action.payload);
    },
    clearCart: (state) => {
      if (state.activeTable) {
        delete state.tableSessions[state.activeTable.id];
      } else if (state.activeTakeawayId) {
        delete state.takeawaySessions[state.activeTakeawayId];
      }
      state.cart = [];
      state.runningOrder = [];
      state.kots = [];
      state.customer = null;
      state.activeTable = null;
      state.activeTakeawayId = null;
      state.globalDiscount = { type: "none", value: 0 };
      state.orderType = "Takeaway";
      state.draftSplitState = null;
    },
    
    // KOT operations
    generateKOT: (state) => {
      if (state.cart.length === 0) return;
      const newKOTNumber = state.lastKOTNumber + 1;
      state.lastKOTNumber = newKOTNumber;

      const newKOT = {
        id: `KOT-${Date.now()}`,
        kotNumber: newKOTNumber,
        time: new Date().toISOString(),
        items: [...state.cart],
        status: "Sent",
        table: state.activeTable,
        orderType: state.orderType
      };
      state.kots.push(newKOT);

      const taggedCart = state.cart.map(item => ({
        ...item, kotId: newKOT.id, kotNumber: newKOT.kotNumber
      }));
      state.runningOrder.push(...taggedCart);

      if (state.orderType === "Takeaway" && !state.activeTakeawayId) {
        const newId = state.customer?.name ? `Takeaway-${state.customer.name.replace(/\s+/g, '-')}` : `Takeaway-${Math.floor(Date.now() / 1000)}`;
        state.activeTakeawayId = newId;
        state.takeawaySessions[newId] = {
          cart: [], runningOrder: [...state.runningOrder], kots: [...state.kots], customer: state.customer, orderType: "Takeaway",
          globalDiscount: state.globalDiscount, draftSplitState: state.draftSplitState, createdAt: new Date().toISOString()
        };
      }
      state.cart = [];
    },

    // Voids
    voidItem: (state, action) => {
      const { cartItemId, reason, cashierId } = action.payload;
      const item = state.cart.find(i => i.id === cartItemId) || state.runningOrder.find(i => i.id === cartItemId);
      if (item) {
        state.voidLog.unshift({
          id: `VOID-${Date.now()}`, productId: item.product.id, productName: item.product.name, quantity: item.quantity,
          reason, cashierId, timestamp: new Date().toISOString(),
        });
        state.cart = state.cart.filter(i => i.id !== cartItemId);
        state.runningOrder = state.runningOrder.filter(i => i.id !== cartItemId);
      }
    },
    voidEntireCart: (state, action) => {
      const { reason, cashierId } = action.payload;
      [...state.cart, ...state.runningOrder].forEach(item => {
        state.voidLog.unshift({
          id: `VOID-${Date.now()}-${item.product.id}`, productId: item.product.id, productName: item.product.name, quantity: item.quantity,
          reason, cashierId, timestamp: new Date().toISOString(),
        });
      });
      posSlice.caseReducers.clearCart(state);
    },

    // Park / Hold operations
    parkSale: (state, action) => {
      const ticketName = action.payload;
      if (state.cart.length === 0 && state.runningOrder.length === 0) return;
      const ticket = {
        id: `PKD-${Date.now()}`,
        name: ticketName || `Ticket #${state.parkedSales.length + 1}`,
        cart: [...state.cart],
        runningOrder: [...state.runningOrder],
        kots: [...state.kots],
        customer: state.customer,
        activeTable: state.activeTable,
        orderType: state.orderType,
        globalDiscount: state.globalDiscount,
        time: new Date().toISOString(),
      };
      state.parkedSales.push(ticket);
      posSlice.caseReducers.clearCart(state);
    },
    restoreParkedSale: (state, action) => {
      const ticketId = action.payload;
      const ticket = state.parkedSales.find(t => t.id === ticketId);
      if (!ticket) return;
      
      posSlice.caseReducers.saveCurrentSession(state);
      
      state.cart = ticket.cart || [];
      state.runningOrder = ticket.runningOrder || [];
      state.kots = ticket.kots || [];
      state.customer = ticket.customer;
      state.orderType = ticket.orderType;
      state.globalDiscount = ticket.globalDiscount || { type: "none", value: 0 };
      state.activeTable = ticket.activeTable || null;

      if (ticket.activeTable) {
        state.tableSessions[ticket.activeTable.id] = {
          cart: state.cart, runningOrder: state.runningOrder, kots: state.kots, customer: state.customer, orderType: state.orderType,
          globalDiscount: state.globalDiscount, draftSplitState: null
        };
      }
      state.parkedSales = state.parkedSales.filter(t => t.id !== ticketId);
    },
    deleteParkedSale: (state, action) => {
      state.parkedSales = state.parkedSales.filter(t => t.id !== action.payload);
    },
    holdCart: (state, action) => {
      const tabName = action.payload;
      if (state.cart.length === 0) return;
      state.openTabs.push({
        id: `TAB-${Date.now()}`,
        name: tabName || (state.activeTable ? `Table ${state.activeTable.name}` : `Tab ${state.openTabs.length + 1}`),
        cart: [...state.cart],
        customer: state.customer,
        activeTable: state.activeTable,
        orderType: state.orderType,
        globalDiscount: state.globalDiscount,
        time: new Date().toISOString(),
      });
      posSlice.caseReducers.clearCart(state);
    },
    restoreTab: (state, action) => {
      const tabId = action.payload;
      const tab = state.openTabs.find(t => t.id === tabId);
      if (!tab) return;
      state.cart = tab.cart;
      state.customer = tab.customer;
      state.activeTable = tab.activeTable;
      state.orderType = tab.orderType;
      state.globalDiscount = tab.globalDiscount;
      state.openTabs = state.openTabs.filter(t => t.id !== tabId);
    },
    injectTableOrder: (state, action) => {
      const { tableId, orderObj } = action.payload;
      const session = state.tableSessions[tableId] || {
        cart: [], runningOrder: [], kots: [], customer: null, orderType: "Dine-In", globalDiscount: { type: "none", value: 0 }, draftSplitState: null
      };

      const newKOTNumber = (session.kots.length || 0) + 1;
      const newKOT = {
        id: `KOT-${Date.now()}`,
        kotNumber: newKOTNumber,
        time: new Date().toISOString(),
        items: orderObj.items.map(i => ({
          ...i,
          product: { id: i.id || `prod_${Date.now()}`, name: i.name, price: i.price, pricing: { sellingPrice: i.price } },
          quantity: i.qty || 1,
        })),
        status: "Sent",
        table: { id: tableId, name: orderObj.customer },
        orderType: "Dine-In"
      };

      const taggedCart = newKOT.items.map(item => ({
        ...item, kotId: newKOT.id, kotNumber: newKOT.kotNumber, discount: { type: "none", value: 0 },
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));

      state.tableSessions[tableId] = {
        ...session,
        customer: { name: orderObj.customer, phone: orderObj.phone },
        runningOrder: [...session.runningOrder, ...taggedCart],
        kots: [...session.kots, newKOT],
      };
    }
  }
});

export const {
  saveCurrentSession, createNewTakeaway, setActiveTakeaway, setActiveTable,
  setCart, setRunningOrder, setKots, setCustomer, setOrderType, setDraftSplitState, setGlobalDiscount, setTaxRate, setCompoundingTaxes,
  addToCart, updateQuantity, updateCartItem, removeFromCart, clearCart,
  generateKOT, voidItem, voidEntireCart,
  parkSale, restoreParkedSale, deleteParkedSale,
  holdCart, restoreTab, injectTableOrder
} = posSlice.actions;

export default posSlice.reducer;
