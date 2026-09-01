import { CommonHeader } from "@/components/common/CommonHeader";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const FILTER_TABS = [
  { key: "All", label: "All", activeColor: ThemeColors.emerald },
  { key: "Dine In", label: "Dine In", activeColor: ThemeColors.emerald },
  { key: "Takeaway", label: "Takeaway", activeColor: ThemeColors.amber },
];

export function OrdersHeader({
  isDesktop,
  dateString,
  activeFilter,
  setActiveFilter,
}) {
  return (
    <CommonHeader
      title="Orders"
      bottomContent={
        <View style={styles.toolbarRow}>
          <View style={styles.filterTabs}>
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              const activeColor = tab.activeColor;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveFilter(tab.key)}
                  style={[
                    styles.filterTab,
                    isActive && {
                      backgroundColor: activeColor,
                      borderColor: activeColor,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    weight={isActive ? "semibold" : "regular"}
                    style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  headerDate: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  // ── Filter Tabs ──
  filterTabs: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  filterTab: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  filterTabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  filterTabTextActive: {
    color: ThemeColors.white,
  },
});
