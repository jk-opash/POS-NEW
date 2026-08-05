import { useSelector, useDispatch } from 'react-redux';
import { 
  setActiveBranch as setActiveBranchAction, 
  addBranch as addBranchAction, 
  updateBranch as updateBranchAction, 
  deleteBranch as deleteBranchAction 
} from '../store/slices/branchSlice';

export function useBranches() {
  const dispatch = useDispatch();
  
  const branches = useSelector(state => state.branch.branches);
  const activeBranch = useSelector(state => state.branch.activeBranch);

  const setActiveBranch = (branchId) => dispatch(setActiveBranchAction(branchId));
  const addBranch = (branch) => dispatch(addBranchAction(branch));
  const updateBranch = (id, updates) => dispatch(updateBranchAction({ id, updates }));
  const deleteBranch = (id) => dispatch(deleteBranchAction(id));

  return { branches, activeBranch, setActiveBranch, addBranch, updateBranch, deleteBranch };
}
