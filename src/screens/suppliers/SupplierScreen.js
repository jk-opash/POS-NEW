import { Text } from "@/components/ui/Text";
import { useSuppliers } from "@/context/SupplierContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Plus, Truck } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { SupplierDetailModal } from "@/components/suppliers/SupplierDetailModal";
import { SupplierFormModal } from "@/components/suppliers/SupplierFormModal";
import { SupplierHeader } from "@/components/suppliers/SupplierHeader";
import { SupplierListItem } from "@/components/suppliers/SupplierListItem";
import { SupplierStats } from "@/components/suppliers/SupplierStats";

export function SupplierScreen() {
  const { suppliers, getSupplierStats } = useSuppliers();
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { isDesktop, isTablet, isMiniTab, isMobile , isWebDesktop } = useResponsive();
  const navigation = useNavigation();

  const stats = getSupplierStats();
  const categories = [
    "All",
    "Manufacturer",
    "Distributor",
    "Wholesaler",
    "Service Provider",
  ];

  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 2;

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const renderHeader = () => <SupplierStats stats={stats} />;

  const renderSupplierListItem = ({ item }) => (
    <SupplierListItem
      item={item}
      onPress={() => setSelectedSupplierId(item.id)}
      isMobile={isMobile}
    />
  );

  return (
    <View style={styles.root}>
      <SupplierHeader
        isDesktop={isWebDesktop}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />

      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={renderSupplierListItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Truck size={48} color={ThemeColors.border} />
            <Text weight="bold" style={styles.emptyTitle}>
              No suppliers found
            </Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or add a new supplier.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        numColumns={numColumns}
        key={`list-${numColumns}`}
        showsVerticalScrollIndicator={false}
      />

      <SupplierFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />

      <SupplierDetailModal
        visible={!!selectedSupplierId}
        supplierId={selectedSupplierId}
        onClose={() => setSelectedSupplierId(null)}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setIsFormVisible(true)}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>Add Supplier</Text>
      </TouchableOpacity>
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
    gap: ThemeSpacing.md,
  },
  headerFilters: {
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.bg,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    height: 48,
    gap: ThemeSpacing.sm,
    width: 250,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  filterTabs: {
    gap: ThemeSpacing.sm,
    paddingRight: ThemeSpacing.xl,
  },
  filterTab: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    justifyContent: "center",
  },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 100,
    gap: ThemeSpacing.md,
  },
  columnWrapper: {
    gap: ThemeSpacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ThemeSpacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginTop: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: ThemeRadius.full,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
