import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Bell, Menu } from "lucide-react-native";
import { useNavigation } from "expo-router";

export const FILTER_TABS = [
  { key: "All", label: "All", activeColor: ThemeColors.emerald },
  { key: "Dine In", label: "Dine In", activeColor: ThemeColors.emerald },
  { key: "Takeaway", label: "Takeaway", activeColor: ThemeColors.amber },
];

export function OrdersHeader({ isDesktop, dateString, activeFilter, setActiveFilter }) {
  const navigation = useNavigation();

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
          <Text style={styles.pageTitle}>Orders</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerDate}>{dateString}</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={ThemeColors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Filter Tabs ─────────────────────── */}
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
