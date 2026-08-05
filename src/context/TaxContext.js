import { useSelector, useDispatch } from 'react-redux';
import { 
  addTaxRule as addTaxRuleAction, 
  updateTaxRule as updateTaxRuleAction, 
  deleteTaxRule as deleteTaxRuleAction, 
  updateTaxSetting as updateTaxSettingAction 
} from '../store/slices/billingSlice';

export function useTax() {
  const dispatch = useDispatch();
  const taxRules = useSelector(state => state.billing.taxRules);
  const taxSettings = useSelector(state => state.billing.taxSettings);

  const addTaxRule = (rule) => dispatch(addTaxRuleAction(rule));
  const updateTaxRule = (id, updates) => dispatch(updateTaxRuleAction({ id, updates }));
  const deleteTaxRule = (id) => dispatch(deleteTaxRuleAction(id));
  const updateTaxSetting = (key, value) => dispatch(updateTaxSettingAction({ key, value }));

  return {
    taxRules,
    taxSettings,
    addTaxRule,
    updateTaxRule,
    deleteTaxRule,
    updateTaxSetting,
  };
}
