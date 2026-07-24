import React, { createContext, useContext, useState, useCallback } from 'react';

const PurchaseOrderContext = createContext();

const MOCK_POS = [
  {
    id: 'PO-1001',
    supplierId: 'SUP-001',
    supplierName: 'Metro Wholesale',
    status: 'Draft',
    items: [
      { itemId: 'ITM-001', name: 'Whole Milk 1L', quantity: 50, costPrice: 45, received: 0 },
      { itemId: 'ITM-002', name: 'Espresso Beans 1kg', quantity: 10, costPrice: 850, received: 0 },
    ],
    total: 10750,
    createdAt: '2026-06-28T10:00:00Z',
    createdBy: 'EMP-1001',
    notes: 'Monthly restock',
  },
  {
    id: 'PO-1002',
    supplierId: 'SUP-002',
    supplierName: 'Fresh Farms',
    status: 'Sent',
    items: [
      { itemId: 'ITM-003', name: 'Tomatoes 1kg', quantity: 30, costPrice: 40, received: 0 },
      { itemId: 'ITM-004', name: 'Onions 1kg', quantity: 25, costPrice: 30, received: 0 },
      { itemId: 'ITM-005', name: 'Lettuce Head', quantity: 20, costPrice: 25, received: 0 },
    ],
    total: 2450,
    createdAt: '2026-06-29T14:00:00Z',
    createdBy: 'EMP-1001',
    notes: 'Urgent — running low on salad items',
  },
  {
    id: 'PO-1003',
    supplierId: 'SUP-001',
    supplierName: 'Metro Wholesale',
    status: 'Partially Received',
    items: [
      { itemId: 'ITM-006', name: 'Burger Buns (pack 12)', quantity: 40, costPrice: 60, received: 25 },
      { itemId: 'ITM-007', name: 'Cheddar Cheese 500g', quantity: 30, costPrice: 120, received: 30 },
    ],
    total: 6000,
    createdAt: '2026-06-25T09:00:00Z',
    createdBy: 'EMP-1002',
    notes: '',
  },
  {
    id: 'PO-1004',
    supplierId: 'SUP-003',
    supplierName: 'Coca-Cola Distributor',
    status: 'Fully Received',
    items: [
      { itemId: 'ITM-008', name: 'Coca-Cola 500ml (case 24)', quantity: 20, costPrice: 380, received: 20 },
      { itemId: 'ITM-009', name: 'Sprite 500ml (case 24)', quantity: 15, costPrice: 370, received: 15 },
    ],
    total: 13150,
    createdAt: '2026-06-20T11:00:00Z',
    createdBy: 'EMP-1001',
    notes: 'Summer stock up',
  },
];

// PO Status Lifecycle: Draft → Approved → Sent → Partially Received → Fully Received → Closed
const STATUS_FLOW = ['Draft', 'Approved', 'Sent', 'Partially Received', 'Fully Received', 'Closed'];

export function PurchaseOrderProvider({ children }) {
  const [purchaseOrders, setPurchaseOrders] = useState(MOCK_POS);

  const createPO = useCallback((poData) => {
    const newPO = {
      ...poData,
      id: `PO-${1000 + purchaseOrders.length + 1}`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      items: poData.items.map(i => ({ ...i, received: 0 })),
      total: poData.items.reduce((sum, i) => sum + (i.quantity * i.costPrice), 0),
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    return newPO;
  }, [purchaseOrders.length]);

  const updatePOStatus = useCallback((poId, newStatus) => {
    setPurchaseOrders(prev => prev.map(po =>
      po.id === poId ? { ...po, status: newStatus } : po
    ));
  }, []);

  const approvePO = useCallback((poId) => updatePOStatus(poId, 'Approved'), [updatePOStatus]);
  const sendPO = useCallback((poId) => updatePOStatus(poId, 'Sent'), [updatePOStatus]);

  const receiveItems = useCallback((poId, receivedMap) => {
    // receivedMap: { itemId: quantityReceived }
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== poId) return po;
      const updatedItems = po.items.map(item => ({
        ...item,
        received: receivedMap[item.itemId] !== undefined ? receivedMap[item.itemId] : item.received,
      }));
      const allReceived = updatedItems.every(i => i.received >= i.quantity);
      const someReceived = updatedItems.some(i => i.received > 0);
      return {
        ...po,
        items: updatedItems,
        status: allReceived ? 'Fully Received' : someReceived ? 'Partially Received' : po.status,
      };
    }));
  }, []);

  const closePO = useCallback((poId) => updatePOStatus(poId, 'Closed'), [updatePOStatus]);

  const deletePO = useCallback((poId) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
  }, []);

  const value = {
    purchaseOrders,
    statusFlow: STATUS_FLOW,
    createPO,
    approvePO,
    sendPO,
    receiveItems,
    closePO,
    deletePO,
    updatePOStatus,
  };

  return (
    <PurchaseOrderContext.Provider value={value}>
      {children}
    </PurchaseOrderContext.Provider>
  );
}

export function usePurchaseOrders() {
  const context = useContext(PurchaseOrderContext);
  if (!context) {
    throw new Error('usePurchaseOrders must be used within a PurchaseOrderProvider');
  }
  return context;
}
