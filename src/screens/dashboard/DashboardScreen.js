import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DashboardSummaryCards } from "@/components/dashboard/DashboardSummaryCards";
import {
  DATE_RANGES,
  DatePickerModal,
} from "@/components/dashboard/DatePickerModal";
import { MultiStorePerformance } from "@/components/dashboard/MultiStorePerformance";
import { PaymentDistribution } from "@/components/dashboard/PaymentDistribution";
import { QuickReports } from "@/components/dashboard/QuickReports";
import { SalesByCategory } from "@/components/dashboard/SalesByCategory";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { LiveSettlementStatus } from "@/components/dashboard/LiveSettlementStatus";
import { SalesByOrderType } from "@/components/dashboard/SalesByOrderType";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Text } from "@/components/ui/Text";
import { useDashboard } from "@/hooks/useDashboard";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function DashboardScreen() {
  const dash = useDashboard();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const { width, isMobile, isMiniTab, isTablet, isDesktop , isWebDesktop } = useResponsive();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const selectedRangeLabel =
    DATE_RANGES.find((r) => r.key === dash.dateRange)?.label || "Today";

  return (
    <View style={styles.root}>
      {/* ── Top Header ──────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Dashboard</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{dateStr}</Text>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
        {/* ── Filter Tabs ─────────────────────── */}
        <View style={styles.toolbarRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabs}
          >
            {DATE_RANGES.map((range) => {
              const isActive = dash.dateRange === range.key;
              return (
                <TouchableOpacity
                  key={range.key}
                  onPress={() => {
                    if (range.key === "customRange") {
                      setDatePickerVisible(true);
                    } else {
                      dash.setDateRange(range.key);
                    }
                  }}
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
                    {range.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* ── Main Scroll ────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mobileLayout}>
          {/* Business Summary */}
          <SectionHeader title="Dashboard Overview" isOverview={true} />
          <DashboardSummaryCards
            isLoading={isLoading}
            summary={dash.summary}
            isMobile={isMobile}
            isMiniTab={isMiniTab}
          />

          <SalesChart
            data={dash.salesData}
            activeTab={dash.salesTab}
            onTabChange={dash.setSalesTab}
          />

          {isDesktop ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  gap: ThemeSpacing.md,
                  marginTop: ThemeSpacing.sm,
                }}
              >
                <View style={{ flex: 1 }}>
                  <LiveSettlementStatus settled={84} unsettled={12} running={6} />
                </View>
                <View style={{ flex: 1 }}>
                  <SalesByOrderType dineIn={28000} takeaway={8500} delivery={12400} />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: ThemeSpacing.md,
                  marginTop: ThemeSpacing.sm,
                }}
              >
                <View style={{ flex: 0.7 }}>
                  <SalesByCategory data={dash.salesByCategory} />
                </View>
              </View>
              <View style={{ marginTop: ThemeSpacing.sm }}>
                <PaymentDistribution data={dash.paymentDistribution} />
              </View>
              <View style={{ marginTop: ThemeSpacing.sm }}>
                <MultiStorePerformance stores={dash.stores} />
              </View>
            </>
          ) : (
            <View style={{ gap: ThemeSpacing.sm, marginTop: ThemeSpacing.sm }}>
              <LiveSettlementStatus settled={84} unsettled={12} running={6} />
              <SalesByOrderType dineIn={28000} takeaway={8500} delivery={12400} />
              <SalesByCategory data={dash.salesByCategory} />
              <PaymentDistribution data={dash.paymentDistribution} />
              <MultiStorePerformance stores={dash.stores} />
            </View>
          )}

          {isMiniTab || isDesktop ? (
            <View
              style={{
                flexDirection: "row",
                gap: ThemeSpacing.md,
                marginTop: ThemeSpacing.sm,
              }}
            >
              <View style={{ flex: 1 }}>
                <ActivityFeed activities={dash.activities} />
              </View>
              <View style={{ flex: 0.6 }}>
                <QuickReports oneColumn={true} />
              </View>
            </View>
          ) : (
            <>
              {/* Activity Feed */}
              <ActivityFeed activities={dash.activities} />

              {/* Quick Reports */}
              <QuickReports />
            </>
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedRange={dash.dateRange}
        onSelectRange={(range) => {
          dash.setDateRange(range);
          setDatePickerVisible(false);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
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
    paddingRight: ThemeSpacing.xxl, // To allow scrolling past the last item cleanly
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: ThemeSpacing.lg,
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.sm,
  },
  datePickerText: { fontSize: 13, color: ThemeColors.textPrimary },
  actionToggle: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.sm,
    padding: 2,
  },
  actionToggleBtnActive: {
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.sm,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.sm,
  },
  actionToggleTextActive: { fontSize: 12, color: ThemeColors.textPrimary },
  actionToggleText: { fontSize: 12, color: ThemeColors.textSecondary },
  bottomPad: { height: 40 },
  // Responsive Layout Grid styles
  mobileLayout: {
    gap: ThemeSpacing.sm,
  },
  tabletLayout: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  tabletMainCol: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  tabletSideCol: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  desktopLayout: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  desktopLeftCol: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  desktopMidCol: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  desktopRightCol: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  summaryColMobile: {
    gap: ThemeSpacing.sm,
  },
});
