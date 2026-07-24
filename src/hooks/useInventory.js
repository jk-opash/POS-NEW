import { useState, useMemo } from 'react';

// Massive mock data set for Inventory Module
const MOCK_INVENTORY = [
  { id: 'INV-101', name: 'Classic Burger Patty', sku: 'PAT-001', category: 'Raw Materials', inStock: 450, reserved: 50, reorderLevel: 200, unit: 'pcs', price: 25, status: 'Normal', lastCounted: '2023-10-01' },
  { id: 'INV-102', name: 'Burger Buns (Pack of 12)', sku: 'BUN-012', category: 'Raw Materials', inStock: 45, reserved: 10, reorderLevel: 100, unit: 'packs', price: 60, status: 'Low', lastCounted: '2023-10-05' },
  { id: 'INV-103', name: 'Cheddar Cheese Slices', sku: 'CHS-005', category: 'Dairy', inStock: 15, reserved: 0, reorderLevel: 50, unit: 'packs', price: 120, status: 'Critical', lastCounted: '2023-10-02' },
  { id: 'INV-104', name: 'French Fries (Frozen, 5kg)', sku: 'FRY-005', category: 'Frozen', inStock: 0, reserved: 0, reorderLevel: 10, unit: 'bags', price: 450, status: 'Out of Stock', lastCounted: '2023-09-28' },
  { id: 'INV-105', name: 'Tomato Ketchup (10L)', sku: 'KET-010', category: 'Condiments', inStock: 5, reserved: 0, reorderLevel: 3, unit: 'cans', price: 850, status: 'Normal', lastCounted: '2023-10-10' },
  { id: 'INV-106', name: 'Lettuce (Fresh)', sku: 'LET-001', category: 'Produce', inStock: 12, reserved: 2, reorderLevel: 15, unit: 'kg', price: 40, status: 'Low', lastCounted: '2023-10-11' },
  { id: 'INV-107', name: 'Coca Cola Syrup (20L)', sku: 'BEV-001', category: 'Beverages', inStock: 30, reserved: 5, reorderLevel: 10, unit: 'boxes', price: 1200, status: 'Normal', lastCounted: '2023-10-01' },
  { id: 'INV-108', name: 'Packaging Boxes (Medium)', sku: 'PKG-002', category: 'Packaging', inStock: 5000, reserved: 500, reorderLevel: 2000, unit: 'pcs', price: 5, status: 'Normal', lastCounted: '2023-09-15' },
];

const MOCK_TRANSFERS = [
  { id: 'TRF-001', date: '2023-10-12', source: 'Main Warehouse', destination: 'Store 1', items: 3, totalValue: 4500, status: 'In Transit' },
  { id: 'TRF-002', date: '2023-10-10', source: 'Store 2', destination: 'Store 1', items: 1, totalValue: 120, status: 'Received' },
  { id: 'TRF-003', date: '2023-10-13', source: 'Main Warehouse', destination: 'Store 2', items: 5, totalValue: 8500, status: 'Draft' },
];

const MOCK_ADJUSTMENTS = [
  { id: 'ADJ-001', date: '2023-10-11', product: 'Lettuce (Fresh)', type: 'Decrease', qty: 2, unit: 'kg', reason: 'Spoilage', approvedBy: 'John Doe', status: 'Approved' },
  { id: 'ADJ-002', date: '2023-10-09', product: 'Burger Buns', type: 'Decrease', qty: 1, unit: 'packs', reason: 'Damaged', approvedBy: 'Jane Smith', status: 'Approved' },
  { id: 'ADJ-003', date: '2023-10-12', product: 'Cheddar Cheese', type: 'Increase', qty: 5, unit: 'packs', reason: 'Count Correction', approvedBy: 'Pending', status: 'Pending' },
];

const MOCK_QUARANTINE = [
  { id: 'QR-001', product: 'Chicken Patty', batch: 'BT-402', qty: 50, reason: 'Temperature variance during transit', date: '2023-10-12', status: 'Awaiting Inspection' },
  { id: 'QR-002', product: 'Mayonnaise (5L)', batch: 'BT-911', qty: 2, reason: 'Broken seal on arrival', date: '2023-10-10', status: 'Rejected' },
];

const MOCK_AUDIT_LOG = [
  { id: 'AUD-901', timestamp: '2023-10-12 14:30', user: 'Mike R.', action: 'Received PO-1029', details: 'Added 500 pcs Burger Patty' },
  { id: 'AUD-902', timestamp: '2023-10-12 11:15', user: 'Sarah L.', action: 'Created Transfer TRF-003', details: 'Draft transfer to Store 2' },
  { id: 'AUD-903', timestamp: '2023-10-11 16:45', user: 'System', action: 'Low Stock Alert', details: 'Lettuce (Fresh) below reorder level' },
  { id: 'AUD-904', timestamp: '2023-10-11 09:20', user: 'John Doe', action: 'Approved ADJ-001', details: 'Spoilage adjustment' },
];

export function useInventory() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [transfers, setTransfers] = useState(MOCK_TRANSFERS);
  const [adjustments, setAdjustments] = useState(MOCK_ADJUSTMENTS);
  const [quarantine, setQuarantine] = useState(MOCK_QUARANTINE);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOG);

  // Derived metrics for KPIs
  const totalValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + (item.inStock * item.price), 0);
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter(item => item.inStock <= item.reorderLevel && item.inStock > 0).length;
  }, [inventory]);

  const outOfStockCount = useMemo(() => {
    return inventory.filter(item => item.inStock === 0).length;
  }, [inventory]);

  const quarantineCount = useMemo(() => {
    return quarantine.filter(item => item.status === 'Awaiting Inspection').length;
  }, [quarantine]);

  // Method to deduct raw materials based on a recipe when composite items are sold
  const deductRawMaterials = (recipeArray, multiplier = 1) => {
    setInventory(prev => prev.map(item => {
      const recipeItem = recipeArray.find(r => r.rawMaterialId === item.id);
      if (recipeItem) {
        const amountToDeduct = recipeItem.qty * multiplier;
        return {
          ...item,
          inStock: Math.max(0, item.inStock - amountToDeduct)
        };
      }
      return item;
    }));
  };

  const addInventoryItem = (item) => {
    setInventory(prev => [item, ...prev]);
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return {
    inventory,
    transfers,
    adjustments,
    quarantine,
    auditLogs,
    deductRawMaterials,
    addInventoryItem,
    deleteInventoryItem,
    metrics: {
      totalValue,
      lowStockCount,
      outOfStockCount,
      quarantineCount,
      totalItems: inventory.length,
    }
  };
}
