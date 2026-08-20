export const roleDefaults = {
  manager: [
    "dashboard",
    "waiter",
    "kds",
    "operations",
    "tables",
    "pos",
    "invoices",
  ],
  cashier: ["dashboard", "tables", "pos", "invoices"],
  waiter: ["dashboard", "tables", "pos", "waiter"],
  kitchen: ["kds"],
};

export const hasPermission = (authUser, key) => {
  if (!authUser) return false;

  const roleName =
    typeof authUser.role === "string"
      ? authUser.role.toLowerCase()
      : authUser.role?.name?.toLowerCase();

  // Admin and Superadmin have full access
  if (roleName === "admin" || roleName === "superadmin") {
    return true;
  }

  // Always allow basic routes for everyone
  if (["settings"].includes(key)) {
    return true;
  }

  // Check if the current role has a hardcoded default for this key
  if (roleDefaults[roleName]?.includes(key)) {
    return true;
  }

  const permissions = authUser.role?.permissions || [];

  // Direct match from custom permissions array
  if (permissions.includes(key)) {
    return true;
  }

  // Alias checks just in case (HeaderQuickNav uses 'invoices', Sidebar uses 'invoices')
  if (key === "invoice" && permissions.includes("invoices")) return true;

  return false;
};
