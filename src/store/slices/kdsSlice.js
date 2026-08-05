import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeOrders: [],
  stations: [
    "All", "Main Kitchen", "Tandoor", "Chinese", "South Indian", "Beverage", "Bakery"
  ]
};

const kdsSlice = createSlice({
  name: 'kds',
  initialState,
  reducers: {
    markReadyItemsAsServed: (state, action) => {
      const orderId = action.payload;
      const order = state.activeOrders.find(o => o.id === orderId);
      if (order) {
        order.items.forEach(item => {
          if (item.status === "Done" || item.status === "Completed" || item.status === "Ready") {
            item.status = "Served";
          }
        });
        const statuses = order.items.map(i => i.status);
        if (statuses.some(s => s === "Preparing")) order.status = "Preparing";
        else if (statuses.every(s => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) order.status = "Completed";
        else if (statuses.some(s => s === "Done" || s === "Served")) order.status = "Preparing";
        else if (statuses.every(s => s === "Accepted")) order.status = "Accepted";
      }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const order = state.activeOrders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
        order.items.forEach(i => i.status = newStatus);
      }
    },
    updateItemStatus: (state, action) => {
      const { orderId, itemId, newStatus } = action.payload;
      const order = state.activeOrders.find(o => o.id === orderId);
      if (order) {
        const item = order.items.find(i => i.id === itemId);
        if (item) item.status = newStatus;

        const statuses = order.items.map(i => i.status);
        if (statuses.some(s => s === "Preparing")) order.status = "Preparing";
        else if (statuses.every(s => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) order.status = "Completed";
        else if (statuses.some(s => s === "Done" || s === "Served")) order.status = "Preparing";
        else if (statuses.every(s => s === "Accepted")) order.status = "Accepted";
      }
    },
    cancelItemInKDS: (state, action) => {
      const itemId = action.payload;
      state.activeOrders.forEach(order => {
        const idx = order.items.findIndex(i => i.id === itemId);
        if (idx !== -1) {
          order.items.splice(idx, 1);
          const statuses = order.items.map(i => i.status);
          if (statuses.length === 0) order.status = "Completed";
          else if (statuses.some(s => s === "Preparing")) order.status = "Preparing";
          else if (statuses.every(s => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) order.status = "Completed";
          else if (statuses.some(s => s === "Done" || s === "Served")) order.status = "Preparing";
          else if (statuses.every(s => s === "Accepted")) order.status = "Accepted";
        }
      });
      state.activeOrders = state.activeOrders.filter(o => o.items.length > 0);
    },
    updateItemQtyInKDS: (state, action) => {
      const { itemId, qty } = action.payload;
      state.activeOrders.forEach(order => {
        const item = order.items.find(i => i.id === itemId);
        if (item) item.qty = qty;
      });
    },
    updateOrderPriority: (state, action) => {
      const { orderId, newPriority } = action.payload;
      const order = state.activeOrders.find(o => o.id === orderId);
      if (order) order.priority = newPriority;
    },
    completeTableOrdersInKDS: (state, action) => {
      const tableName = action.payload;
      state.activeOrders.forEach(order => {
        const matchesTable = tableName ? (order.table === `Table ${tableName}` || order.table === tableName) : false;
        if (matchesTable) {
          order.status = "Completed";
          order.items.forEach(i => i.status = "Served");
        }
      });
      state.activeOrders = state.activeOrders.filter(o => o.status !== "Completed");
    },
    completeOrderInKDS: (state, action) => {
      state.activeOrders = state.activeOrders.filter(o => o.id !== action.payload);
    },
    addOrderToKDS: (state, action) => {
      const kot = action.payload;
      if (!kot || !kot.items || kot.items.length === 0) return;
      const items = kot.items.map(c => {
        let modifiers = [];
        if (c.variant) modifiers.push(c.variant.name);
        if (c.addons && c.addons.length > 0) modifiers.push(...c.addons.map(a => a.name));
        return { id: c.id, name: c.product.name, qty: c.quantity, modifiers, status: "Accepted", note: c.note || "" };
      });
      state.activeOrders.push({
        id: `KDS-${kot.kotNumber}`, orderNumber: `KOT-${kot.kotNumber}`, type: kot.orderType,
        table: kot.table ? `Table ${kot.table.name}` : null, customer: kot.customer ? kot.customer.name : "Walk-in",
        status: "Accepted", priority: "Normal", station: "All", startTime: new Date().toISOString(), items, notes: "",
      });
    },
    addOnlineOrderToKDS: (state, action) => {
      const onlineOrder = action.payload;
      if (!onlineOrder || !onlineOrder.items || onlineOrder.items.length === 0) return;
      const items = onlineOrder.items.map((c, index) => ({
        id: `${onlineOrder.id}-item-${index}`, name: c.name, qty: c.qty, modifiers: [], status: "Accepted", note: "",
      }));
      state.activeOrders.push({
        id: `KDS-${onlineOrder.id}`, orderNumber: `${onlineOrder.platform} #${onlineOrder.orderId}`, type: "Online Delivery",
        table: null, customer: onlineOrder.customer || onlineOrder.platform, status: "Accepted", priority: "Normal",
        station: "All", startTime: new Date().toISOString(), items, notes: onlineOrder.instructions || "",
      });
    },
    replaceTableOrderInKDS: (state, action) => {
      const { tableName, orderData } = action.payload;
      state.activeOrders = state.activeOrders.filter(o => o.table !== `Table ${tableName}`);
      kdsSlice.caseReducers.addOrderToKDS(state, { payload: orderData });
    }
  }
});

export const {
  markReadyItemsAsServed, updateOrderStatus, updateItemStatus, cancelItemInKDS, updateItemQtyInKDS,
  updateOrderPriority, completeTableOrdersInKDS, completeOrderInKDS, addOrderToKDS, addOnlineOrderToKDS, replaceTableOrderInKDS
} = kdsSlice.actions;

export default kdsSlice.reducer;
