import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  createPO as createPOAction, 
  updatePOStatus as updatePOStatusAction, 
  receivePOItems as receivePOItemsAction, 
  deletePO as deletePOAction 
} from '../store/slices/inventorySlice';

const STATUS_FLOW = ['Draft', 'Approved', 'Sent', 'Partially Received', 'Fully Received', 'Closed'];

export function usePurchaseOrders() {
  const dispatch = useDispatch();
  const purchaseOrders = useSelector(state => state.inventory.purchaseOrders);

  const createPO = useCallback((poData) => dispatch(createPOAction(poData)), [dispatch]);
  const updatePOStatus = useCallback((poId, newStatus) => dispatch(updatePOStatusAction({ poId, newStatus })), [dispatch]);

  const approvePO = useCallback((poId) => updatePOStatus(poId, 'Approved'), [updatePOStatus]);
  const sendPO = useCallback((poId) => updatePOStatus(poId, 'Sent'), [updatePOStatus]);
  const receiveItems = useCallback((poId, receivedMap) => dispatch(receivePOItemsAction({ poId, receivedMap })), [dispatch]);
  const closePO = useCallback((poId) => updatePOStatus(poId, 'Closed'), [updatePOStatus]);
  const deletePO = useCallback((poId) => dispatch(deletePOAction(poId)), [dispatch]);

  return {
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
}
