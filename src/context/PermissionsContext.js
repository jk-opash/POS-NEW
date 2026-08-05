import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, Alert } from 'react-native';
import { showAlert } from '../utils/alert';
import { logAuditAction, addRole as addRoleAction, updateRole as updateRoleAction, deleteRole as deleteRoleAction, togglePermission as togglePermissionAction, allPermissionsList } from '../store/slices/permissionsSlice';

const MANAGER_PIN = '1234';

export function usePermissions() {
  const dispatch = useDispatch();
  const { roles, auditLog } = useSelector(state => state.permissions);

  const roleHasPermission = useCallback((roleId, permissionKey) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.permissions.includes(permissionKey) : false;
  }, [roles]);

  const hasPermission = useCallback((userRole, permissionKey) => {
    const roleMap = { 'General Manager': 'admin', 'Manager': 'manager', 'Cashier': 'cashier', 'Kitchen Staff': 'kitchen', 'Inventory Manager': 'inventory_manager', 'Chef': 'kitchen', 'Bartender': 'kitchen', 'Server': 'cashier' };
    return roleHasPermission(roleMap[userRole] || 'cashier', permissionKey);
  }, [roleHasPermission]);

  const logAudit = useCallback((type, action, result, details = {}) => {
    dispatch(logAuditAction({ type, logAction: action, result, details }));
  }, [dispatch]);

  const requestManagerOverride = useCallback((action) => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        const pin = window.prompt(`Manager Override Required\n\nAction: ${action}\n\nEnter Manager PIN:`);
        if (pin === MANAGER_PIN) {
          logAudit('MANAGER_OVERRIDE', action, 'Approved');
          resolve(true);
        } else {
          if (pin !== null) window.alert('Invalid PIN.');
          logAudit('MANAGER_OVERRIDE', action, 'Denied');
          resolve(false);
        }
      } else {
        Alert.prompt('Manager Override', `Action: ${action}\nEnter Manager PIN:`, [
          { text: 'Cancel', onPress: () => { logAudit('MANAGER_OVERRIDE', action, 'Denied'); resolve(false); }, style: 'cancel' },
          { text: 'Confirm', onPress: (pin) => {
            if (pin === MANAGER_PIN) { logAudit('MANAGER_OVERRIDE', action, 'Approved'); resolve(true); } 
            else { showAlert('Error', 'Invalid PIN.'); logAudit('MANAGER_OVERRIDE', action, 'Denied'); resolve(false); }
          }}
        ], 'secure-text');
      }
    });
  }, [logAudit]);

  const addRole = (data) => dispatch(addRoleAction(data));
  const updateRole = (roleId, updates) => dispatch(updateRoleAction({ roleId, updates }));
  const deleteRole = (roleId) => dispatch(deleteRoleAction(roleId));
  const togglePermission = (roleId, permissionKey) => dispatch(togglePermissionAction({ roleId, permissionKey }));

  return { roles, allPermissions: allPermissionsList, auditLog, hasPermission, roleHasPermission, requestManagerOverride, logAudit, addRole, updateRole, deleteRole, togglePermission };
}
