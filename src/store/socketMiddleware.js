import socketService from "../services/socketService";
import { fetchActiveOrders } from "./slices/posSlice";
import { fetchZonesAndTables } from "./slices/branchSlice";
import { fetchMenuData } from "./slices/menuSlice";
import { fetchInventoryItems } from "./slices/inventorySlice";

export const socketMiddleware = (store) => (next) => (action) => {
  // Pass the action down first so state gets updated
  const result = next(action);

  if (
    action.type === "auth/performLogin/fulfilled" ||
    action.type === "persist/REHYDRATE" ||
    action.type === "socket/init" // explicit init just in case
  ) {
    const state = store.getState();
    const currentUser = state.auth?.user;
    const currentToken = state.auth?.token;

    if (currentUser?.branch_id && currentToken) {
      socketService.connect(currentUser.branch_id, currentToken);

      // Listen for order updates
      socketService.on("orderCreated", () => {
        store.dispatch(fetchActiveOrders(currentUser.branch_id));
      });

      socketService.on("orderUpdated", () => {
        store.dispatch(fetchActiveOrders(currentUser.branch_id));
      });

      socketService.on("orderDeleted", () => {
        store.dispatch(fetchActiveOrders(currentUser.branch_id));
      });

      // Listen for table status updates
      socketService.on("tableStatusChanged", () => {
        store.dispatch(fetchZonesAndTables(currentUser.branch_id));
      });

      // Listen for menu updates
      socketService.on("menuChanged", () => {
        store.dispatch(fetchMenuData(currentUser.branch_id));
      });

      // Listen for inventory updates
      socketService.on("inventoryChanged", () => {
        store.dispatch(fetchInventoryItems(currentUser.branch_id));
      });
    }
  }

  // Handle logout
  if (action.type === "auth/logoutUser") {
    socketService.disconnect();
  }

  return result;
};
