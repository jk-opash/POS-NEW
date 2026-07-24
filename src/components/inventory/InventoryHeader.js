import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Bell, Menu } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity
              onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
              style={styles.menuBtn}
            >
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>Inventory</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerDate}>{dateString}</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={ThemeColors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Toolbar & Tabs ─────────────────────── */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  headerDate: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  notifBtn: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
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
