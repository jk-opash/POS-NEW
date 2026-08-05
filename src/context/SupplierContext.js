import { useSelector, useDispatch } from 'react-redux';
import { 
  addSupplier as addSupplierAction, 
  updateSupplier as updateSupplierAction, 
  recordSupplierPayment as recordSupplierPaymentAction,
  createSupplierPO as createSupplierPOAction,
  logSupplierCommunication as logSupplierCommunicationAction,
  mapSupplierProduct as mapSupplierProductAction
} from '../store/slices/inventorySlice';

export function useSuppliers() {
  const dispatch = useDispatch();
  const suppliers = useSelector(state => state.inventory.suppliers);

  const addSupplier = (supplier) => dispatch(addSupplierAction(supplier));
  const updateSupplier = (id, updates) => dispatch(updateSupplierAction({ id, updates }));
  const deleteSupplier = (id) => dispatch(updateSupplierAction({ id, updates: { status: "Archived" } }));

  const getSupplierStats = () => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'Active').length;
    const outstanding = suppliers.reduce((sum, s) => sum + (s.stats?.outstandingBalance || 0), 0);
    return { total, active, outstanding };
  };

  const recordPayment = (supplierId, amount, method, reference) => dispatch(recordSupplierPaymentAction({ supplierId, amount, method, reference }));
  const createPurchaseOrder = (supplierId, poData) => dispatch(createSupplierPOAction({ supplierId, poData }));
  const logCommunication = (supplierId, comm) => dispatch(logSupplierCommunicationAction({ supplierId, comm }));
  const mapProduct = (supplierId, product) => dispatch(mapSupplierProductAction({ supplierId, product }));

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierStats,
    recordPayment,
    createPurchaseOrder,
    logCommunication,
    mapProduct
  };
}
