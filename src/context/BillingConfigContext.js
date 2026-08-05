import { useSelector, useDispatch } from 'react-redux';
import { updateBillingConfig as updateBillingConfigAction } from '../store/slices/billingSlice';

export function useBillingConfig() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.billing.billingConfig);

  const updateConfig = (key, value) => dispatch(updateBillingConfigAction({ key, value }));

  return {
    config,
    updateConfig,
  };
}
