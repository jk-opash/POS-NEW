import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Bell, Menu } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";

const MONTHS = [
  { label: "All Months", value: "all" },
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const YEARS = [
  { label: "All Years", value: "all" },
  { label: "2023", value: 2023 },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
  { label: "2027", value: 2027 },
];

export function InvoicesHeader({
  isDesktop,
  navigation,
  dateString,
  isTodaySelected,
  setIsTodaySelected,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
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
          <Text style={styles.pageTitle}>Invoices</Text>
        </View>
        <View style={styles.headerRight}>
          <HeaderQuickNav />
          <Text weight="medium" style={styles.headerDate}>
            {dateString}
          </Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={ThemeColors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Toolbar & Tabs ─────────────────────── */}
      <View style={styles.toolbarRow}>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            onPress={() => {
              setIsTodaySelected(!isTodaySelected);
              if (!isTodaySelected) {
                setSelectedMonth("all");
                setSelectedYear("all");
              }
            }}
            style={[
              styles.filterTab,
              isTodaySelected && {
                backgroundColor: ThemeColors.emerald,
                borderColor: ThemeColors.emerald,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text
              weight={isTodaySelected ? "semibold" : "regular"}
              style={[
                styles.filterTabText,
                isTodaySelected && styles.filterTabTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>

          <Dropdown
            options={MONTHS}
            value={selectedMonth}
            onChange={(val) => {
              setSelectedMonth(val);
              setIsTodaySelected(false);
            }}
            placeholder="Month"
            style={styles.filterDropdown}
          />

          <Dropdown
            options={YEARS}
            value={selectedYear}
            onChange={(val) => {
              setSelectedYear(val);
              setIsTodaySelected(false);
            }}
            placeholder="Year"
            style={styles.filterDropdown}
          />
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
  filterGroup: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    alignItems: "center",
  },
  filterTab: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    height: 38,
    justifyContent: "center",
  },
  filterTabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  filterTabTextActive: {
    color: ThemeColors.white,
  },
  filterDropdown: {
    borderRadius: ThemeRadius.xl,
    height: 38,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.lg,
    minWidth: 120,
  },
});
