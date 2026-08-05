import { useSelector, useDispatch } from 'react-redux';
import { 
  markReadyItemsAsServed as markReadyItemsAsServedAction, 
  updateOrderStatus as updateOrderStatusAction, 
  updateItemStatus as updateItemStatusAction, 
  cancelItemInKDS as cancelItemInKDSAction, 
  updateItemQtyInKDS as updateItemQtyInKDSAction,
  updateOrderPriority as updateOrderPriorityAction, 
  completeTableOrdersInKDS as completeTableOrdersInKDSAction, 
  completeOrderInKDS as completeOrderInKDSAction, 
  addOrderToKDS as addOrderToKDSAction, 
  addOnlineOrderToKDS as addOnlineOrderToKDSAction, 
  replaceTableOrderInKDS as replaceTableOrderInKDSAction 
} from '../store/slices/kdsSlice';

export function useKDS() {
  const dispatch = useDispatch();
  const activeOrders = useSelector(state => state.kds.activeOrders);
  const stations = useSelector(state => state.kds.stations);

  const markReadyItemsAsServed = (orderId) => dispatch(markReadyItemsAsServedAction(orderId));
  const updateOrderStatus = (orderId, newStatus) => dispatch(updateOrderStatusAction({ orderId, newStatus }));
  const updateItemStatus = (orderId, itemId, newStatus) => dispatch(updateItemStatusAction({ orderId, itemId, newStatus }));
  const cancelItemInKDS = (itemId) => dispatch(cancelItemInKDSAction(itemId));
  const updateItemQtyInKDS = (itemId, qty) => dispatch(updateItemQtyInKDSAction({ itemId, qty }));
  const updateOrderPriority = (orderId, newPriority) => dispatch(updateOrderPriorityAction({ orderId, newPriority }));
  const completeTableOrdersInKDS = (tableName) => dispatch(completeTableOrdersInKDSAction(tableName));
  const completeOrderInKDS = (orderId) => dispatch(completeOrderInKDSAction(orderId));
  const addOrderToKDS = (kot) => dispatch(addOrderToKDSAction(kot));
  const addOnlineOrderToKDS = (onlineOrder) => dispatch(addOnlineOrderToKDSAction(onlineOrder));
  const replaceTableOrderInKDS = (tableName, orderData) => dispatch(replaceTableOrderInKDSAction({ tableName, orderData }));
  const markAsCompleted = (orderId) => dispatch(updateOrderStatusAction({ orderId, newStatus: "Completed" }));

  return {
    activeOrders,
    stations,
    updateOrderStatus,
    updateItemStatus,
    updateOrderPriority,
    markAsCompleted,
    addOrderToKDS,
    replaceTableOrderInKDS,
    cancelItemInKDS,
    updateItemQtyInKDS,
    markReadyItemsAsServed,
    completeTableOrdersInKDS,
    completeOrderInKDS,
    addOnlineOrderToKDS,
  };
}
