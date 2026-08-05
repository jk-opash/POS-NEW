import { useSelector, useDispatch } from 'react-redux';
import { 
  addInvoice as addInvoiceAction, 
  updateInvoiceStatus as updateInvoiceStatusAction 
} from '../store/slices/billingSlice';

export function useInvoices() {
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.billing.invoices);

  const addInvoice = (invoiceData) => dispatch(addInvoiceAction(invoiceData));
  const updateInvoiceStatus = (id, newStatus) => dispatch(updateInvoiceStatusAction({ id, newStatus }));

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = invoices.length;
  const averageValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  return {
    invoices,
    addInvoice,
    updateInvoiceStatus,
    metrics: {
      totalInvoices,
      totalRevenue,
      averageValue,
    },
  };
}
