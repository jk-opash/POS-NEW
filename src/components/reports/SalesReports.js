import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  AlertCircle,
  Banknote,
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  Package,
  Percent,
  Receipt,
  Store,
  TrendingUp,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";

// Main Component
export function SalesReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const [activeReportTab, setActiveReportTab] = useState("transactions");

  // Modal State
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { summary, detailedSales } = dash;

  // Derive metrics
  const totalDiscounts =
    detailedSales?.reduce((acc, sale) => acc + (sale.discount || 0), 0) || 0;
  const totalTax =
    detailedSales?.reduce((acc, sale) => acc + (sale.tax || 0), 0) || 0;
  const totalRefunds =
    detailedSales
      ?.filter((s) => s.status === "Refunded")
      .reduce((acc, sale) => acc + (sale.refundAmount || 0), 0) || 0;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View
        key="gross"
        style={isScrollable ? { width: cardWidth } : { flex: 1 }}
      >
        <SummaryCard
          icon={<Banknote size={18} color={ThemeColors.blue} />}
          title="Gross Sales"
          primary={`₹${(summary.profit.gross / 1000).toFixed(1)}K`}
          badge={{ label: "+5.2%", positive: true }}
        >
          <MetricRow
            label="Net Sales"
            value={`₹${(summary.revenue.today / 1000).toFixed(1)}K`}
            highlight
          />
          <MetricRow
            label="Avg Order Value"
            value={`₹${Math.round(summary.revenue.today / summary.orders.total).toLocaleString()}`}
          />
        </SummaryCard>
      </View>,
      <View
        key="discounts"
        style={isScrollable ? { width: cardWidth } : { flex: 1 }}
      >
        <SummaryCard
          icon={<Percent size={18} color={ThemeColors.amber} />}
          title="Total Discounts"
          primary={`₹${(totalDiscounts / 1000).toFixed(1)}K`}
          badge={{ label: "-1.5%", positive: true }}
        >
          <MetricRow
            label="Total Refunds"
            value={`₹${(totalRefunds / 1000).toFixed(1)}K`}
          />
          <MetricRow
            label="Total Tax"
            value={`₹${(totalTax / 1000).toFixed(1)}K`}
          />
        </SummaryCard>
      </View>,
    ];

    if (isScrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: ThemeSpacing.sm,
            paddingRight: ThemeSpacing.lg,
          }}
          style={{
            marginHorizontal: -ThemeSpacing.lg,
            paddingHorizontal: ThemeSpacing.lg,
            marginBottom: ThemeSpacing.md,
          }}
        >
          {cards}
        </ScrollView>
      );
    }

    return <View style={styles.kpiGrid}>{cards}</View>;
  };

  const renderActionBar = () => (
    <View style={styles.actionBar}>
      <View style={styles.filterGroup}>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={16} color={ThemeColors.textPrimary} />
          <Text style={styles.filterText}>All Employees</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.exportGroup}>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => alert("Exporting as PDF...")}
        >
          <Download size={16} color={ThemeColors.rose} />
          <Text
            weight="semibold"
            style={[styles.filterText, { color: ThemeColors.rose }]}
          >
            PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => alert("Exporting as CSV...")}
        >
          <FileSpreadsheet size={16} color={ThemeColors.emerald} />
          <Text
            weight="semibold"
            style={[styles.filterText, { color: ThemeColors.emerald }]}
          >
            CSV
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {[
          {
            id: "transactions",
            label: "Transactions",
            icon: <Receipt size={16} />,
          },
          { id: "products", label: "By Product", icon: <Package size={16} /> },
          {
            id: "categories",
            label: "By Category",
            icon: <Package size={16} />,
          },
          { id: "discounts", label: "Discounts", icon: <Percent size={16} /> },
          { id: "refunds", label: "Refunds", icon: <AlertCircle size={16} /> },
          { id: "taxes", label: "Taxes", icon: <Banknote size={16} /> },
        ].map((tab) => {
          const isActive = activeReportTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabActive]}
              onPress={() => setActiveReportTab(tab.id)}
            >
              {React.cloneElement(tab.icon, {
                color: isActive ? ThemeColors.emerald : ThemeColors.textMuted,
              })}
              <Text
                weight={isActive ? "semibold" : "regular"}
                style={{
                  color: isActive ? ThemeColors.emerald : ThemeColors.textMuted,
                  marginLeft: 6,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderDataGrid = () => {
    if (activeReportTab === "transactions") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.tableCol, { width: 120 }]}>
              Order ID
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 180 }]}>
              Date
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 160 }]}>
              Customer
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 160 }]}>
              Employee
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 120 }]}>
              Status
            </Text>
            <Text
              weight="bold"
              style={[
                styles.tableCol,
                { flex: 1, minWidth: 120, textAlign: "right" },
              ]}
            >
              Net
            </Text>
          </View>
          {detailedSales?.map((sale, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tableRow}
              onPress={() => setSelectedTransaction(sale)}
            >
              <Text
                style={[
                  styles.tableCol,
                  { width: 120, color: ThemeColors.blue },
                ]}
              >
                {sale.id}
              </Text>

              <View
                style={[
                  styles.tableCol,
                  {
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  },
                ]}
              >
                <Clock size={12} color={ThemeColors.textMuted} />
                <Text
                  style={{ fontSize: 13, color: ThemeColors.textSecondary }}
                >
                  {sale.date}
                </Text>
              </View>

              <Text
                style={[
                  styles.tableCol,
                  { width: 160, color: ThemeColors.textSecondary },
                ]}
              >
                {sale.customer}
              </Text>

              <View style={[styles.tableCol, { width: 160 }]}>
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>{sale.employee}</Text>
                </View>
              </View>

              <View style={[styles.tableCol, { width: 120 }]}>
                <View
                  style={[
                    styles.badge,
                    sale.status === "Completed"
                      ? styles.badgeSuccess
                      : styles.badgeDanger,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      sale.status === "Completed"
                        ? styles.badgeTextSuccess
                        : styles.badgeTextDanger,
                    ]}
                  >
                    {sale.status}
                  </Text>
                </View>
              </View>

              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 120, textAlign: "right" },
                ]}
              >
                ₹{sale.net}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeReportTab === "discounts") {
      const discountedSales = detailedSales?.filter((s) => s.discount > 0);
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.tableCol, { width: 120 }]}>
              Order ID
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 180 }]}>
              Date
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 180 }]}
            >
              Reason
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 160 }]}>
              Employee
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Gross
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Discount
            </Text>
          </View>
          {discountedSales?.map((sale, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tableRow}
              onPress={() => setSelectedTransaction(sale)}
            >
              <Text
                style={[
                  styles.tableCol,
                  { width: 120, color: ThemeColors.blue },
                ]}
              >
                {sale.id}
              </Text>

              <View
                style={[
                  styles.tableCol,
                  {
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  },
                ]}
              >
                <Clock size={12} color={ThemeColors.textMuted} />
                <Text
                  style={{ fontSize: 13, color: ThemeColors.textSecondary }}
                >
                  {sale.date}
                </Text>
              </View>

              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 180, color: ThemeColors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {sale.discountReason}
              </Text>

              <View style={[styles.tableCol, { width: 160 }]}>
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>{sale.employee}</Text>
                </View>
              </View>

              <Text
                style={[styles.tableCol, { width: 120, textAlign: "right" }]}
              >
                ₹{sale.gross}
              </Text>
              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  { width: 120, textAlign: "right", color: ThemeColors.amber },
                ]}
              >
                -₹{sale.discount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeReportTab === "refunds") {
      const refundedSales = detailedSales?.filter(
        (s) => s.status === "Refunded",
      );
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.tableCol, { width: 120 }]}>
              Order ID
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 180 }]}>
              Date
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 180 }]}
            >
              Reason
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 160 }]}>
              Customer
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Refund Amt
            </Text>
          </View>
          {refundedSales?.map((sale, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tableRow}
              onPress={() => setSelectedTransaction(sale)}
            >
              <Text
                style={[
                  styles.tableCol,
                  { width: 120, color: ThemeColors.blue },
                ]}
              >
                {sale.id}
              </Text>

              <View
                style={[
                  styles.tableCol,
                  {
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  },
                ]}
              >
                <Clock size={12} color={ThemeColors.textMuted} />
                <Text
                  style={{ fontSize: 13, color: ThemeColors.textSecondary }}
                >
                  {sale.date}
                </Text>
              </View>

              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 180, color: ThemeColors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {sale.refundReason}
              </Text>

              <Text
                style={[
                  styles.tableCol,
                  { width: 160, color: ThemeColors.textSecondary },
                ]}
              >
                {sale.customer}
              </Text>

              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  { width: 120, textAlign: "right", color: ThemeColors.rose },
                ]}
              >
                ₹{sale.refundAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeReportTab === "taxes") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.tableCol, { width: 120 }]}>
              Order ID
            </Text>
            <Text weight="bold" style={[styles.tableCol, { width: 180 }]}>
              Date
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 180 }]}
            >
              Customer
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Net Sales
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Tax Collected
            </Text>
          </View>
          {detailedSales?.map((sale, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tableRow}
              onPress={() => setSelectedTransaction(sale)}
            >
              <Text
                style={[
                  styles.tableCol,
                  { width: 120, color: ThemeColors.blue },
                ]}
              >
                {sale.id}
              </Text>

              <View
                style={[
                  styles.tableCol,
                  {
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  },
                ]}
              >
                <Clock size={12} color={ThemeColors.textMuted} />
                <Text
                  style={{ fontSize: 13, color: ThemeColors.textSecondary }}
                >
                  {sale.date}
                </Text>
              </View>

              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 180, color: ThemeColors.textSecondary },
                ]}
              >
                {sale.customer}
              </Text>
              <Text
                style={[styles.tableCol, { width: 120, textAlign: "right" }]}
              >
                ₹{sale.net - sale.tax}
              </Text>
              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  { width: 120, textAlign: "right", color: ThemeColors.purple },
                ]}
              >
                +₹{sale.tax}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeReportTab === "products") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 200 }]}
            >
              Product Name
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              Qty Sold
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Revenue
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 80, textAlign: "right" }]}
            >
              Trend
            </Text>
          </View>
          {dash.topProducts?.map((product, i) => (
            <View key={i} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 200, color: ThemeColors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {product.name}
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: 120,
                    textAlign: "right",
                    color: ThemeColors.textSecondary,
                  },
                ]}
              >
                {product.qty}
              </Text>
              <Text
                weight="bold"
                style={[styles.tableCol, { width: 140, textAlign: "right" }]}
              >
                ₹{product.revenue.toLocaleString()}
              </Text>
              <View
                style={[styles.tableCol, { width: 80, alignItems: "flex-end" }]}
              >
                {product.trend === "up" ? (
                  <TrendingUp size={16} color={ThemeColors.emerald} />
                ) : (
                  <TrendingUp
                    size={16}
                    color={ThemeColors.rose}
                    style={{ transform: [{ scaleY: -1 }] }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeReportTab === "categories") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 200 }]}
            >
              Category
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 120, textAlign: "right" }]}
            >
              % of Sales
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Revenue
            </Text>
          </View>
          {dash.salesByCategory?.map((cat, i) => (
            <View key={i} style={styles.tableRow}>
              <View
                style={[
                  styles.tableCol,
                  {
                    flex: 1,
                    minWidth: 200,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  },
                ]}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: cat.color,
                  }}
                />
                <Text style={{ color: ThemeColors.textPrimary }}>
                  {cat.category}
                </Text>
              </View>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: 120,
                    textAlign: "right",
                    color: ThemeColors.textSecondary,
                  },
                ]}
              >
                {cat.percent}%
              </Text>
              <Text
                weight="bold"
                style={[styles.tableCol, { width: 140, textAlign: "right" }]}
              >
                ₹{cat.revenue.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    if (activeReportTab === "employees") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 200 }]}
            >
              Employee Name
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Transactions
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Avg Sale
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Total Revenue
            </Text>
          </View>
          {dash.employees?.topPerformers?.map((emp, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={[styles.tableCol, { flex: 1, minWidth: 200 }]}>
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>{emp.name}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: 140,
                    textAlign: "right",
                    color: ThemeColors.textSecondary,
                  },
                ]}
              >
                {emp.transactions}
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: 140,
                    textAlign: "right",
                    color: ThemeColors.textSecondary,
                  },
                ]}
              >
                ₹{emp.avgSale}
              </Text>
              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  {
                    width: 140,
                    textAlign: "right",
                    color: ThemeColors.emerald,
                  },
                ]}
              >
                ₹{emp.sales.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    if (activeReportTab === "stores") {
      return (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
              weight="bold"
              style={[styles.tableCol, { flex: 1, minWidth: 200 }]}
            >
              Store Location
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Profit
            </Text>
            <Text
              weight="bold"
              style={[styles.tableCol, { width: 140, textAlign: "right" }]}
            >
              Total Revenue
            </Text>
          </View>
          {dash.stores?.map((store, i) => (
            <View key={i} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, minWidth: 200, color: ThemeColors.textPrimary },
                ]}
              >
                {store.store}
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  {
                    width: 140,
                    textAlign: "right",
                    color: ThemeColors.textSecondary,
                  },
                ]}
              >
                ₹{store.profit.toLocaleString()}
              </Text>
              <Text
                weight="bold"
                style={[
                  styles.tableCol,
                  {
                    width: 140,
                    textAlign: "right",
                    color: ThemeColors.emerald,
                  },
                ]}
              >
                ₹{store.revenue.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  const renderTransactionModal = () => {
    if (!selectedTransaction) return null;
    const t = selectedTransaction;

    return (
      <Modal
        visible={!!selectedTransaction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={[styles.overlay, styles.overlayCenter]}>
          <View
            style={[
              styles.modalContainerCentered,
              {
                padding: isMobile ? ThemeSpacing.lg : ThemeSpacing.xxl,
                width: isMobile ? "95%" : "100%",
                maxWidth: 500,
                backgroundColor: ThemeColors.surface,
                borderRadius: ThemeRadius.xl,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ThemeSpacing.xl,
              }}
            >
              <View>
                <Text weight="bold" style={{ fontSize: 20 }}>
                  Transaction Details
                </Text>
                <Text style={{ color: ThemeColors.textMuted }}>
                  {t.id} • {t.date}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: ThemeSpacing.lg }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.modalLabel}>Customer</Text>
                  <Text style={styles.modalValue}>{t.customer}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.modalLabel}>Employee</Text>
                  <Text style={styles.modalValue}>{t.employee}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.modalLabel}>Store</Text>
                  <Text style={styles.modalValue}>{t.store}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.modalLabel}>Payment Method</Text>
                  <Text style={styles.modalValue}>{t.paymentMethod}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Gross Amount</Text>
                <Text style={styles.financialValue}>₹{t.gross}</Text>
              </View>

              {t.discount > 0 && (
                <View style={styles.financialRow}>
                  <Text style={styles.financialLabel}>
                    Discount ({t.discountReason})
                  </Text>
                  <Text
                    style={[
                      styles.financialValue,
                      { color: ThemeColors.amber },
                    ]}
                  >
                    -₹{t.discount}
                  </Text>
                </View>
              )}

              {t.tax > 0 && (
                <View style={styles.financialRow}>
                  <Text style={styles.financialLabel}>Tax</Text>
                  <Text style={styles.financialValue}>+₹{t.tax}</Text>
                </View>
              )}

              {t.refundAmount > 0 && (
                <View style={styles.financialRow}>
                  <Text style={styles.financialLabel}>
                    Refund ({t.refundReason})
                  </Text>
                  <Text
                    style={[styles.financialValue, { color: ThemeColors.rose }]}
                  >
                    -₹{t.refundAmount}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.financialRow,
                  {
                    borderTopWidth: 1,
                    borderTopColor: ThemeColors.border,
                    paddingTop: ThemeSpacing.md,
                    marginTop: ThemeSpacing.xs,
                  },
                ]}
              >
                <Text
                  weight="bold"
                  style={[
                    styles.financialLabel,
                    { fontSize: 18, color: ThemeColors.textPrimary },
                  ]}
                >
                  Net Total
                </Text>
                <Text
                  weight="bold"
                  style={[
                    styles.financialValue,
                    { fontSize: 18, color: ThemeColors.emerald },
                  ]}
                >
                  ₹{t.net}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {renderKPIs()}
      <View style={styles.reportSection}>
        {renderActionBar()}
        {renderTabs()}
        <View style={{ overflow: "hidden" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 600, width: "100%" }}>
              {renderDataGrid()}
            </View>
          </ScrollView>
        </View>
      </View>

      {renderTransactionModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: ThemeSpacing.xl,
    paddingBottom: 100,
  },
  kpiGrid: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: ThemeSpacing.md,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  filterGroup: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  exportGroup: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  filterText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  reportSection: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    backgroundColor: ThemeColors.surfaceHighlight,
  },
  tabsScroll: {
    paddingHorizontal: ThemeSpacing.md,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: ThemeColors.emerald,
  },
  tableContainer: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  tableCol: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    alignSelf: "flex-start",
  },
  badgeSuccess: {
    backgroundColor: ThemeColors.emerald + "20",
  },
  badgeDanger: {
    backgroundColor: ThemeColors.rose + "20",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextSuccess: {
    color: ThemeColors.emerald,
  },
  badgeTextDanger: {
    color: ThemeColors.rose,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainerCentered: {
    width: "90%",
    maxHeight: "90%",
  },
  modalLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.md,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  financialLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  financialValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  userBadge: {
    backgroundColor: ThemeColors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  userBadgeText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
  },
});
