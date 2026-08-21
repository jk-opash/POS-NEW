import { CommonHeader } from "@/components/common/CommonHeader";
import { Loader } from "@/components/common/Loader";
import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { UtilityModal } from "@/components/expenses/UtilityModal";
import { WithdrawalModal } from "@/components/expenses/WithdrawalModal";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { createExpense, fetchExpenses } from "@/store/slices/expenseSlice";
import { fetchTeamMembers } from "@/store/slices/teamMemberSlice";
import {
  createUtilityBill,
  fetchUtilityBills,
} from "@/store/slices/utilityBillSlice";
import {
  createWithdrawal,
  fetchWithdrawals,
} from "@/store/slices/withdrawalSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  AlertTriangle,
  ArrowDownToLine,
  ChevronDown,
  ClipboardList,
  DollarSign,
  FileText,
  Package,
  Plus,
  Settings2,
  Wallet,
  X,
  Zap,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const TABS = [
  { key: "all", label: "All Transactions" },
  { key: "expenses", label: "Expenses" },
  { key: "utility", label: "Utility Bills" },
  { key: "withdrawals", label: "Withdrawals" },
];

function formatDateTime(date) {
  if (!date || isNaN(new Date(date).getTime())) return "-";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [utilityModalVisible, setUtilityModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [actionPickerVisible, setActionPickerVisible] = useState(false);

  const dispatch = useDispatch();
  const { isDesktop, isMobile } = useResponsive();

  const { expenses = [], isLoading: expensesLoading } = useSelector(
    (state) => state.expense,
  );
  const { bills: utilityBills = [], isLoading: utilityLoading } = useSelector(
    (state) => state.utilityBill,
  );
  const { withdrawals = [], isLoading: withdrawalsLoading } = useSelector(
    (state) => state.withdrawal,
  );
  const { items: teamMembers } = useSelector((state) => state.teamMember);

  const user = useSelector((state) => state.auth.user);
  const activeBranch =
    useSelector((state) => state.branch.activeBranch) || user?.branch_id;
  const businessId = user?.business_id;

  const isLoading = expensesLoading || utilityLoading || withdrawalsLoading;

  useEffect(() => {
    if (activeBranch) {
      dispatch(fetchExpenses(activeBranch));
      dispatch(fetchUtilityBills(activeBranch));
      dispatch(fetchWithdrawals(activeBranch));
    }
    if (businessId) {
      dispatch(fetchTeamMembers(businessId));
    }
  }, [dispatch, activeBranch, businessId]);

  const handleAddExpense = async (data) => {
    if (!activeBranch) return;
    await dispatch(
      createExpense({
        branch_id: activeBranch,
        ...data,
      }),
    );
    setExpenseModalVisible(false);
    dispatch(fetchExpenses(activeBranch));
  };

  const handleAddUtility = async (data) => {
    if (!activeBranch) return;
    await dispatch(
      createUtilityBill({
        branch_id: activeBranch,
        ...data,
      }),
    );
    setUtilityModalVisible(false);
    dispatch(fetchUtilityBills(activeBranch));
  };

  const handleAddWithdrawal = async (data) => {
    if (!activeBranch) return;
    await dispatch(
      createWithdrawal({
        branch_id: activeBranch,
        ...data,
      }),
    );
    setWithdrawalModalVisible(false);
    dispatch(fetchWithdrawals(activeBranch));
  };

  const combinedData = useMemo(() => {
    const arr = [];
    if (expenses) {
      expenses.forEach((e) =>
        arr.push({
          ...e,
          _type: "Expense",
          _date: new Date(e.expense_date || e.created_at),
          _ref: e.id ? e.id.slice(0, 13) : `EXP-${Math.random().toString(36).substring(2, 8)}`,
          _category: e.category || "Expense",
          _reason: e.description || "General expense",
          _amount: Number(e.amount) || 0,
          _performedBy: "System",
        }),
      );
    }
    if (utilityBills) {
      utilityBills.forEach((u) =>
        arr.push({
          ...u,
          _type: "Utility",
          _date: new Date(u.created_at || u.bill_date),
          _ref: u.id ? u.id.slice(0, 13) : `UTL-${Math.random().toString(36).substring(2, 8)}`,
          _category: u.utility_type ? `${u.utility_type}${u.vendor ? ` - ${u.vendor}` : ""}` : "Utility Bill",
          _reason: u.invoice_number ? `Invoice: ${u.invoice_number}` : (u.vendor || "Monthly bill payment"),
          _amount: Number(u.amount) || 0,
          _performedBy: "System",
        }),
      );
    }
    if (withdrawals) {
      withdrawals.forEach((w) => {
        const teamMember = teamMembers?.find((m) => m.id === w.withdrawn_by);
        const name = teamMember
          ? `${teamMember.first_name} ${teamMember.last_name || ""}`.trim()
          : "System";
        arr.push({
          ...w,
          _type: "Withdrawal",
          _date: new Date(w.withdrawal_date || w.created_at),
          _ref: w.id ? w.id.slice(0, 13) : `WDR-${Math.random().toString(36).substring(2, 8)}`,
          _category: "Cash Withdrawal",
          _reason: w.reason || w.description || "Cash drawer payout",
          _amount: Number(w.amount) || 0,
          _performedBy: name,
        });
      });
    }
    return arr.sort((a, b) => b._date - a._date);
  }, [expenses, utilityBills, withdrawals, teamMembers]);

  // Metrics calculation
  const totalExpenseAmount = useMemo(
    () => (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [expenses],
  );
  const totalUtilityAmount = useMemo(
    () => (utilityBills || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [utilityBills],
  );
  const totalWithdrawalAmount = useMemo(
    () => (withdrawals || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [withdrawals],
  );
  const totalOutflow = totalExpenseAmount + totalUtilityAmount + totalWithdrawalAmount;

  const filteredData = useMemo(() => {
    if (activeTab === "expenses") {
      return combinedData.filter((i) => i._type === "Expense");
    }
    if (activeTab === "utility") {
      return combinedData.filter((i) => i._type === "Utility");
    }
    if (activeTab === "withdrawals") {
      return combinedData.filter((i) => i._type === "Withdrawal");
    }
    return combinedData;
  }, [combinedData, activeTab]);

  const handleFabPress = () => {
    if (activeTab === "expenses") {
      setExpenseModalVisible(true);
    } else if (activeTab === "utility") {
      setUtilityModalVisible(true);
    } else if (activeTab === "withdrawals") {
      setWithdrawalModalVisible(true);
    } else {
      setActionPickerVisible(true);
    }
  };

  const renderSummaryCards = () => {
    const cards = [
      <SummaryCard
        key="total-stock"
        title="Total Outflow"
        primary={`₹${(totalOutflow / 1000).toFixed(1)}K`}
        icon={<Package size={18} color={ThemeColors.blue} />}
        badge={{ label: "+5.2%", positive: true }}
      >
        <MetricRow label="Total Transactions" value={String(combinedData.length)} />
      </SummaryCard>,

      <SummaryCard
        key="expenses"
        title="Direct Expenses"
        primary={`₹${(totalExpenseAmount / 1000).toFixed(1)}K`}
        icon={<AlertTriangle size={18} color={ThemeColors.amber} />}
        badge={{ label: `${expenses.length} Records`, positive: true }}
      >
        <MetricRow label="Daily Operations" value="Recorded" />
      </SummaryCard>,

      <SummaryCard
        key="utility"
        title="Utility Bills"
        primary={`₹${(totalUtilityAmount / 1000).toFixed(1)}K`}
        icon={<Settings2 size={18} color={ThemeColors.red} />}
      >
        <MetricRow
          label="Total Bills"
          value={String(utilityBills.length)}
          highlight={false}
          arrow="down"
        />
      </SummaryCard>,

      <SummaryCard
        key="withdrawals"
        title="Cash Withdrawals"
        primary={`₹${(totalWithdrawalAmount / 1000).toFixed(1)}K`}
        icon={<ClipboardList size={18} color={ThemeColors.purple} />}
      >
        <MetricRow label="Drawer Payouts" value={String(withdrawals.length)} />
      </SummaryCard>,
    ];

    const isScrollable = !isDesktop;
    const cardWidth = isMobile ? 280 : 320;

    const wrappedCards = cards.map((card, idx) => (
      <View key={idx} style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        {card}
      </View>
    ));

    if (isScrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: ThemeSpacing.sm, paddingRight: ThemeSpacing.xl }}
          style={{
            flexGrow: 0,
            marginHorizontal: -ThemeSpacing.xl,
            paddingHorizontal: ThemeSpacing.xl,
            marginBottom: ThemeSpacing.md,
          }}
        >
          {wrappedCards}
        </ScrollView>
      );
    }

    return <View style={styles.cardsRow}>{wrappedCards}</View>;
  };

  const renderTransactionRow = (item, index) => {
    return (
      <View key={item._ref || index} style={styles.tableRow}>
        <Text
          style={[styles.col, { width: 160, color: ThemeColors.blue }]}
          numberOfLines={1}
        >
          {item._ref}
        </Text>
        <Text
          style={[styles.col, { width: 190, color: ThemeColors.textMuted }]}
        >
          {formatDateTime(item._date)}
        </Text>
        <Text
          weight="semibold"
          style={[styles.col, { width: 220, color: ThemeColors.textPrimary }]}
          numberOfLines={1}
        >
          {item._category}
        </Text>
        <Text
          style={[
            styles.col,
            {
              flex: 1,
              minWidth: 200,
              color: ThemeColors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {item._reason || "-"}
        </Text>
        <Text
          weight="bold"
          style={[
            styles.col,
            {
              width: 140,
              textAlign: "right",
              color: ThemeColors.rose,
            },
          ]}
        >
          -₹{Number(item._amount).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.col,
            {
              width: 140,
              textAlign: "right",
              color: ThemeColors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {item._performedBy || "System"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <CommonHeader
        title="Expenses"
        bottomContent={
          <View style={styles.toolbarRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabs}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
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
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        }
      />

      <View style={styles.contentContainer}>
        {renderSummaryCards()}

        <View style={styles.tableCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tableScrollView}
          >
            <View style={{ minWidth: 1050, width: "100%" }}>
              <View style={styles.tableHeader}>
                <Text weight="bold" style={[styles.headerCol, { width: 160 }]}>
                  Reference
                </Text>
                <Text weight="bold" style={[styles.headerCol, { width: 190 }]}>
                  Date
                </Text>
                <Text weight="bold" style={[styles.headerCol, { width: 220 }]}>
                  Category
                </Text>
                <Text
                  weight="bold"
                  style={[styles.headerCol, { flex: 1, minWidth: 200 }]}
                >
                  Reason / Details
                </Text>
                <Text
                  weight="bold"
                  style={[styles.headerCol, { width: 140, textAlign: "right" }]}
                >
                  Amount
                </Text>
                <Text
                  weight="bold"
                  style={[styles.headerCol, { width: 140, textAlign: "right" }]}
                >
                  Performed By
                </Text>
              </View>

              {isLoading ? (
                <View style={{ padding: 60, alignItems: "center" }}>
                  <Loader text="Loading transactions..." />
                </View>
              ) : filteredData.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <FileText
                    size={48}
                    color={ThemeColors.textMuted}
                    style={{ marginBottom: 16 }}
                  />
                  <Text weight="semibold" style={styles.emptyTitle}>
                    No Transactions Found
                  </Text>
                  <Text style={styles.emptyDesc}>
                    There are no recorded transactions for the selected category.
                  </Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredData.map((item, index) =>
                    renderTransactionRow(item, index),
                  )}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={handleFabPress}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>
          {activeTab === "expenses"
            ? "Add Expense"
            : activeTab === "utility"
              ? "Add Utility Bill"
              : activeTab === "withdrawals"
                ? "Cash Withdrawal"
                : "Add Entry"}
        </Text>
      </TouchableOpacity>

      {/* Quick Action Picker Modal */}
      <Modal
        visible={actionPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionPickerVisible(false)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text weight="bold" style={styles.pickerTitle}>
                Select Outflow Type
              </Text>
              <TouchableOpacity
                onPress={() => setActionPickerVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => {
                setActionPickerVisible(false);
                setExpenseModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.pickerIconWrap,
                  { backgroundColor: ThemeColors.primary + "15" },
                ]}
              >
                <Wallet size={22} color={ThemeColors.primary} />
              </View>
              <View style={styles.pickerOptionTextWrap}>
                <Text weight="semibold" style={styles.pickerOptionTitle}>
                  Add Direct Expense
                </Text>
                <Text style={styles.pickerOptionSub}>
                  Record daily operational spending
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => {
                setActionPickerVisible(false);
                setUtilityModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.pickerIconWrap,
                  { backgroundColor: ThemeColors.warning + "15" },
                ]}
              >
                <Zap size={22} color={ThemeColors.warning} />
              </View>
              <View style={styles.pickerOptionTextWrap}>
                <Text weight="semibold" style={styles.pickerOptionTitle}>
                  Add Utility Bill
                </Text>
                <Text style={styles.pickerOptionSub}>
                  Electricity, water, internet, etc.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => {
                setActionPickerVisible(false);
                setWithdrawalModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.pickerIconWrap,
                  { backgroundColor: ThemeColors.rose + "15" },
                ]}
              >
                <ArrowDownToLine size={22} color={ThemeColors.rose} />
              </View>
              <View style={styles.pickerOptionTextWrap}>
                <Text weight="semibold" style={styles.pickerOptionTitle}>
                  Cash Withdrawal
                </Text>
                <Text style={styles.pickerOptionSub}>
                  Record cash taken from drawer
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sub Modals */}
      <ExpenseModal
        visible={expenseModalVisible}
        onClose={() => setExpenseModalVisible(false)}
        onSubmit={handleAddExpense}
        isLoading={expensesLoading}
      />
      <UtilityModal
        visible={utilityModalVisible}
        onClose={() => setUtilityModalVisible(false)}
        onSubmit={handleAddUtility}
        isLoading={utilityLoading}
      />
      <WithdrawalModal
        visible={withdrawalModalVisible}
        onClose={() => setWithdrawalModalVisible(false)}
        onSubmit={handleAddWithdrawal}
        isLoading={withdrawalsLoading}
        teamMembers={teamMembers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.background,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: ThemeSpacing.xxl,
    paddingTop: ThemeSpacing.md,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
  tableCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
    marginBottom: ThemeSpacing.xl,
  },
  tableScrollView: {
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
  headerCol: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
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
  emptyWrap: {
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  emptyDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  fab: {
    position: "absolute",
    right: ThemeSpacing.xl,
    bottom: ThemeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: 100,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  pickerCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    padding: ThemeSpacing.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.xs,
  },
  pickerTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surfaceElevated,
    gap: ThemeSpacing.md,
  },
  pickerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: ThemeRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerOptionTextWrap: {
    flex: 1,
  },
  pickerOptionTitle: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  pickerOptionSub: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
});
