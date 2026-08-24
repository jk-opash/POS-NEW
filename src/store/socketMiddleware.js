import { createAudioPlayer } from "expo-audio";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { teamMemberApi } from "../api/services";
import socketService from "../services/socketService";
import {
  clearSessionConflict,
  logoutUser,
  setSessionConflict,
  updateAuthUserPermissions,
} from "./slices/authSlice";
import { fetchZonesAndTables } from "./slices/branchSlice";
import { fetchInventoryItems } from "./slices/inventorySlice";
import { fetchMenuData } from "./slices/menuSlice";
import {
  addNotification,
  fetchNotifications,
  syncOfflineReads,
} from "./slices/notificationSlice";
import { fetchActiveOrders } from "./slices/posSlice";
import { fetchTeamMembers } from "./slices/teamMemberSlice";

let notificationPlayer = null;
try {
  notificationPlayer = createAudioPlayer(
    require("../../assets/sounds/tethys.mp3"),
  );
} catch (e) {
  console.log("Failed to initialize notification audio player", e);
}

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
        // Initial Notification Load & Sync
        store.dispatch(fetchNotifications(branchId));
        store.dispatch(syncOfflineReads());

        // Listen for order updates
        socketService.off("orderCreated");
        socketService.on("orderCreated", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        socketService.off("orderUpdated");
        socketService.on("orderUpdated", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        socketService.off("orderDeleted");
        socketService.on("orderDeleted", () => {
          store.dispatch(fetchActiveOrders(branchId));
        });

        // Listen for table status updates
        socketService.off("tableStatusChanged");
        socketService.on("tableStatusChanged", () => {
          store.dispatch(fetchZonesAndTables(branchId));
        });

        // Listen for menu updates
        socketService.off("menuChanged");
        socketService.on("menuChanged", () => {
          store.dispatch(fetchMenuData(branchId));
        });

        // Listen for inventory updates
        socketService.off("inventoryChanged");
        socketService.on("inventoryChanged", () => {
          store.dispatch(fetchInventoryItems(branchId));
        });

        // Listen for team member updates
        socketService.off("teamMemberChanged");
        socketService.on("teamMemberChanged", async (payload) => {
          const state = store.getState();
          const authUser = state.auth?.user;
          const userBusinessId =
            authUser?.businesses?.[0]?.id || authUser?.business_id;

          // Re-fetch all team members for the list
          if (userBusinessId) {
            store.dispatch(fetchTeamMembers(userBusinessId));
          }

          // If the changed member is the currently logged-in user,
          // fetch their fresh data and update auth.user so Sidebar/Nav updates immediately
          const changedId = payload?.id;
          if (changedId && authUser?.id && changedId === authUser.id) {
            try {
              const response = await teamMemberApi.getById(changedId);
              const freshMember = response?.data?.data;
              if (freshMember?.role) {
                store.dispatch(
                  updateAuthUserPermissions({ role: freshMember.role }),
                );
              }
            } catch (e) {
              // silently ignore
            }
          }
        });

        // Listen for notifications
        socketService.off("new_notification");
        socketService.on("new_notification", async (payload) => {
          store.dispatch(addNotification(payload));

          // Play notification sound
          try {
            if (notificationPlayer) {
              notificationPlayer.seekTo(0);
              notificationPlayer.play();
            }
          } catch (err) {
            console.log("Error playing notification sound:", err);
          }

          Toast.show({
            type: "info",
            text1: "🔔 " + (payload.title || "New Notification"),
            text2: payload.message || "",
            position: "top",
            visibilityTime: 4000,
          });
        });
      }

      // Session Conflict Management
      socketService.off("session_conflict");
      socketService.on("session_conflict", (data) => {
        store.dispatch(setSessionConflict(data?.message));
      });

      socketService.off("session_conflict_resolved");
      socketService.on("session_conflict_resolved", () => {
        store.dispatch(clearSessionConflict());
      });

      socketService.off("session_conflict_failed");
      socketService.on("session_conflict_failed", (data) => {
        Alert.alert("Error", data?.error || "Invalid PIN");
      });

      socketService.off("session_expired");
      socketService.on("session_expired", (data) => {
        store.dispatch(logoutUser());
        setTimeout(() => {
          Alert.alert(
            "Session Expired",
            data?.message || "You were logged in from another device.",
          );
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
