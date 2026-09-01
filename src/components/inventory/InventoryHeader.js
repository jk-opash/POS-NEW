import { CommonHeader } from "@/components/common/CommonHeader";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
export const TABS = [
  { key: "stock", label: "Stock List" },
  { key: "adjustments", label: "Adjustments" },
  { key: "audit", label: "Audit Log" },
];

export function InventoryHeader({
  isDesktop,
  navigation,
  dateString,
  activeTab,
  setActiveTab,
}) {
  return (
    <CommonHeader
      title="Inventory"
      bottomContent={
        <View style={styles.toolbarRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabs}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[
                    styles.filterTab,
                    isActive && {
                      backgroundColor: ThemeColors.emerald,
                      borderColor: ThemeColors.emerald,
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
          </ScrollView>
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
  branchTab: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  branchTabActive: {
    backgroundColor: ThemeColors.blue,
    borderColor: ThemeColors.blue,
  },
  branchTabText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
});
