import React, { createContext, useContext, useState, useCallback } from "react";
import { useInventory as useInventoryHook } from "@/hooks/useInventory";

const InventoryContext = createContext();

const ADJUSTMENT_REASONS = ['Damage', 'Theft', 'Promo', 'Expired', 'Correction', 'Return', 'Other'];

export function InventoryProvider({ children }) {
  const inventoryData = useInventoryHook();
  
  const [activeLocation, setActiveLocation] = useState('All');
  const [stockLedger, setStockLedger] = useState([]); // Full audit trail
  const [stockAdjustments, setStockAdjustments] = useState([]); // Manual adjustments
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  // Log a stock movement to the ledger
  const logStockMovement = useCallback((entry) => {
    const ledgerEntry = {
      id: `SL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...entry,
      timestamp: new Date().toISOString(),
    };
    setStockLedger(prev => [ledgerEntry, ...prev]);
    return ledgerEntry;
  }, []);

  // Manual stock adjustment with reason code
  const adjustStock = useCallback((itemId, itemName, quantityChange, reason, performedBy = 'EMP-1001') => {
    const adjustment = {
      id: `ADJ-${Date.now()}`,
      itemId,
      itemName,
      quantityChange,
      reason,
      performedBy,
      timestamp: new Date().toISOString(),
    };
    setStockAdjustments(prev => [adjustment, ...prev]);
    logStockMovement({
      type: 'ADJUSTMENT',
      itemId,
      itemName,
      quantityChange,
      reason,
      performedBy,
    });
    return adjustment;
  }, [logStockMovement]);

  // Deduct stock on sale (called after transaction completion)
  const deductStockOnSale = useCallback((cartItems, transactionId) => {
    cartItems.forEach(item => {
      const product = item.product;
      // Check if composite — deduct ingredients instead
      if (product.isComposite && product.ingredients?.length > 0) {
        product.ingredients.forEach(ing => {
          const qty = -(ing.quantity * item.quantity);
          logStockMovement({
            type: 'SALE_DEDUCTION',
            itemId: ing.componentId,
            itemName: ing.componentName || ing.componentId,
            quantityChange: qty,
            reason: `Composite deduction from ${product.name}`,
            transactionId,
          });
        });
      } else {
        logStockMovement({
          type: 'SALE_DEDUCTION',
          itemId: product.id,
          itemName: product.name,
          quantityChange: -item.quantity,
          reason: 'Direct sale',
          transactionId,
        });
      }
    });
  }, [logStockMovement]);

  // Re-add stock on refund (including composite ingredients)
  const restoreStockOnRefund = useCallback((cartItems, transactionId) => {
    cartItems.forEach(item => {
      const product = item.product;
      if (product.isComposite && product.ingredients?.length > 0) {
        product.ingredients.forEach(ing => {
          logStockMovement({
            type: 'REFUND_RESTORE',
            itemId: ing.componentId,
            itemName: ing.componentName || ing.componentId,
            quantityChange: ing.quantity * item.quantity,
            reason: `Refund: composite restore for ${product.name}`,
            transactionId,
          });
        });
      } else {
        logStockMovement({
          type: 'REFUND_RESTORE',
          itemId: product.id,
          itemName: product.name,
          quantityChange: item.quantity,
          reason: 'Refund restore',
          transactionId,
        });
      }
    });
  }, [logStockMovement]);

  // Check for negative stock / variance alerts
  const checkLowStock = useCallback((items, threshold = 5) => {
    const alerts = items.filter(item =>
      item.inventory?.currentStock !== undefined && item.inventory.currentStock <= threshold
    ).map(item => ({
      id: item.id,
      name: item.name,
      currentStock: item.inventory.currentStock,
      threshold,
      severity: item.inventory.currentStock <= 0 ? 'critical' : 'warning',
    }));
    setLowStockAlerts(alerts);
    return alerts;
  }, []);

  // Intercept item deletion to log it in the audit ledger
  const deleteInventoryItem = useCallback((id) => {
    const item = inventoryData.inventory.find(i => i.id === id);
    if (item) {
      logStockMovement({
        type: 'DELETE_ITEM',
        itemId: item.id,
        itemName: item.name,
        quantityChange: -item.inStock || 0,
        reason: 'Item deleted from inventory master',
        performedBy: 'EMP-1001',
      });
    }
    inventoryData.deleteInventoryItem(id);
  }, [inventoryData, logStockMovement]);

  return (
    <InventoryContext.Provider value={{
      ...inventoryData,
      activeLocation,
      setActiveLocation,
      stockLedger,
      stockAdjustments,
      lowStockAlerts,
      adjustmentReasons: ADJUSTMENT_REASONS,
      adjustStock,
      deductStockOnSale,
      restoreStockOnRefund,
      logStockMovement,
      checkLowStock,
      addInventoryItem: inventoryData.addInventoryItem,
      deleteInventoryItem,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventoryContext must be used within an InventoryProvider");
  }
  return context;
}
