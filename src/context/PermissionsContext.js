import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';

const PermissionsContext = createContext();

// ─── RBAC Permission Definitions ────────────────────────────────────────────
const ALL_PERMISSIONS = [
  // POS
  { key: 'pos.access', label: 'Access POS', group: 'POS' },
  { key: 'pos.checkout', label: 'Process Checkout', group: 'POS' },
  { key: 'pos.discount.apply', label: 'Apply Discounts', group: 'POS' },
  { key: 'pos.void_line', label: 'Void Line Items', group: 'POS' },
  { key: 'pos.void_cart', label: 'Void Entire Cart', group: 'POS' },
  { key: 'pos.open_drawer', label: 'Open Cash Drawer', group: 'POS' },
  { key: 'pos.tables.view', label: 'View Tables', group: 'POS' },
  { key: 'pos.tables.edit', label: 'Edit Tables', group: 'POS' },
  // Shifts
  { key: 'shift.open', label: 'Open Shift', group: 'Shifts' },
  { key: 'shift.close', label: 'Close Shift', group: 'Shifts' },
  { key: 'shift.view_expected', label: 'View Expected Cash (Non-Blind)', group: 'Shifts' },
  // Inventory
  { key: 'inventory.view', label: 'View Inventory', group: 'Inventory' },
  { key: 'inventory.edit', label: 'Edit Items', group: 'Inventory' },
  { key: 'inventory.adjust', label: 'Adjust Stock', group: 'Inventory' },
  { key: 'inventory.cost.view', label: 'View Cost Prices', group: 'Inventory' },
  { key: 'inventory.manage', label: 'Manage Inventory Settings', group: 'Inventory' },
  // KDS
  { key: 'kds.access', label: 'Access Kitchen Display', group: 'KDS' },
  // Customers & Loyalty
  { key: 'loyalty.redeem', label: 'Redeem Loyalty Points', group: 'Customers' },
  { key: 'customers.view', label: 'View Customers', group: 'Customers' },
  { key: 'customers.edit', label: 'Edit Customers', group: 'Customers' },
  // Reports
  { key: 'reports.sales', label: 'View Sales Reports', group: 'Reports' },
  { key: 'reports.inventory', label: 'View Inventory Reports', group: 'Reports' },
  { key: 'reports.financial', label: 'View Financial Reports', group: 'Reports' },
  { key: 'reports.employees', label: 'View Employee Reports', group: 'Reports' },
  // Staff
  { key: 'staff.view', label: 'View Staff', group: 'Staff' },
  { key: 'staff.edit', label: 'Edit Staff', group: 'Staff' },
  { key: 'staff.roles', label: 'Manage Roles', group: 'Staff' },
  // Purchase Orders
  { key: 'po.create', label: 'Create Purchase Orders', group: 'Purchasing' },
  { key: 'po.approve', label: 'Approve Purchase Orders', group: 'Purchasing' },
  { key: 'po.receive', label: 'Receive Purchase Orders', group: 'Purchasing' },
  // Settings
  { key: 'settings.view', label: 'View Settings', group: 'Settings' },
  { key: 'settings.edit', label: 'Edit Settings', group: 'Settings' },
];

// ─── Default Role Definitions ───────────────────────────────────────────────
const DEFAULT_ROLES = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features',
    permissions: ALL_PERMISSIONS.map(p => p.key), // All permissions
    isSystem: true,
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage staff, inventory, and override POS actions',
    permissions: [
      'pos.access', 'pos.checkout', 'pos.discount.apply', 'pos.void_line', 'pos.void_cart', 'pos.open_drawer',
      'pos.tables.view', 'pos.tables.edit',
      'shift.open', 'shift.close', 'shift.view_expected',
      'inventory.view', 'inventory.edit', 'inventory.adjust', 'inventory.cost.view', 'inventory.manage',
      'kds.access',
      'loyalty.redeem', 'customers.view', 'customers.edit',
      'reports.sales', 'reports.inventory', 'reports.financial', 'reports.employees',
      'staff.view', 'staff.edit',
      'po.create', 'po.approve', 'po.receive',
      'settings.view',
    ],
    isSystem: true,
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Can ring up sales and manage basic POS functions',
    permissions: [
      'pos.access', 'pos.checkout', 'pos.open_drawer',
      'pos.tables.view',
      'shift.open', 'shift.close',
      'inventory.view',
      'kds.access',
      'loyalty.redeem', 'customers.view',
    ],
    isSystem: true,
  },
  {
    id: 'kitchen',
    name: 'Kitchen Staff',
    description: 'Access to KDS only',
    permissions: ['kds.access'],
    isSystem: true,
  },
  {
    id: 'inventory_manager',
    name: 'Inventory Manager',
    description: 'Full inventory access, no POS',
    permissions: [
      'inventory.view', 'inventory.edit', 'inventory.adjust', 'inventory.cost.view', 'inventory.manage',
      'reports.inventory',
      'po.create', 'po.approve', 'po.receive',
    ],
    isSystem: true,
  },
];

