import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) order.status = newStatus;
    },
    updateOrder: (state, action) => {
      const { orderId, updatedFields } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) Object.assign(order, updatedFields);
    },
    voidItem: (state, action) => {
      const { orderId, itemIndex } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order && order.items && order.items[itemIndex]) {
        order.items[itemIndex].voided = true;
      }
    }
  }
});

export const { setOrders, addOrder, updateOrderStatus, updateOrder, voidItem } = ordersSlice.actions;

export default ordersSlice.reducer;
