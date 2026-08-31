import { Loader } from "@/components/common/Loader";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { deleteSupplier, fetchSuppliers } from "@/store/slices/supplierSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Building2, Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { DeleteConfirmModal } from "@/components/suppliers/DeleteConfirmModal"; // We will create this next
import { SupplierDetailModal } from "@/components/suppliers/SupplierDetailModal";
import { SupplierFormModal } from "@/components/suppliers/SupplierFormModal";
import { SupplierHeader } from "@/components/suppliers/SupplierHeader";
import { SupplierListItem } from "@/components/suppliers/SupplierListItem";

const ITEMS_PER_PAGE = 10;

export default function SuppliersPage() {
  const dispatch = useDispatch();
  const { items: suppliers, loading } = useSelector((state) => state.supplier);
  const auth = useSelector((state) => state.auth);
  const businessId = auth.user?.businesses?.[0]?.id || auth.user?.business_id;

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSuppliers({ businessId }));
    }
  }, [businessId, dispatch]);

  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const { isMobile, isWebDesktop } = useResponsive();

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter((s) => s.status === "Active").length,
    pendingPayments: 0,
    totalPurchases: 0,
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE) || 1;
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  const handleDeleteConfirm = () => {
    if (supplierToDelete) {
      dispatch(deleteSupplier(supplierToDelete.id)).then(() => {
        setSupplierToDelete(null);
      });
    }
  };

  const renderPagination = () => {
    if (filteredSuppliers.length === 0) return null;
    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity
            style={[
              styles.pageBtn,
              currentPage === 1 && styles.pageBtnDisabled,
            ]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <Text
              style={[
                styles.pageBtnText,
                currentPage === 1 && styles.pageBtnTextDisabled,
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pageBtn,
              currentPage === totalPages && styles.pageBtnDisabled,
            ]}
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <Text
              style={[
                styles.pageBtnText,
                currentPage === totalPages && styles.pageBtnTextDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDesktopHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text weight="bold" style={[styles.col, { flex: 1.5, minWidth: 200 }]}>
        COMPANY NAME
      </Text>
      <Text weight="bold" style={[styles.col, { width: 150 }]}>
        CATEGORY
      </Text>
      <Text weight="bold" style={[styles.col, { width: 120 }]}>
        STATUS
      </Text>
      <Text weight="bold" style={[styles.col, { width: 200 }]}>
        CONTACT INFO
      </Text>
      <Text weight="bold" style={[styles.col, { width: 150 }]}>
        GST NUMBER
      </Text>
      <Text
        weight="bold"
        style={[styles.col, { width: 100, textAlign: "right" }]}
      >
        ACTIONS
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Building2 size={48} color={ThemeColors.border} />
      <Text weight="bold" style={styles.emptyTitle}>
        No suppliers found
      </Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or add a new supplier.
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <SupplierHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddSupplier={() => setIsFormVisible(true)}
      />

      <View style={[styles.tableContainer]}>
        {loading && suppliers.length === 0 ? (
          <Loader />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <View style={{ minWidth: 900, width: "100%" }}>
              <FlatList
                data={paginatedSuppliers}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderDesktopHeader}
                renderItem={({ item }) => (
                  <SupplierListItem
                    item={item}
                    onEdit={(sup) => setSelectedSupplierId(sup.id)}
                    onDelete={(sup) => setSupplierToDelete(sup)}
                  />
                )}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
        )}
        {renderPagination()}
      </View>

      <SupplierFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />
      {/* We are reusing SupplierDetailModal for View/Edit for now, though a dedicated Edit modal is better */}
      <SupplierDetailModal
        visible={!!selectedSupplierId}
        supplierId={selectedSupplierId}
        onClose={() => setSelectedSupplierId(null)}
      />

      {/* Fallback floating button for mobile */}
      {isMobile && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => setIsFormVisible(true)}
        >
          <Plus size={20} color={ThemeColors.white} />
        </TouchableOpacity>
      )}

      {supplierToDelete && (
        <DeleteConfirmModal
          visible={!!supplierToDelete}
          item={supplierToDelete}
          onClose={() => setSupplierToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  tableContainer: {
    // flex: 1,
    margin: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  tableContainerMobile: {
    marginHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  listContent: {
    paddingBottom: 100,
  },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  thText: {
    fontSize: 13,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.sm,
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
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.white,
  },
  pageText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  paginationButtons: {
    flexDirection: "row",
    gap: 8,
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  pageBtnTextDisabled: {
    color: ThemeColors.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xl,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.textPrimary,
    borderRadius: 28,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeSuccess: { backgroundColor: ThemeColors.emerald + "20" },
  badgeWarning: { backgroundColor: ThemeColors.amber + "20" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextSuccess: { color: ThemeColors.emerald },
  badgeTextWarning: { color: ThemeColors.amber },
});
