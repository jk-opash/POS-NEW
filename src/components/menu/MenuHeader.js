import { CommonHeader } from "@/components/common/CommonHeader";
import { SearchWithFilter } from "@/components/ui/SearchWithFilter";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
// Removed FILTER_TABS as filtering is now handled by the sidebar

export function MenuHeader({
  isDesktop,
  isSelectMode,
  setIsSelectMode,
  setSelectedIds,
  searchQuery,
  setSearchQuery,
  handleBarcodeScan,
  filterOptions,
  activeFilter,
  onFilterChange,
  onNewPress,
}) {
  return (
    <CommonHeader
      title="Menu Items"
      bottomContent={
        <View style={styles.toolbarRow}>
          <SearchWithFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleBarcodeScan}
            filterOptions={filterOptions}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            placeholder="Search menu items by name or scan barcode..."
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 1000,
    elevation: 50,
  },
});
