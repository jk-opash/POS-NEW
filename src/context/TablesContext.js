import { useSelector, useDispatch } from 'react-redux';
import { 
  updateTableStatus as updateTableStatusAction, 
  updateTablePosition as updateTablePositionAction, 
  updateTableRotation as updateTableRotationAction, 
  addTable as addTableAction,
  updateTableDetails as updateTableDetailsAction,
  deleteTable as deleteTableAction,
  mergeTables as mergeTablesAction,
  unmergeTable as unmergeTableAction
} from '../store/slices/branchSlice';

export function useTables() {
  const dispatch = useDispatch();
  
  const floors = useSelector(state => state.branch.floors);
  const tables = useSelector(state => state.branch.tables);

  const updateTableStatus = (tableId, newStatus) => dispatch(updateTableStatusAction({ tableId, newStatus }));
  const updateTablePosition = (tableId, x, y) => dispatch(updateTablePositionAction({ tableId, x, y }));
  const updateTableRotation = (tableId, rotation) => dispatch(updateTableRotationAction({ tableId, rotation }));
  const addTable = (floorId, config) => dispatch(addTableAction({ floorId, config }));
  const updateTableDetails = (tableId, newDetails) => dispatch(updateTableDetailsAction({ tableId, newDetails }));
  const deleteTable = (tableId) => dispatch(deleteTableAction(tableId));
  const mergeTables = (tableIds) => dispatch(mergeTablesAction(tableIds));
  const unmergeTable = (tableId) => dispatch(unmergeTableAction(tableId));

  return { 
    floors, 
    tables, 
    updateTableStatus, 
    updateTablePosition, 
    updateTableRotation, 
    addTable,
    updateTableDetails,
    deleteTable,
    mergeTables,
    unmergeTable
  };
}
