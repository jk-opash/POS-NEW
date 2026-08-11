import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { createExpense, fetchExpenses } from "@/store/slices/expenseSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Menu, Wallet, Bell, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ExpensesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isMobile, isWebDesktop } = useResponsive();

  const { expenses, isLoading } = useSelector((state) => state.expense);
  const activeBranch =
    useSelector((state) => state.branch.activeBranch) ||
    useSelector((state) => state.auth.user?.branch_id);

  useEffect(() => {
    if (activeBranch) {
      dispatch(fetchExpenses(activeBranch));
    }
  }, [dispatch, activeBranch]);

  const handleAddExpense = async (data) => {
    if (!activeBranch) return;
    await dispatch(
      createExpense({
        branch_id: activeBranch,
        ...data,
      }),
    );
    setModalVisible(false);
    // Refresh list just in case
    dispatch(fetchExpenses(activeBranch));
  };

  const renderExpenseItem = ({ item }) => {
    const dateStr = new Date(item.expense_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseIconWrap}>
          <Wallet size={20} color={ThemeColors.primary} />
        </View>
        <View style={styles.expenseInfo}>
          <Text weight="semibold" style={styles.expenseCategory}>
            {item.category}
          </Text>
          <Text style={styles.expenseDesc} numberOfLines={1}>
            {item.description || "No description"}
          </Text>
          <Text style={styles.expenseDate}>{dateStr}</Text>
        </View>
        <Text weight="bold" style={styles.expenseAmount}>
          ${Number(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Expenses</Text>
          </View>
          <View style={styles.headerRight}>
            <HeaderQuickNav />
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={18} color={ThemeColors.white} />
              <Text weight="semibold" style={styles.addBtnText}>
                Add Expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {isLoading && expenses.length === 0 ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={ThemeColors.primary} />
          </View>
        ) : expenses.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Wallet
              size={48}
              color={ThemeColors.textMuted}
              style={{ marginBottom: 16 }}
            />
            <Text weight="semibold" style={styles.emptyTitle}>
              No Expenses Yet
            </Text>
            <Text style={styles.emptyDesc}>
              Keep track of your business spending by adding your first expense.
            </Text>
            <TouchableOpacity
              style={styles.addFirstBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text weight="medium" style={styles.addFirstBtnText}>
                Add First Expense
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderExpenseItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddExpense}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.surface },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: { padding: ThemeSpacing.xs },
  pageTitle: { fontSize: 26, color: ThemeColors.textPrimary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    gap: 6,
  },
  addBtnText: { color: ThemeColors.white, fontSize: 14 },
  body: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  emptyDesc: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: ThemeSpacing.lg,
  },
  addFirstBtn: {
    borderWidth: 1,
    borderColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
  },
  addFirstBtnText: {
    color: ThemeColors.primary,
  },
  listContent: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  expenseIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ThemeColors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: ThemeSpacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  expenseDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  expenseAmount: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
});
