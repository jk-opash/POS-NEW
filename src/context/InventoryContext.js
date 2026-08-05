import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useInventory as useInventoryHook } from "@/hooks/useInventory";
import { 
  setActiveLocation as setActiveLocationAction, 
  logStockMovement as logStockMovementAction, 
  addStockAdjustment as addStockAdjustmentAction, 
  setLowStockAlerts as setLowStockAlertsAction,
  deleteInventoryItem as deleteInventoryItemAction
} from '../store/slices/inventorySlice';

const ADJUSTMENT_REASONS = ['Damage', 'Theft', 'Promo', 'Expired', 'Correction', 'Return', 'Other'];

export function useInventoryContext() {
  const dispatch = useDispatch();
  const inventoryData = useInventoryHook();

  const activeLocation = useSelector(state => state.inventory.activeLocation);
  const stockLedger = useSelector(state => state.inventory.stockLedger);
  const stockAdjustments = useSelector(state => state.inventory.stockAdjustments);
  const lowStockAlerts = useSelector(state => state.inventory.lowStockAlerts);

  const setActiveLocation = (loc) => dispatch(setActiveLocationAction(loc));
  
  const logStockMovement = useCallback((entry) => {
    dispatch(logStockMovementAction(entry));
  }, [dispatch]);

  const adjustStock = useCallback((itemId, itemName, quantityChange, reason, performedBy = 'EMP-1001') => {
    dispatch(addStockAdjustmentAction({ itemId, itemName, quantityChange, reason, performedBy }));
    logStockMovement({ type: 'ADJUSTMENT', itemId, itemName, quantityChange, reason, performedBy });
  }, [dispatch, logStockMovement]);

  const deductStockOnSale = useCallback((cartItems, transactionId) => {
    cartItems.forEach(item => {
      const product = item.product;
      if (product.isComposite && product.ingredients?.length > 0) {
        product.ingredients.forEach(ing => {
          logStockMovement({ type: 'SALE_DEDUCTION', itemId: ing.componentId, itemName: ing.componentName || ing.componentId, quantityChange: -(ing.quantity * item.quantity), reason: `Composite deduction from ${product.name}`, transactionId });
        });
      } else {
        logStockMovement({ type: 'SALE_DEDUCTION', itemId: product.id, itemName: product.name, quantityChange: -item.quantity, reason: 'Direct sale', transactionId });
      }
    });
  }, [logStockMovement]);

  const restoreStockOnRefund = useCallback((cartItems, transactionId) => {
    cartItems.forEach(item => {
      const product = item.product;
      if (product.isComposite && product.ingredients?.length > 0) {
        product.ingredients.forEach(ing => {
          logStockMovement({ type: 'REFUND_RESTORE', itemId: ing.componentId, itemName: ing.componentName || ing.componentId, quantityChange: ing.quantity * item.quantity, reason: `Refund: composite restore for ${product.name}`, transactionId });
        });
      } else {
        logStockMovement({ type: 'REFUND_RESTORE', itemId: product.id, itemName: product.name, quantityChange: item.quantity, reason: 'Refund restore', transactionId });
      }
    });
  }, [logStockMovement]);

  const checkLowStock = useCallback((items, threshold = 5) => {
    const alerts = items.filter(item => item.inventory?.currentStock !== undefined && item.inventory.currentStock <= threshold).map(item => ({
      id: item.id, name: item.name, currentStock: item.inventory.currentStock, threshold, severity: item.inventory.currentStock <= 0 ? 'critical' : 'warning',
    }));
    dispatch(setLowStockAlertsAction(alerts));
    return alerts;
  }, [dispatch]);

  const deleteInventoryItem = useCallback((id) => {
    const item = inventoryData.inventory.find(i => i.id === id);
    if (item) {
      logStockMovement({ type: 'DELETE_ITEM', itemId: item.id, itemName: item.name, quantityChange: -item.inStock || 0, reason: 'Item deleted from inventory master', performedBy: 'EMP-1001' });
    }
    dispatch(deleteInventoryItemAction(id));
  }, [inventoryData.inventory, dispatch, logStockMovement]);

  return {
    ...inventoryData,
    activeLocation, setActiveLocation, stockLedger, stockAdjustments, lowStockAlerts,
    adjustmentReasons: ADJUSTMENT_REASONS,
    adjustStock, deductStockOnSale, restoreStockOnRefund, logStockMovement, checkLowStock,
    deleteInventoryItem
  };
}