// ─── Manager PIN for overrides ──────────────────────────────────────────────
const MANAGER_PIN = '1234'; // Mock PIN

export function PermissionsProvider({ children }) {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [auditLog, setAuditLog] = useState([]);

  // Check if a role has a given permission
  const roleHasPermission = useCallback((roleId, permissionKey) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    return role.permissions.includes(permissionKey);
  }, [roles]);

  // Check if the current user (by their role string) has a permission
  const hasPermission = useCallback((userRole, permissionKey) => {
    // Map the role string from StaffContext to our RBAC role ID
    const roleMap = {
      'General Manager': 'admin',
      'Manager': 'manager',
      'Cashier': 'cashier',
      'Kitchen Staff': 'kitchen',
      'Inventory Manager': 'inventory_manager',
      'Chef': 'kitchen',
      'Bartender': 'kitchen',
      'Server': 'cashier',
    };
    const mappedRoleId = roleMap[userRole] || 'cashier';
    return roleHasPermission(mappedRoleId, permissionKey);
  }, [roleHasPermission]);

  // Request manager PIN override (returns a Promise<boolean>)
  const requestManagerOverride = useCallback((action) => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        const pin = window.prompt(`Manager Override Required\n\nAction: ${action}\n\nEnter Manager PIN:`);
        if (pin === MANAGER_PIN) {
          logAudit('MANAGER_OVERRIDE', action, 'Approved');
          resolve(true);
        } else {
          if (pin !== null) {
            window.alert('Invalid PIN.');
          }
          logAudit('MANAGER_OVERRIDE', action, 'Denied');
          resolve(false);
        }
      } else {
        Alert.prompt(
          'Manager Override',
          `Action: ${action}\nEnter Manager PIN:`,
          [
            { text: 'Cancel', onPress: () => { logAudit('MANAGER_OVERRIDE', action, 'Denied'); resolve(false); }, style: 'cancel' },
            { text: 'Confirm', onPress: (pin) => {
              if (pin === MANAGER_PIN) {
                logAudit('MANAGER_OVERRIDE', action, 'Approved');
                resolve(true);
              } else {
                Alert.alert('Error', 'Invalid PIN.');
                logAudit('MANAGER_OVERRIDE', action, 'Denied');
                resolve(false);
              }
            }},
          ],
          'secure-text'
        );
      }
    });
  }, []);

  // Audit Log
  const logAudit = useCallback((type, action, result, details = {}) => {
    setAuditLog(prev => [{
      id: `AUD-${Date.now()}`,
      type,
      action,
      result,
      details,
      timestamp: new Date().toISOString(),
    }, ...prev]);
  }, []);

  // Role CRUD
  const addRole = useCallback((roleData) => {
    const newRole = {
      ...roleData,
      id: `role_${Date.now()}`,
      isSystem: false,
    };
    setRoles(prev => [...prev, newRole]);
  }, []);

  const updateRole = useCallback((roleId, updates) => {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...updates } : r));
  }, []);

  const deleteRole = useCallback((roleId) => {
    setRoles(prev => prev.filter(r => r.id !== roleId || r.isSystem));
  }, []);

  const togglePermission = useCallback((roleId, permissionKey) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const has = r.permissions.includes(permissionKey);
      return {
        ...r,
        permissions: has
          ? r.permissions.filter(p => p !== permissionKey)
          : [...r.permissions, permissionKey],
      };
    }));
  }, []);

  const value = {
    roles,
    allPermissions: ALL_PERMISSIONS,
    auditLog,
    hasPermission,
    roleHasPermission,
    requestManagerOverride,
    logAudit,
    addRole,
    updateRole,
    deleteRole,
    togglePermission,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}
