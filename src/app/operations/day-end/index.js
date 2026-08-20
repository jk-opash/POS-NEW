import { CommonHeader } from "@/components/common/CommonHeader";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  CreditCard,
  DollarSign,
  Edit2,
  Printer,
  Receipt,
  ShieldAlert,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Loader } from "@/components/common/Loader";
import { fetchDashboardAnalytics } from "@/store/slices/analyticsSlice";
import { useDispatch, useSelector } from "react-redux";

const fmt = (num) => Number(num || 0).toLocaleString();

export default function DayEndPage() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDesktop, isMobile, isWebDesktop } = useResponsive();
  const [cashCount, setCashCount] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Cash Reconciliation State
  const [openingBalance, setOpeningBalance] = useState(0);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  const { stats, loading } = useSelector((state) => state.analytics);
  const auth = useSelector((state) => state.auth);
  const branchId =
    auth.user?.businesses?.[0]?.branches?.[0]?.id || auth.user?.branch_id;
  const businessId = auth.user?.businesses?.[0]?.id || auth.user?.business_id;

  useEffect(() => {
    if (branchId) {
      dispatch(
        fetchDashboardAnalytics({ branch_id: branchId, timeRange: "today" }),
      );
    } else if (businessId) {
      // Fallback to business_id if branch is not explicitly set
      dispatch(
        fetchDashboardAnalytics({
          business_id: businessId,
          timeRange: "today",
        }),
      );
    }
  }, [branchId, businessId, dispatch]);

  const SUMMARY = {
    shiftStart: "Today",
    shiftEnd: "Now",
    grossSales: stats?.totalSales || 0,
    netSales: (stats?.totalSales || 0) - (stats?.taxes || 0),
    taxCollected: stats?.taxes || 0,
    discounts: stats?.discounts || 0,
    totalOrders: stats?.numOrders || 0,
    cancelledOrders: stats?.cancelledOrders || 0,
    avgOrderValue: stats?.numOrders
      ? Math.round((stats?.totalSales || 0) / stats.numOrders)
      : 0,
    payments: {
      cash: stats?.cashCollection || 0,
      card: stats?.cardCollection || 0,
      upi: stats?.upiCollection || 0,
    },
    refunds: 0,
    pettyCash: stats?.expenseCategories || [],
    topItems: stats?.topProducts?.slice(0, 5) || [],
  };

  const totalPettyCash = SUMMARY.pettyCash.reduce(
    (acc, curr) => acc + (curr.val || 0),
    0,
  );
  const expectedCash =
    openingBalance + SUMMARY.payments.cash - SUMMARY.refunds - totalPettyCash;
  const variance = cashCount ? parseFloat(cashCount) - expectedCash : 0;

  const tenders = [
    {
      type: "Cash",
      amount: SUMMARY.payments.cash,
      icon: Coins,
      color: "#10B981",
      bg: "#D1FAE5",
    },
    {
      type: "Credit / Debit Card",
      amount: SUMMARY.payments.card,
      icon: CreditCard,
      color: "#6366F1",
      bg: "#E0E7FF",
    },
    {
      type: "UPI / Digital",
      amount: SUMMARY.payments.upi,
      icon: Wallet,
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
  ];

  if (loading && !stats) {
    return <Loader />;
  }

  const isWideLayout = isDesktop || isWebDesktop;

  return (
    <View style={styles.root}>
      <CommonHeader
        title="Day End / Shift Close"
        bottomContent={
          <View style={styles.headerBottomRow}>
            <View style={styles.shiftBar}>
              <Text weight="semibold" style={styles.shiftBarText}>
                Current Shift: {SUMMARY.shiftStart} → {SUMMARY.shiftEnd}
              </Text>
              <View style={styles.shiftLive}>
                <View style={styles.liveDot} />
                <Text weight="semibold" style={styles.liveText}>
                  LIVE
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.printBtn}>
              <Printer size={16} color={ThemeColors.white} />
              <Text weight="semibold" style={styles.printBtnText}>
                Print Z-Report
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Cards */}
        <View style={styles.sectionHeader}>
          <Text weight="bold" style={styles.sectionTitle}>
            SALES METRICS
          </Text>
        </View>
        <View style={styles.kpiGrid}>
          {[
            {
              label: "Gross Sales",
              value: `₹${fmt(SUMMARY.grossSales)}`,
              subtext: "Total billings",
              icon: DollarSign,
              color: ThemeColors.emerald,
            },
            {
              label: "Net Sales",
              value: `₹${fmt(SUMMARY.netSales)}`,
              subtext: "After taxes & disc.",
              icon: Wallet,
              color: ThemeColors.blue,
            },
            {
              label: "Tax Collected",
              value: `₹${fmt(SUMMARY.taxCollected)}`,
              subtext: "GST Liability",
              icon: Receipt,
              color: ThemeColors.amber,
            },
            {
              label: "Discounts",
              value: `₹${fmt(SUMMARY.discounts)}`,
              subtext: `${SUMMARY.cancelledOrders} void orders`,
              icon: ShieldAlert,
              color: ThemeColors.rose,
            },
          ].map((card, i) => (
            <View key={i} style={styles.kpiCard}>
              <View style={styles.kpiIconWrapper}>
                <card.icon size={20} color={card.color} />
              </View>
              <View style={styles.kpiContent}>
                <Text style={styles.kpiLabel}>{card.label}</Text>
                <Text weight="black" style={styles.kpiValue}>
                  {card.value}
                </Text>
                <Text style={styles.kpiSubtext}>{card.subtext}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Main Content Layout */}
        <View
          style={[styles.mainLayout, isWideLayout && styles.mainLayoutWide]}
        >
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            {/* Tender Breakdown */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text weight="bold" style={styles.cardTitle}>
                  TENDER / PAYMENT BREAKDOWN
                </Text>
                <View style={styles.badge}>
                  <Text weight="bold" style={styles.badgeText}>
                    Channels
                  </Text>
                </View>
              </View>

              <View style={styles.tenderList}>
                {tenders.map((tender, i) => {
                  const pct =
                    SUMMARY.grossSales > 0
                      ? Math.round((tender.amount / SUMMARY.grossSales) * 100)
                      : 0;
                  return (
                    <View key={i} style={styles.tenderRow}>
                      <View
                        style={[
                          styles.tenderIcon,
                          {
                            backgroundColor: tender.bg,
                            borderColor: tender.color,
                          },
                        ]}
                      >
                        <tender.icon size={22} color={tender.color} />
                      </View>
                      <View style={styles.tenderDetails}>
                        <View style={styles.tenderHeaderRow}>
                          <Text weight="bold" style={styles.tenderType}>
                            {tender.type}
                          </Text>
                          <Text weight="black" style={styles.tenderAmount}>
                            ₹{fmt(tender.amount)}
                          </Text>
                        </View>
                        <View style={styles.progressRow}>
                          <View style={styles.progressBarTrack}>
                            <View
                              style={[
                                styles.progressBarFill,
                                {
                                  width: `${pct}%`,
                                  backgroundColor: tender.color,
                                },
                              ]}
                            />
                          </View>
                          <Text weight="bold" style={styles.progressPct}>
                            {pct}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Top Products */}
            <View style={styles.card}>
              <Text weight="bold" style={styles.cardTitleBoxed}>
                TOP PRODUCTS SALES
              </Text>
              <View style={styles.productsList}>
                {SUMMARY.topItems.length === 0 && (
                  <Text weight="medium" style={styles.emptyText}>
                    No sales recorded for this period.
                  </Text>
                )}
                {SUMMARY.topItems.map((prod, i) => {
                  const maxRevenue =
                    SUMMARY.topItems.length > 0
                      ? SUMMARY.topItems[0].revenue
                      : 0;
                  const pct =
                    SUMMARY.grossSales > 0
                      ? Math.round((prod.revenue / SUMMARY.grossSales) * 100)
                      : 0;
                  const barWidth =
                    maxRevenue > 0
                      ? Math.round((prod.revenue / maxRevenue) * 100)
                      : 0;
                  const colors = [
                    ThemeColors.primary,
                    ThemeColors.emerald,
                    ThemeColors.violet,
                    ThemeColors.amber,
                    ThemeColors.rose,
                  ];
                  const color = colors[i % colors.length];

                  return (
                    <View key={i} style={styles.productRow}>
                      <View style={styles.productHeaderRow}>
                        <Text weight="bold" style={styles.productName}>
                          {i + 1}. {prod.name}
                        </Text>
                        <View style={styles.productMetrics}>
                          <Text weight="black" style={styles.productRevenue}>
                            ₹{fmt(prod.revenue)}
                          </Text>
                          <Text weight="bold" style={styles.productPct}>
                            ({pct}%)
                          </Text>
                        </View>
                      </View>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${barWidth}%`, backgroundColor: color },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            {/* Cash Reconciliation */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text weight="bold" style={styles.cardTitle}>
                  CASH RECONCILIATION
                </Text>
                <View style={[styles.badge, styles.badgeLive]}>
                  <Text
                    weight="bold"
                    style={[styles.badgeText, styles.badgeTextLive]}
                  >
                    Live
                  </Text>
                </View>
              </View>

              <View style={styles.reconList}>
                <View style={styles.reconRow}>
                  <View style={styles.reconLabelGroup}>
                    <Text weight="medium" style={styles.reconLabel}>
                      Opening Balance
                    </Text>
                    {!isEditingBalance && (
                      <TouchableOpacity
                        onPress={() => {
                          setBalanceInput(openingBalance.toString());
                          setIsEditingBalance(true);
                        }}
                      >
                        <Edit2 size={14} color={ThemeColors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {isEditingBalance ? (
                    <View style={styles.editBalanceGroup}>
                      <Text weight="medium" style={styles.currencySymbol}>
                        ₹
                      </Text>
                      <TextInput
                        style={styles.balanceInput}
                        value={balanceInput}
                        onChangeText={setBalanceInput}
                        keyboardType="numeric"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.saveBalanceBtn}
                        onPress={() => {
                          setOpeningBalance(Number(balanceInput) || 0);
                          setIsEditingBalance(false);
                        }}
                      >
                        <Text weight="medium" style={styles.saveBalanceText}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text weight="bold" style={styles.reconValue}>
                      ₹{fmt(openingBalance)}
                    </Text>
                  )}
                </View>

                <View style={styles.reconRow}>
                  <View style={styles.reconLabelGroup}>
                    <ArrowUpRight size={16} color={ThemeColors.emerald} />
                    <Text
                      weight="medium"
                      style={[
                        styles.reconLabel,
                        { color: ThemeColors.emerald },
                      ]}
                    >
                      Cash Sales
                    </Text>
                  </View>
                  <Text
                    weight="bold"
                    style={[styles.reconValue, { color: ThemeColors.emerald }]}
                  >
                    +₹{fmt(SUMMARY.payments.cash)}
                  </Text>
                </View>

                <View style={styles.pettyCashGroup}>
                  <View style={styles.reconLabelGroup}>
                    <ArrowDownRight size={14} color={ThemeColors.rose} />
                    <Text
                      weight="bold"
                      style={[
                        styles.reconLabel,
                        { fontSize: 12, color: ThemeColors.textMuted },
                      ]}
                    >
                      Petty Cash Payouts
                    </Text>
                  </View>
                  {SUMMARY.pettyCash.length === 0 && (
                    <Text style={styles.emptyPettyCash}>
                      No expenses recorded
                    </Text>
                  )}
                  {SUMMARY.pettyCash.map((pc, i) => (
                    <View key={i} style={styles.pettyCashItem}>
                      <Text style={styles.pettyCashLabel}>- {pc.label}</Text>
                      <Text style={styles.pettyCashValue}>-₹{fmt(pc.val)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.expectedCashBox}>
                <Text weight="bold" style={styles.expectedCashLabel}>
                  EXPECTED DRAWER CASH
                </Text>
                <Text weight="black" style={styles.expectedCashValue}>
                  ₹{fmt(expectedCash)}
                </Text>
              </View>
            </View>

            {/* Key Order Metrics */}
            <View style={styles.card}>
              <Text weight="bold" style={styles.cardTitleBoxed}>
                KEY ORDER METRICS
              </Text>
              <View style={styles.metricsList}>
                <View style={styles.metricRow}>
                  <Text weight="semibold" style={styles.metricLabel}>
                    Total Orders
                  </Text>
                  <Text weight="black" style={styles.metricValue}>
                    {SUMMARY.totalOrders}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text weight="semibold" style={styles.metricLabel}>
                    Cancelled / Voided
                  </Text>
                  <Text
                    weight="black"
                    style={[styles.metricValue, { color: ThemeColors.rose }]}
                  >
                    {SUMMARY.cancelledOrders}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text weight="semibold" style={styles.metricLabel}>
                    Average Order Value
                  </Text>
                  <Text weight="black" style={styles.metricValue}>
                    ₹{fmt(SUMMARY.avgOrderValue)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  headerBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
  },
  shiftBar: { flexDirection: "row", alignItems: "center", gap: 12 },
  shiftBarText: { fontSize: 13, color: ThemeColors.textSecondary },
  shiftLive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.emeraldDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThemeColors.emerald,
  },
  liveText: { fontSize: 10, color: ThemeColors.emerald, letterSpacing: 1 },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  printBtnText: { color: ThemeColors.white, fontSize: 13 },

  content: { padding: ThemeSpacing.lg },

  sectionHeader: { marginBottom: ThemeSpacing.md },
  sectionTitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    letterSpacing: 1,
  },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.xl,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ThemeSpacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  kpiContent: { flex: 1, gap: 2 },
  kpiLabel: { fontSize: 12, color: ThemeColors.textSecondary },
  kpiValue: { fontSize: 20, color: ThemeColors.textPrimary },
  kpiSubtext: { fontSize: 11, color: ThemeColors.textMuted },

  mainLayout: { flexDirection: "column", gap: ThemeSpacing.lg },
  mainLayoutWide: { flexDirection: "row" },
  leftColumn: { flex: 2, gap: ThemeSpacing.lg },
  rightColumn: { flex: 1, gap: ThemeSpacing.lg },

  card: {
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    marginBottom: ThemeSpacing.md,
  },
  cardTitle: { fontSize: 12, color: ThemeColors.textPrimary, letterSpacing: 1 },
  cardTitleBoxed: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
    letterSpacing: 1,
    marginBottom: ThemeSpacing.lg,
  },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  badgeText: { fontSize: 10, color: "#475569" },
  badgeLive: {
    backgroundColor: ThemeColors.emeraldDim,
    borderColor: "#A7F3D0",
  },
  badgeTextLive: { color: ThemeColors.emerald },

  tenderList: { gap: ThemeSpacing.lg },
  tenderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  tenderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  tenderDetails: { flex: 1, gap: 6 },
  tenderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tenderType: { fontSize: 14, color: ThemeColors.textPrimary },
  tenderAmount: { fontSize: 14, color: ThemeColors.textPrimary },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressPct: {
    width: 32,
    textAlign: "right",
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },

  productsList: { gap: ThemeSpacing.lg },
  emptyText: { fontSize: 14, color: ThemeColors.textMuted },
  productRow: { gap: 6 },
  productHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: { fontSize: 13, color: ThemeColors.textPrimary },
  productMetrics: { flexDirection: "row", alignItems: "center", gap: 6 },
  productRevenue: { fontSize: 14, color: ThemeColors.textPrimary },
  productPct: { fontSize: 12, color: ThemeColors.textMuted },

  reconList: { gap: ThemeSpacing.md },
  reconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reconLabelGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  reconLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  reconValue: { fontSize: 14, color: ThemeColors.textPrimary },
  editBalanceGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  currencySymbol: { fontSize: 14, color: ThemeColors.textPrimary },
  balanceInput: {
    width: 80,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "bold",
  },
  saveBalanceBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveBalanceText: { color: ThemeColors.white, fontSize: 12 },

  pettyCashGroup: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    paddingTop: 10,
    marginTop: 4,
    gap: 6,
  },
  emptyPettyCash: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    marginLeft: 20,
  },
  pettyCashItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
  },
  pettyCashLabel: { fontSize: 12, color: ThemeColors.rose },
  pettyCashValue: { fontSize: 12, color: ThemeColors.rose },

  expectedCashBox: {
    marginTop: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  expectedCashLabel: {
    fontSize: 10,
    color: ThemeColors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  expectedCashValue: { fontSize: 28, color: ThemeColors.textPrimary },

  metricsList: { gap: 12 },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  metricLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  metricValue: { fontSize: 16, color: ThemeColors.textPrimary },

  actualCashGroup: { gap: 8, marginBottom: ThemeSpacing.lg },
  actualCashLabel: { fontSize: 14, color: ThemeColors.textPrimary },
  actualCashInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  currencySymbolLarge: { fontSize: 24, color: ThemeColors.textSecondary },
  actualCashInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    color: ThemeColors.textPrimary,
    fontWeight: "bold",
  },

  varianceAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    marginBottom: ThemeSpacing.lg,
  },
  varianceText: { fontSize: 14 },

  closeShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.primary,
    paddingVertical: 16,
    borderRadius: ThemeRadius.lg,
  },
  closeShiftBtnText: { color: ThemeColors.white, fontSize: 16 },
});
