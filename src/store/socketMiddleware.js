import socketService from "../services/socketService";
import { fetchActiveOrders } from "./slices/posSlice";
import { fetchZonesAndTables } from "./slices/branchSlice";
import { fetchMenuData } from "./slices/menuSlice";
import { fetchInventoryItems } from "./slices/inventorySlice";
import { logoutUser, setSessionConflict, clearSessionConflict } from "./slices/authSlice";
import { Alert } from "react-native";

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

    if (currentToken) {
      const branchId = currentUser?.branch_id;
      socketService.connect(branchId, currentToken);

      if (branchId) {
        // Listen for order updates
        socketService.on("orderCreated", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        socketService.on("orderUpdated", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        socketService.on("orderDeleted", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        // Listen for table status updates
        socketService.on("tableStatusChanged", () => {
          store.dispatch(fetchZonesAndTables(branchId));
        });

        // Listen for menu updates
        socketService.on("menuChanged", () => {
          store.dispatch(fetchMenuData(branchId));
        });

        // Listen for inventory updates
        socketService.on("inventoryChanged", () => {
          store.dispatch(fetchInventoryItems(branchId));
        });
      }

      // Session Conflict Management
      socketService.on("session_conflict", (data) => {
        store.dispatch(setSessionConflict(data?.message));
      });

      socketService.on("session_conflict_resolved", () => {
        store.dispatch(clearSessionConflict());
      });

      socketService.on("session_conflict_failed", (data) => {
        Alert.alert("Error", data?.error || "Invalid PIN");
      });

      socketService.on("session_expired", (data) => {
        store.dispatch(logoutUser());
        setTimeout(() => {
          Alert.alert("Session Expired", data?.message || "You were logged in from another device.");
        }, 500);
      });
    }
  }

  // Handle logout
  if (action.type === "auth/logoutUser") {
    socketService.disconnect();
  }

  return result;
};
