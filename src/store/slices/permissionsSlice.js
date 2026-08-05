import { createSlice } from '@reduxjs/toolkit';

const ALL_PERMISSIONS = [
  { key: 'pos.access', label: 'Access POS', group: 'POS' },
  { key: 'pos.checkout', label: 'Process Checkout', group: 'POS' },
  { key: 'pos.discount.apply', label: 'Apply Discounts', group: 'POS' },
  { key: 'pos.void_line', label: 'Void Line Items', group: 'POS' },
  { key: 'pos.void_cart', label: 'Void Entire Cart', group: 'POS' },
  { key: 'pos.open_drawer', label: 'Open Cash Drawer', group: 'POS' },
  { key: 'pos.tables.view', label: 'View Tables', group: 'POS' },
  { key: 'pos.tables.edit', label: 'Edit Tables', group: 'POS' },
  { key: 'shift.open', label: 'Open Shift', group: 'Shifts' },
  { key: 'shift.close', label: 'Close Shift', group: 'Shifts' },
  { key: 'shift.view_expected', label: 'View Expected Cash (Non-Blind)', group: 'Shifts' },
  { key: 'inventory.view', label: 'View Inventory', group: 'Inventory' },
  { key: 'inventory.edit', label: 'Edit Items', group: 'Inventory' },
  { key: 'inventory.adjust', label: 'Adjust Stock', group: 'Inventory' },
  { key: 'inventory.cost.view', label: 'View Cost Prices', group: 'Inventory' },
  { key: 'inventory.manage', label: 'Manage Inventory Settings', group: 'Inventory' },
  { key: 'kds.access', label: 'Access Kitchen Display', group: 'KDS' },
  { key: 'loyalty.redeem', label: 'Redeem Loyalty Points', group: 'Customers' },
  { key: 'customers.view', label: 'View Customers', group: 'Customers' },
  { key: 'customers.edit', label: 'Edit Customers', group: 'Customers' },
  { key: 'reports.sales', label: 'View Sales Reports', group: 'Reports' },
  { key: 'reports.inventory', label: 'View Inventory Reports', group: 'Reports' },
  { key: 'reports.financial', label: 'View Financial Reports', group: 'Reports' },
  { key: 'reports.employees', label: 'View Employee Reports', group: 'Reports' },
  { key: 'staff.view', label: 'View Staff', group: 'Staff' },
  { key: 'staff.edit', label: 'Edit Staff', group: 'Staff' },
  { key: 'staff.roles', label: 'Manage Roles', group: 'Staff' },
  { key: 'po.create', label: 'Create Purchase Orders', group: 'Purchasing' },
  { key: 'po.approve', label: 'Approve Purchase Orders', group: 'Purchasing' },
  { key: 'po.receive', label: 'Receive Purchase Orders', group: 'Purchasing' },
  { key: 'settings.view', label: 'View Settings', group: 'Settings' },
  { key: 'settings.edit', label: 'Edit Settings', group: 'Settings' },
];

const DEFAULT_ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to all features', permissions: ALL_PERMISSIONS.map(p => p.key), isSystem: true },
  { id: 'manager', name: 'Manager', description: 'Can manage staff, inventory, and override POS actions', permissions: ['pos.access', 'pos.checkout', 'pos.discount.apply', 'pos.void_line', 'pos.void_cart', 'pos.open_drawer', 'pos.tables.view', 'pos.tables.edit', 'shift.open', 'shift.close', 'shift.view_expected', 'inventory.view', 'inventory.edit', 'inventory.adjust', 'inventory.cost.view', 'inventory.manage', 'kds.access', 'loyalty.redeem', 'customers.view', 'customers.edit', 'reports.sales', 'reports.inventory', 'reports.financial', 'reports.employees', 'staff.view', 'staff.edit', 'po.create', 'po.approve', 'po.receive', 'settings.view'], isSystem: true },
  { id: 'cashier', name: 'Cashier', description: 'Can ring up sales and manage basic POS functions', permissions: ['pos.access', 'pos.checkout', 'pos.open_drawer', 'pos.tables.view', 'shift.open', 'shift.close', 'inventory.view', 'kds.access', 'loyalty.redeem', 'customers.view'], isSystem: true },
  { id: 'kitchen', name: 'Kitchen Staff', description: 'Access to KDS only', permissions: ['kds.access'], isSystem: true },
  { id: 'inventory_manager', name: 'Inventory Manager', description: 'Full inventory access, no POS', permissions: ['inventory.view', 'inventory.edit', 'inventory.adjust', 'inventory.cost.view', 'inventory.manage', 'reports.inventory', 'po.create', 'po.approve', 'po.receive'], isSystem: true },
];

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    roles: DEFAULT_ROLES,
    auditLog: [],
  },
  reducers: {
    logAuditAction: (state, action) => {
      const { type, logAction, result, details } = action.payload;
      state.auditLog.unshift({
        id: `AUD-${Date.now()}`, type, action: logAction, result, details, timestamp: new Date().toISOString()
      });
    },
    addRole: (state, action) => {
      state.roles.push({ ...action.payload, id: `role_${Date.now()}`, isSystem: false });
    },
    updateRole: (state, action) => {
      const { roleId, updates } = action.payload;
      const role = state.roles.find(r => r.id === roleId);
      if (role) Object.assign(role, updates);
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(r => r.id !== action.payload || r.isSystem);
    },
    togglePermission: (state, action) => {
      const { roleId, permissionKey } = action.payload;
      const role = state.roles.find(r => r.id === roleId);
      if (role) {
        if (role.permissions.includes(permissionKey)) {
          role.permissions = role.permissions.filter(p => p !== permissionKey);
        } else {
          role.permissions.push(permissionKey);
        }
      }
    }
  }
});

export const { logAuditAction, addRole, updateRole, deleteRole, togglePermission } = permissionsSlice.actions;
export const allPermissionsList = ALL_PERMISSIONS;
export default permissionsSlice.reducer;
