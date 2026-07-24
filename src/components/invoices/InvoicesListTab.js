import { Text } from "@/components/ui/Text";
import { useInvoices } from "@/context/InvoicesContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutGrid,
  List,
  Search,
  User,
  Utensils,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export function InvoicesListTab({
  isTodaySelected,
  selectedMonth,
  selectedYear,
}) {
  const { invoices } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, isTodaySelected, selectedMonth, selectedYear]);

  const { isDesktop, isTablet, isMiniTab, width } = useResponsive();

  // Responsive columns: desktop 4, tablet 3, mini tab 2, mobile 1
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 2;

  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2;
  const totalGap = ThemeSpacing.lg * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numColumns > 1 ? Math.floor(availableWidth / numColumns) : "100%";

  const filteredInvoices = invoices.filter((inv) => {
    if (inv.status !== "Paid" && inv.status !== "Pending") return false;

    const invDate = new Date(inv.date);
    const now = new Date();

    if (isTodaySelected) {
      if (invDate.toDateString() !== now.toDateString()) return false;
    } else {
      if (selectedMonth !== "all" && invDate.getMonth() !== selectedMonth)
        return false;
      if (selectedYear !== "all" && invDate.getFullYear() !== selectedYear)
        return false;
    }

    const searchLower = searchQuery.toLowerCase();
    return (
      inv.id.toLowerCase().includes(searchLower) ||
      inv.customer.name.toLowerCase().includes(searchLower) ||
      inv.type.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const renderCard = (inv) => {
    const invDate = new Date(inv.date);
    const timeStr = invDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = invDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    const isPending = inv.status === "Pending";

    return (
      <TouchableOpacity
        key={inv.id}
        style={[styles.card, { width: cardWidth }]}
        activeOpacity={0.9}
        onPress={() => setSelectedInvoiceId(inv.id)}
      >
        <View style={styles.cardHeader}>
          <Text weight="bold" style={styles.invoiceId} numberOfLines={1}>
            {inv.id}
          </Text>
          <InvoiceStatusBadge status={inv.status} />
        </View>

        <View style={styles.cardBody}>
          <Text weight="semibold" style={styles.customerName} numberOfLines={1}>
            {inv.table ? inv.table : inv.customer?.name || "Walk-in Customer"}
          </Text>
          <Text style={styles.invoiceDate} numberOfLines={1}>
            {dateStr} • {timeStr}
          </Text>
        </View>

        <Text
          weight="bold"
          style={[styles.grandTotal, isPending && { color: ThemeColors.amber }]}
        >
          ₹{inv.grandTotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTableRow = (inv) => {
    const invDate = new Date(inv.date);
    const timeStr = invDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = invDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

    return (
      <TouchableOpacity
        key={inv.id}
        style={styles.tableRow}
        activeOpacity={0.7}
        onPress={() => setSelectedInvoiceId(inv.id)}
      >
        <View
          style={[
            styles.col,
            { flex: 1.2, flexDirection: "row", alignItems: "center", gap: 8 },
          ]}
        >
          <View style={styles.tableIconBox}>
            <FileText size={14} color={ThemeColors.primary} />
          </View>
          <Text weight="semibold" style={{ color: ThemeColors.textPrimary }}>
            {inv.id}
          </Text>
        </View>

        <View
          style={[
            styles.col,
            { flex: 1.5, flexDirection: "row", alignItems: "center", gap: 6 },
          ]}
        >
          <Calendar size={14} color={ThemeColors.textMuted} />
          <Text style={{ color: ThemeColors.textSecondary }}>
            {dateStr} • {timeStr}
          </Text>
        </View>

        <View
          style={[
            styles.col,
            { flex: 2.5, flexDirection: "row", alignItems: "center", gap: 12 },
          ]}
        >
          <View style={styles.tableCustomerAvatar}>
            {inv.table ? (
              <Utensils size={14} color={ThemeColors.textSecondary} />
            ) : (
              <User size={14} color={ThemeColors.textSecondary} />
            )}
          </View>
          <View>
            <Text
              weight="medium"
              style={{ color: ThemeColors.textPrimary }}
              numberOfLines={1}
            >
              {inv.table ? inv.table : inv.customer?.name || "Walk-in"}
            </Text>
            <Text style={{ color: ThemeColors.textMuted, fontSize: 12 }}>
              {inv.type}
            </Text>
          </View>
        </View>



        <View
          style={[
            styles.col,
            { flex: 1.2, alignItems: "flex-end", justifyContent: "center" },
          ]}
        >
          <Text weight="bold" style={styles.tableTotal}>
            ₹{inv.grandTotal.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  let content;
  if (filteredInvoices.length === 0) {
    content = (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Wallet size={32} color={ThemeColors.border} />
        </View>
        <Text weight="bold" style={styles.emptyTitle}>
          No invoices found
        </Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters.
        </Text>
      </View>
    );
  } else if (isListView) {
    content = (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableContainer}
        contentContainerStyle={{ minWidth: "100%" }}
      >
        <View style={{ minWidth: isDesktop ? "100%" : 900, width: "100%" }}>
          <View style={styles.tableHeader}>
            <View style={[styles.col, { flex: 1.2, flexDirection: "row", alignItems: "center" }]}>
              <View style={{ width: 28 + 8 }} />
              <Text weight="semibold" style={styles.colHeader}>
                Invoice ID
              </Text>
            </View>
            <View style={[styles.col, { flex: 1.5, flexDirection: "row", alignItems: "center" }]}>
              <View style={{ width: 14 + 6 }} />
              <Text weight="semibold" style={styles.colHeader}>
                Date & Time
              </Text>
            </View>
            <View style={[styles.col, { flex: 2.5, flexDirection: "row", alignItems: "center" }]}>
              <View style={{ width: 32 + 12 }} />
              <Text weight="semibold" style={styles.colHeader}>
                Customer / Details
              </Text>
            </View>

            <View style={[styles.col, { flex: 1.2, alignItems: "flex-end" }]}>
              <Text weight="semibold" style={styles.colHeader}>
                Total
              </Text>
            </View>
          </View>
          {currentInvoices.map((inv) => renderTableRow(inv))}
        </View>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={currentInvoices}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        scrollEnabled={false}
        columnWrapperStyle={
          numColumns > 1 ? { gap: ThemeSpacing.lg } : undefined
        }
        contentContainerStyle={{ gap: ThemeSpacing.lg }}
        renderItem={({ item }) => renderCard(item)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <View style={styles.searchWrap}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search invoice, customer..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.viewToggleWrap}>
          <TouchableOpacity
            onPress={() => setIsListView(false)}
            style={[
              styles.viewToggleBtn,
              !isListView && styles.viewToggleBtnActive,
            ]}
          >
            <LayoutGrid
              size={18}
              color={
                !isListView ? ThemeColors.emerald : ThemeColors.textSecondary
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsListView(true)}
            style={[
              styles.viewToggleBtn,
              isListView && styles.viewToggleBtnActive,
            ]}
          >
            <List
              size={18}
              color={
                isListView ? ThemeColors.emerald : ThemeColors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {content}

      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationSummary}>
            Showing{" "}
            <Text weight="bold" style={{ color: ThemeColors.textPrimary }}>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </Text>{" "}
            to{" "}
            <Text weight="bold" style={{ color: ThemeColors.textPrimary }}>
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)}
            </Text>{" "}
            of{" "}
            <Text weight="bold" style={{ color: ThemeColors.textPrimary }}>
              {filteredInvoices.length}
            </Text>{" "}
            entries
          </Text>
          <View style={styles.paginationControls}>
            <TouchableOpacity
              style={[
                styles.pageArrowBtn,
                currentPage === 1 && styles.pageArrowBtnDisabled,
              ]}
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft
                size={18}
                color={
                  currentPage === 1
                    ? ThemeColors.borderSubtle
                    : ThemeColors.textSecondary
                }
              />
            </TouchableOpacity>

            {(() => {
              const pages = [];
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              if (currentPage <= 3) endPage = Math.min(5, totalPages);
              if (currentPage >= totalPages - 2)
                startPage = Math.max(1, totalPages - 4);

              if (startPage > 1) {
                pages.push(
                  <TouchableOpacity
                    key="first"
                    style={styles.pageNumberBtn}
                    onPress={() => setCurrentPage(1)}
                  >
                    <Text style={styles.pageNumberText}>1</Text>
                  </TouchableOpacity>,
                );
                if (startPage > 2)
                  pages.push(
                    <Text key="ell1" style={styles.pageEllipsis}>
                      ...
                    </Text>,
                  );
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.pageNumberBtn,
                      currentPage === i && styles.pageNumberBtnActive,
                    ]}
                    onPress={() => setCurrentPage(i)}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        currentPage === i && styles.pageNumberTextActive,
                      ]}
                    >
                      {i}
                    </Text>
                  </TouchableOpacity>,
                );
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1)
                  pages.push(
                    <Text key="ell2" style={styles.pageEllipsis}>
                      ...
                    </Text>,
                  );
                pages.push(
                  <TouchableOpacity
                    key="last"
                    style={styles.pageNumberBtn}
                    onPress={() => setCurrentPage(totalPages)}
                  >
                    <Text style={styles.pageNumberText}>{totalPages}</Text>
                  </TouchableOpacity>,
                );
              }
              return pages;
            })()}

            <TouchableOpacity
              style={[
                styles.pageArrowBtn,
                currentPage === totalPages && styles.pageArrowBtnDisabled,
              ]}
              disabled={currentPage === totalPages}
              onPress={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
            >
              <ChevronRight
                size={18}
                color={
                  currentPage === totalPages
                    ? ThemeColors.borderSubtle
                    : ThemeColors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <InvoiceDetailsModal
        visible={!!selectedInvoiceId}
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacing.lg,
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    marginBottom: ThemeSpacing.sm,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    paddingHorizontal: ThemeSpacing.xl,
    height: 48,
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: ThemeSpacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  viewToggleWrap: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    padding: 4,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  viewToggleBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
  },
  viewToggleBtnActive: {
    backgroundColor: ThemeColors.emerald + "15",
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  invoiceId: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  cardBody: {
    gap: 4,
    marginBottom: ThemeSpacing.lg,
  },
  customerName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  invoiceDate: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  grandTotal: {
    fontSize: 17,
    color: ThemeColors.textPrimary,
  },
  tableContainer: {
    width: "100%",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  colHeader: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  tableIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ThemeColors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCustomerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
  tableTotal: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  col: {
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  emptyTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.lg,
    marginTop: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    flexWrap: "wrap",
    gap: ThemeSpacing.lg,
  },
  paginationSummary: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageArrowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  pageArrowBtnDisabled: {
    backgroundColor: ThemeColors.bg,
    borderColor: ThemeColors.borderSubtle,
  },
  pageNumberBtn: {
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ThemeRadius.full,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  pageNumberBtnActive: {
    backgroundColor: ThemeColors.emerald,
  },
  pageNumberText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  pageNumberTextActive: {
    color: ThemeColors.white,
    fontWeight: "600",
  },
  pageEllipsis: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    paddingHorizontal: 4,
  },
});
