import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Bell, X } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { markAsRead } from "@/store/slices/notificationSlice";

export function NotificationDropdown({ visible, onClose }) {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  const handleNotificationPress = (item) => {
    if (!item.isRead) {
      dispatch(markAsRead(item.id));
    }
    // Could also navigate based on item.type or item.referenceId here if needed
  };

  const recentNotifications = notifications.slice(0, 20); // Show last 20

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        {/* Click inside shouldn't close */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.dropdownContainer}
          onPress={() => {}}
        >
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.titleText}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text weight="bold" style={styles.badgeText}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {recentNotifications.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No notifications yet.</Text>
              </View>
            ) : (
              recentNotifications.map((item) => {
                const isUnread = !item.isRead;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.item,
                      isUnread && styles.itemUnread,
                    ]}
                    onPress={() => handleNotificationPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemHeader}>
                      <Text weight={isUnread ? "bold" : "semibold"} style={styles.itemTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemTime}>
                        {new Date(item.createdAt || item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <Text style={styles.itemMessage} numberOfLines={2}>
                      {item.message}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "flex-end", // Align to the right
  },
  dropdownContainer: {
    marginTop: 65, // Below the header
    marginRight: ThemeSpacing.xxl,
    width: 380,
    maxHeight: 500,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  badge: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: ThemeColors.white,
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    maxHeight: 400,
  },
  emptyWrap: {
    padding: ThemeSpacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    color: ThemeColors.textSecondary,
    fontSize: 14,
  },
  item: {
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.white,
  },
  itemUnread: {
    backgroundColor: ThemeColors.blue + "10", // slight tint
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginRight: 8,
  },
  itemTime: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
  itemMessage: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
  },
});
