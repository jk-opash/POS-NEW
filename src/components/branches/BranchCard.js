import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { MapPin, Settings, Store } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function BranchCard({ item, onPress, onEdit }) {
  const isActive = item.status === "Active";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: isActive
                  ? ThemeColors.emeraldDim
                  : ThemeColors.border,
              },
            ]}
          >
            <Store
              size={24}
              color={isActive ? ThemeColors.emerald : ThemeColors.textSecondary}
            />
          </View>
          <View>
            <Text weight="bold" style={styles.branchName}>
              {item.name}
            </Text>
            <Text style={styles.branchCode}>
              {item.code} • {item.type}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isActive
                ? ThemeColors.emeraldDim
                : ThemeColors.redDim,
            },
          ]}
        >
          <Text
            weight="bold"
            style={[
              styles.statusText,
              { color: isActive ? ThemeColors.emerald : ThemeColors.red },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Today's Sales</Text>
            <Text weight="bold" style={styles.metricValue}>
              ₹{(item.metrics?.todaySales || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Revenue</Text>
            <Text weight="bold" style={styles.metricValue}>
              ₹{(item.metrics?.revenue || 0).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Inventory</Text>
            <Text weight="bold" style={styles.metricValue}>
              ₹{(item.metrics?.inventoryValue || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Manager</Text>
            <Text weight="bold" style={styles.metricValue}>
              {item.manager}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.locationWrap}>
          <MapPin size={14} color={ThemeColors.textMuted} />
          <Text style={styles.locationText}>
            {item.city}, {item.state}
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={onEdit}>
          <Settings size={18} color={ThemeColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  iconWrap: {
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
  },
  branchName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  branchCode: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    position: "absolute",
    top: 10,
    right: 10,
  },
  statusText: {
    fontSize: 12,
  },
  cardBody: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.lg,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.background,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  settingsBtn: {
    padding: 6,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
});
