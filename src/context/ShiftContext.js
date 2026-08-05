import { useSelector, useDispatch } from 'react-redux';
import { openShift as openShiftAction, closeShift as closeShiftAction, addCashTransaction as addCashTransactionAction } from '../store/slices/shiftSlice';

export function useShift() {
  const dispatch = useDispatch();
  const { activeShift, shiftHistory } = useSelector(state => state.shift);

  const openShift = (startingCash, employee) => dispatch(openShiftAction({ startingCash, employee }));
  const closeShift = (actualCash, notes = "") => dispatch(closeShiftAction({ actualCash, notes }));
  const addCashTransaction = (amount, type = 'sale') => dispatch(addCashTransactionAction({ amount, type }));

  return { activeShift, shiftHistory, openShift, closeShift, addCashTransaction };
}
