import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Ban, Eye, Shield, Trash2 } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export function EmployeeListItem({
  item,
  onEdit,
  onDelete,
  onToggleStatus,
  isMobile,
}) {
  const isAvailable = item.status === "Active" || item.active;

  // Desktop Table Row
  return (
    <View style={styles.tableRow}>
      {/* Member Name */}
      <View style={[styles.cell, { flex: 1 }]}>
        <Text
          weight="bold"
          style={{ fontSize: 13, color: ThemeColors.textPrimary }}
        >
          {item.first_name || item.name} {item.last_name || ""}
        </Text>
        <Text
          style={{ fontSize: 12, color: ThemeColors.textMuted, marginTop: 2 }}
        >
          {item.email}
        </Text>
      </View>

      {/* Role */}
      <View style={[styles.cell, { flex: 1 }]}>
        <View style={styles.rolePill}>
          <Shield size={12} color={ThemeColors.blue} />
          <Text style={styles.rolePillText}>
            {item.role?.name || item.role || "Staff"}
          </Text>
        </View>
      </View>

      {/* Status */}
      <View style={[styles.cell, { flex: 1 }]}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isAvailable
                ? ThemeColors.emerald + "18"
                : ThemeColors.textMuted + "18",
              alignSelf: "flex-start",
            },
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isAvailable
                  ? ThemeColors.emerald
                  : ThemeColors.textMuted,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: isAvailable
                  ? ThemeColors.emerald
                  : ThemeColors.textSecondary,
              },
            ]}
          >
            {item.status || (item.active ? "Active" : "Inactive")}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View
        style={[
          styles.cell,
          {
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionBtnDesktop}
          onPress={() => onEdit(item)}
        >
          <Eye size={14} color={ThemeColors.textSecondary} />
          <Text style={styles.actionBtnText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtnDesktop,
            isAvailable ? styles.actionBtnWarning : styles.actionBtnSuccess,
          ]}
          onPress={() => onToggleStatus(item)}
        >
          <Ban
            size={14}
            color={isAvailable ? ThemeColors.amber : ThemeColors.emerald}
          />
          <Text
            style={[
              styles.actionBtnText,
              { color: isAvailable ? ThemeColors.amber : ThemeColors.emerald },
            ]}
          >
            {isAvailable ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnDesktopDelete}
          onPress={() => onDelete(item.id)}
        >
          <Trash2 size={14} color={ThemeColors.rose} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Table Row Styles (Desktop)
  tableRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    cursor: Platform.OS === "web" ? "pointer" : "default",
  },
  cell: {
    paddingHorizontal: ThemeSpacing.sm,
    justifyContent: "center",
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceHighlight,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    alignSelf: "flex-start",
    gap: 4,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: ThemeColors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionBtnDesktop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
    gap: 4,
  },
  actionBtnWarning: {
    borderColor: ThemeColors.amber + "40",
    backgroundColor: ThemeColors.amber + "10",
  },
  actionBtnSuccess: {
    borderColor: ThemeColors.emerald + "40",
    backgroundColor: ThemeColors.emerald + "10",
  },
  actionBtnDesktopDelete: {
    padding: 6,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.surface,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: ThemeColors.textSecondary,
  },

  // Mobile Card Styles
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ThemeColors.primary + "18",
    justifyContent: "center",
    alignItems: "center",
    marginRight: ThemeSpacing.md,
  },
  avatarText: {
    fontSize: 16,
    color: ThemeColors.primary,
  },
  infoBlock: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  rightBlock: {
    alignItems: "flex-end",
    gap: ThemeSpacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.xs,
  },
  actionBtn: {
    padding: 8,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surfaceHighlight,
  },
  deleteBtn: {
    backgroundColor: ThemeColors.rose + "18",
  },
});
