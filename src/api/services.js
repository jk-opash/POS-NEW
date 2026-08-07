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
  update: (businessId, data) => axiosClient.put(`/business/${businessId}`, data),
};

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const menuApi = {
  getItems: (branchId) => axiosClient.get(`/menu/items/branch/${branchId}`),
  getCategories: (branchId) => axiosClient.get(`/menu/categories/branch/${branchId}`),
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
  getItems: (branchId) => axiosClient.get(`/inventory/items/branch/${branchId}`),
  getItemById: (id) => axiosClient.get(`/inventory/items/${id}`),
  createItem: (data) => axiosClient.post("/inventory/items", data),
  updateItem: (id, data) => axiosClient.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => axiosClient.delete(`/inventory/items/${id}`),
  getLedger: (branchId) => axiosClient.get(`/inventory/ledger/branch/${branchId}`),
};

// ─── Customer ─────────────────────────────────────────────────────────────────

export const customerApi = {
  getByBranch: (branchId) => axiosClient.get(`/customer/branch/${branchId}`),
  getById: (id) => axiosClient.get(`/customer/${id}`),
  create: (data) => axiosClient.post("/customer", data),
  update: (id, data) => axiosClient.put(`/customer/${id}`, data),
  delete: (id) => axiosClient.delete(`/customer/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderApi = {
  create: (data) => axiosClient.post("/order", data),
  update: (orderId, data) => axiosClient.put(`/order/${orderId}`, data),
  delete: (orderId) => axiosClient.delete(`/order/${orderId}`),
  getPending: (branchId) => axiosClient.get(`/order?branch_id=${branchId}&status=Pending`),
  getAll: (branchId) => axiosClient.get(`/order?branch_id=${branchId}`),
  updateKds: (orderId, data) => axiosClient.put(`/order/${orderId}/kds`, data),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (endpoint, credentials) => axiosClient.post(endpoint, credentials),
};
