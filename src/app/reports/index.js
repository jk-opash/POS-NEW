import {
  DATE_RANGES,
  DatePickerModal,
} from "@/components/dashboard/DatePickerModal";
import { ReportContent } from "@/components/reports/ReportContent";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import {
  AlertTriangle,
  Banknote,
  ChevronRight,
  Package,
  Receipt,
  Store,
  Users,
  UserSquare2,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const REPORT_CATEGORIES = [
  { id: "sales", label: "Sales & Revenue", icon: Receipt },
  { id: "inventory", label: "Inventory & Stock", icon: Package },
  { id: "financial", label: "Financials & Tax", icon: Banknote },
  { id: "employees", label: "Staff Performance", icon: Users },
  { id: "customers", label: "CRM & Loyalty", icon: UserSquare2 },
  { id: "stores", label: "Multi-Store Sync", icon: Store },
  { id: "audits", label: "Audits & Voids", icon: AlertTriangle },
];

export default function ReportsPage() {
  const { isDesktop, isTablet, isWebDesktop } = useResponsive();
  const navigation = useNavigation();
  const dash = [];

  const [activeCategory, setActiveCategory] = useState("sales");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const selectedRangeLabel =
    DATE_RANGES.find((r) => r.key === dash.dateRange)?.label || "Today";
  const showSidebar = isDesktop || isTablet;

  return (
    <View style={styles.root}>
      <ReportsHeader
        isDesktop={isWebDesktop}
        onMenuPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
        selectedRangeLabel={selectedRangeLabel}
        onDatePickerPress={() => setDatePickerVisible(true)}
        tabs={!showSidebar ? REPORT_CATEGORIES : []}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
      />
      <View style={styles.contentContainer}>
        {showSidebar && (
          <View style={styles.sidebar}>
            <Text weight="bold" style={styles.sidebarTitle}>
              Report Categories
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {REPORT_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.sidebarItem,
                      isActive && styles.sidebarItemActive,
                    ]}
                    onPress={() => setActiveCategory(cat.id)}
                  >
                    <Icon
                      size={20}
                      color={
                        isActive
                          ? ThemeColors.emerald
                          : ThemeColors.textSecondary
                      }
                    />
                    <Text
                      weight={isActive ? "semibold" : "regular"}
                      style={[
                        styles.sidebarItemText,
                        isActive && styles.sidebarItemTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                    {isActive && (
                      <ChevronRight size={16} color={ThemeColors.emerald} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View style={styles.mainContent}>
          <ReportContent activeTab={activeCategory} dash={dash} />
        </View>
      </View>
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
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: ThemeColors.bg,
  },
  sidebar: {
    width: 250,
    backgroundColor: ThemeColors.surface,
    borderRightWidth: 1,
    borderColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.lg,
  },
  sidebarTitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    paddingHorizontal: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: ThemeSpacing.lg,
    gap: ThemeSpacing.sm,
  },
  sidebarItemActive: {
    backgroundColor: ThemeColors.emerald + "10",
    borderRightWidth: 3,
    borderColor: ThemeColors.emerald,
  },
  sidebarItemText: { flex: 1, fontSize: 14, color: ThemeColors.textSecondary },
  sidebarItemTextActive: { color: ThemeColors.emerald },
  mainContent: { flex: 1 },
});
