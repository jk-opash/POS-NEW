import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Menu, ScanLine, ShoppingBag } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { SearchWithFilter } from "@/components/ui/SearchWithFilter";
import { Dropdown } from "@/components/ui/Dropdown";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search } from "lucide-react-native";
import { TextInput } from "react-native";
import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";

export function POSHeader({
  isDesktop,
  onMenuPress,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onFilterChange,
  isRetail,
  isScannerConnected,
  onSimulateScan,
  onTakeawayOrdersPress,
  activeTakeawaysCount = 0,
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>POS Billing</Text>
        </View>

        <View style={styles.headerRight}>
          <HeaderQuickNav />
          <TouchableOpacity style={styles.takeawayBtn} onPress={onTakeawayOrdersPress}>
            <ShoppingBag size={20} color={ThemeColors.textPrimary} />
            <Text style={styles.takeawayBtnText} weight="medium">Takeaways</Text>
            {activeTakeawaysCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText} weight="bold">{activeTakeawaysCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={24} color={ThemeColors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toolbarRow}>
        <View style={styles.dropdownsContainer}>
          <Dropdown
            style={styles.filterDropdown}
            options={categories.map((c) => ({ label: c, value: c }))}
            value={activeCategory}
            onChange={onFilterChange}
            placeholder="Category"
          />
        </View>

        <View style={styles.searchContainer}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name, SKU or barcode..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        {isRetail && (
          <TouchableOpacity
            style={styles.barcodeScanBtn}
            onPress={onSimulateScan}
          >
            <ScanLine
              size={20}
              color={
                isScannerConnected ? ThemeColors.emerald : ThemeColors.primary
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
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
  takeawayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.background,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    position: "relative",
  },
  takeawayBtnText: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: ThemeColors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
  },
  notifBtn: { position: "relative", padding: 4 },
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
  barcodeScanBtn: {
    padding: 10,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 999,
  },
  dropdownsContainer: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    width: 250, // Fixed width for category dropdown
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    height: 42,
    paddingHorizontal: ThemeSpacing.md,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  filterDropdown: {
    flex: 1,
    height: 42,
  },
});
