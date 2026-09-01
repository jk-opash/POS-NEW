import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Building2 } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export function SupplierListItem({ item, onEdit, onDelete, isMobile }) {
  const isAvailable = item.status === "Active";
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return { bg: ThemeColors.emeraldDim, color: ThemeColors.emerald };
      case "Blocked":
        return { bg: ThemeColors.roseDim, color: ThemeColors.rose };
      case "Archived":
        return {
          bg: ThemeColors.borderSubtle,
          color: ThemeColors.textSecondary,
        };
      default:
        return {
          bg: ThemeColors.surfaceHighlight,
          color: ThemeColors.textSecondary,
        };
    }
  };

  const statusStyle = getStatusStyle(item.status);

  // Desktop / Tablet Table Row
  return (
    <View style={styles.tableRow}>
      {/* Company Name */}
      <View style={[styles.cell, { width: 250 }]}>
        <View style={styles.companyWrap}>
          <View style={styles.avatarWrapSmall}>
            <Building2 size={16} color={ThemeColors.textMuted} />
          </View>
          <View>
            <Text weight="bold" style={styles.nameText}>
              {item.name}
            </Text>
            <Text style={styles.subNameText} numberOfLines={1}>
              {item.business_name || "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* Category */}
      <View style={[styles.cell, { width: 150 }]}>
        <Text style={styles.categoryPillText}>
          {item.category || "General"}
        </Text>
      </View>

      {/* Status */}
      <View style={[styles.cell, { width: 120 }]}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.bg, alignSelf: "flex-start" },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={[styles.cell, { width: 200 }]}>
        {item.contact?.person ? (
          <Text weight="medium" style={styles.contactPerson}>
            {item.contact.person}
          </Text>
        ) : null}
        {item.contact?.mobile ? (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.contact.mobile}</Text>
          </View>
        ) : null}
        {item.contact?.email ? (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.contact.email}</Text>
          </View>
        ) : null}
      </View>

      {/* GST Number */}
      <View style={[styles.cell, { width: 150 }]}>
        <Text style={styles.gstText}>{item.tax?.gst || "-"}</Text>
      </View>

      {/* Actions */}
      <View
        style={[
          styles.cell,
          {
            width: 100,
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 12,
          },
        ]}
      >
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text weight="bold" style={{ fontSize: 13, color: ThemeColors.blue }}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Text weight="bold" style={{ fontSize: 13, color: ThemeColors.rose }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Table Row Styles (Desktop)
  tableRow: {
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
  companyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  subNameText: {
    fontSize: 10,
    color: ThemeColors.textMuted,
    fontWeight: "500",
    marginTop: 2,
    width: "70%",
  },
  categoryPill: {
    backgroundColor: ThemeColors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  categoryPillText: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  contactPerson: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  contactText: {
    fontSize: 10,
    color: ThemeColors.textSecondary,
  },
  gstText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  actionsCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  actionBtnHoverRed: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "transparent",
  },

  // Mobile Card Styles
  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.md,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ThemeColors.surfaceHighlight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  infoWrap: {
    marginBottom: ThemeSpacing.md,
  },
  name: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  businessName: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginBottom: ThemeSpacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    fontSize: 11,
    backgroundColor: ThemeColors.surfaceHighlight,
    color: ThemeColors.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "600",
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: ThemeColors.roseDim,
    borderRadius: 6,
  },
});
