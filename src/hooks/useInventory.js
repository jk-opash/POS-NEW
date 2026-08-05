import { useSelector, useDispatch } from 'react-redux';
import { 
  addInventoryItem as addInventoryItemAction, 
  deleteInventoryItem as deleteInventoryItemAction, 
  deductRawMaterials as deductRawMaterialsAction 
} from '../store/slices/inventorySlice';
import { useMemo } from 'react';

export function useInventory() {
  const dispatch = useDispatch();
  const inventory = useSelector(state => state.inventory.inventory);
  const transfers = useSelector(state => state.inventory.transfers);
  const adjustments = useSelector(state => state.inventory.adjustments);
  const quarantine = useSelector(state => state.inventory.quarantine);
  const auditLogs = useSelector(state => state.inventory.auditLogs);

  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + (item.inStock * item.price), 0), [inventory]);
  const lowStockCount = useMemo(() => inventory.filter(item => item.inStock <= item.reorderLevel && item.inStock > 0).length, [inventory]);
  const outOfStockCount = useMemo(() => inventory.filter(item => item.inStock === 0).length, [inventory]);
  const quarantineCount = useMemo(() => quarantine.filter(item => item.status === 'Awaiting Inspection').length, [quarantine]);

  const deductRawMaterials = (recipeArray, multiplier = 1) => dispatch(deductRawMaterialsAction({ recipeArray, multiplier }));
  const addInventoryItem = (item) => dispatch(addInventoryItemAction(item));
  const deleteInventoryItem = (id) => dispatch(deleteInventoryItemAction(id));

  return {
    inventory, transfers, adjustments, quarantine, auditLogs,
    deductRawMaterials, addInventoryItem, deleteInventoryItem,
    metrics: { totalValue, lowStockCount, outOfStockCount, quarantineCount, totalItems: inventory.length }
  };
}
