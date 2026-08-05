import { useSelector, useDispatch } from 'react-redux';
import { 
  addMenuItem as addMenuItemAction, 
  updateMenuItem as updateMenuItemAction, 
  bulkUpdate as bulkUpdateAction, 
  deleteMenuItem as deleteMenuItemAction 
} from '../store/slices/menuSlice';

export function useMenu() {
  const dispatch = useDispatch();
  const menuItems = useSelector(state => state.menu.menuItems);

  const addMenuItem = (newItem) => dispatch(addMenuItemAction(newItem));
  const updateMenuItem = (id, updates) => dispatch(updateMenuItemAction({ id, updates }));
  const bulkUpdate = (ids, updates) => dispatch(bulkUpdateAction({ ids, updates }));
  const deleteMenuItem = (id) => dispatch(deleteMenuItemAction(id));

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    bulkUpdate,
    deleteMenuItem,
  };
}
