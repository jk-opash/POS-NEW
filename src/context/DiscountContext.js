import { useSelector, useDispatch } from 'react-redux';
import { 
  addDiscountRule as addDiscountRuleAction, 
  updateDiscountRule as updateDiscountRuleAction, 
  deleteDiscountRule as deleteDiscountRuleAction 
} from '../store/slices/billingSlice';

export function useDiscount() {
  const dispatch = useDispatch();
  const discountRules = useSelector(state => state.billing.discountRules);

  const addDiscountRule = (rule) => dispatch(addDiscountRuleAction(rule));
  const updateDiscountRule = (id, updates) => dispatch(updateDiscountRuleAction({ id, updates }));
  const deleteDiscountRule = (id) => dispatch(deleteDiscountRuleAction(id));

  return {
    discountRules,
    addDiscountRule,
    updateDiscountRule,
    deleteDiscountRule,
  };
}
