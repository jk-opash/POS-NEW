/**
 * Centralized API Service Layer
 *
 * All raw axiosClient calls are defined here — organized by resource.
 * Redux slices import from this file instead of calling axiosClient directly.
 * This ensures each endpoint URL is defined ONCE and reused across slices.
 */

import axiosClient from "@/api/axiosClient";

// ─── Branch ───────────────────────────────────────────────────────────────────

export const branchApi = {
  getById: (branchId) => axiosClient.get(`/branch/${branchId}`),
  update: (branchId, data) => axiosClient.put(`/branch/${branchId}`, data),
  getZones: (branchId) => axiosClient.get(`/zone?branch_id=${branchId}`),
  getTables: (branchId) => axiosClient.get(`/table?branch_id=${branchId}`),
  createTable: (data) => axiosClient.post("/table", data),
  updateTable: (id, data) => axiosClient.put(`/table/${id}`, data),
  deleteTable: (id) => axiosClient.delete(`/table/${id}`),
};

// ─── Business ─────────────────────────────────────────────────────────────────

export const businessApi = {
  getById: (businessId) => axiosClient.get(`/business/${businessId}`),
  update: (businessId, data) =>
    axiosClient.put(`/business/${businessId}`, data),
};

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const menuApi = {
  getItems: (branchId) => axiosClient.get(`/menu/items/branch/${branchId}`),
  getCategories: (branchId) =>
    axiosClient.get(`/menu/categories/branch/${branchId}`),
  createItem: (data) => axiosClient.post("/menu/items", data),
  updateItem: (id, data) => axiosClient.put(`/menu/items/${id}`, data),
  deleteItem: (id) => axiosClient.delete(`/menu/items/${id}`),
};

// ─── Invoice ──────────────────────────────────────────────────────────────────

export const invoiceApi = {
  getByBranch: (branchId) => axiosClient.get(`/invoice?branch_id=${branchId}`),
  create: (data) => axiosClient.post("/invoice", data),
};

// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventoryApi = {
  getItems: (branchId) =>
    axiosClient.get(`/inventory/items/branch/${branchId}`),
  getItemById: (id) => axiosClient.get(`/inventory/items/${id}`),
  createItem: (data) => axiosClient.post("/inventory/items", data),
  updateItem: (id, data) => axiosClient.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => axiosClient.delete(`/inventory/items/${id}`),
  getLedger: (branchId) =>
    axiosClient.get(`/inventory/ledger/branch/${branchId}`),
  adjustStock: (data) => axiosClient.post("/inventory/stock/adjust", data),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderApi = {
  create: (data) => axiosClient.post("/order", data),
  update: (orderId, data) => axiosClient.put(`/order/${orderId}`, data),
  delete: (orderId) => axiosClient.delete(`/order/${orderId}`),
  getPending: (branchId) =>
    axiosClient.get(
      `/order?branch_id=${branchId}&status=Pending,Accepted,Preparing`,
    ),
  getAll: (branchId) => axiosClient.get(`/order?branch_id=${branchId}`),
  updateKds: (orderId, data) => axiosClient.put(`/order/${orderId}/kds`, data),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (endpoint, credentials) => axiosClient.post(endpoint, credentials),
};

// ─── Audit Logs ─────────────────────────────────────────────────────────────────

export const auditLogApi = {
  getAll: (branchId) =>
    axiosClient.get("/audit-logs", { params: { branch_id: branchId } }),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: (params) => axiosClient.get("/analytics/dashboard", { params }),
};

// ─── Supplier ─────────────────────────────────────────────────────────────────
export const supplierApi = {
  getAll: (businessId) =>
    axiosClient.get(`/supplier?business_id=${businessId}`),
  create: (data) => axiosClient.post("/supplier", data),
  update: (id, data) => axiosClient.put(`/supplier/${id}`, data),
  delete: (id) => axiosClient.delete(`/supplier/${id}`),
};

// ─── Team Member ──────────────────────────────────────────────────────────────
export const teamMemberApi = {
  getAll: (businessId) =>
    axiosClient.get(`/team-member?businessId=${businessId}`),
  getById: (id) => axiosClient.get(`/team-member/${id}`),
  create: (data) => axiosClient.post("/team-member", data),
  update: (id, data) => axiosClient.put(`/team-member/${id}`, data),
  delete: (id) => axiosClient.delete(`/team-member/${id}`),
};

// ─── Expense ──────────────────────────────────────────────────────────────────

export const expenseApi = {
  getByBranch: (branchId) => axiosClient.get(`/expense?branch_id=${branchId}`),
  create: (data) => axiosClient.post("/expense", data),
};

// ─── Utility Bill ─────────────────────────────────────────────────────────────
export const utilityBillApi = {
  getByBranch: (branchId) =>
    axiosClient.get(`/utility-bill?branch_id=${branchId}`),
  create: (data) => axiosClient.post("/utility-bill", data),
};

// ─── Withdrawal ───────────────────────────────────────────────────────────────
export const withdrawalApi = {
  getByBranch: (branchId) =>
    axiosClient.get(`/withdrawal?branch_id=${branchId}`),
  create: (data) => axiosClient.post("/withdrawal", data),
};

// ─── Support Ticket ───────────────────────────────────────────────────────────
export const supportTicketApi = {
  getAll: (params) => axiosClient.get("/support-ticket", { params }),
  create: (data) => axiosClient.post("/support-ticket", data),
  getById: (id) => axiosClient.get(`/support-ticket/${id}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationApi = {
  getByBranch: (branchId) =>
    axiosClient.get("/notifications", { params: { targetBranch: branchId } }),
  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
};
