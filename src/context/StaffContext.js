import { useSelector, useDispatch } from 'react-redux';
import { 
  addEmployee as addEmployeeAction, 
  updateEmployee as updateEmployeeAction, 
  deleteEmployee as deleteEmployeeAction, 
  loginUser, 
  logoutUser, 
  clockIn as clockInAction, 
  clockOut as clockOutAction, 
  assignShift as assignShiftAction 
} from '../store/slices/staffSlice';

export function useStaff() {
  const dispatch = useDispatch();
  const { employees, attendanceLogs, shifts, currentUser } = useSelector(state => state.staff);

  const addEmployee = (data) => dispatch(addEmployeeAction(data));
  const updateEmployee = (id, updatedData) => dispatch(updateEmployeeAction({ id, updatedData }));
  const deleteEmployee = (id) => dispatch(deleteEmployeeAction(id));
  const login = (email, password) => {
    dispatch(loginUser(email));
    return employees.some(emp => emp.email === email);
  };
  const logout = () => dispatch(logoutUser());
  const clockIn = (id) => dispatch(clockInAction(id));
  const clockOut = (id) => dispatch(clockOutAction(id));
  const assignShift = (employeeId, shiftName) => dispatch(assignShiftAction({ employeeId, shiftName }));

  return {
    employees, attendanceLogs, shifts, currentUser,
    addEmployee, updateEmployee, deleteEmployee, login, logout, clockIn, clockOut, assignShift
  };
}
