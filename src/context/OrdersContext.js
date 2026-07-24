import React, { createContext, useContext, useState } from 'react';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const addOrder = (orderData) => {
    setOrders(prev => [orderData, ...prev]);
  };

  const updateOrder = (orderId, updatedFields) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields } : o));
  };

  const voidItem = (orderId, itemIndex) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const newItems = [...o.items];
      newItems[itemIndex] = { ...newItems[itemIndex], voided: true };
      return { ...o, items: newItems };
    }));
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders, updateOrderStatus, voidItem, addOrder, updateOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
