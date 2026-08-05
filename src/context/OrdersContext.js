import { useSelector, useDispatch } from 'react-redux';
import { 
  setOrders as setOrdersAction, 
  addOrder as addOrderAction, 
  updateOrderStatus as updateOrderStatusAction, 
  updateOrder as updateOrderAction, 
  voidItem as voidItemAction 
} from '../store/slices/ordersSlice';

export function useOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);

  const setOrders = (ordersData) => dispatch(setOrdersAction(ordersData));
  const addOrder = (orderData) => dispatch(addOrderAction(orderData));
  const updateOrderStatus = (orderId, newStatus) => dispatch(updateOrderStatusAction({ orderId, newStatus }));
  const updateOrder = (orderId, updatedFields) => dispatch(updateOrderAction({ orderId, updatedFields }));
  const voidItem = (orderId, itemIndex) => dispatch(voidItemAction({ orderId, itemIndex }));

  return {
    orders,
    setOrders,
    updateOrderStatus,
    voidItem,
    addOrder,
    updateOrder
  };
}
