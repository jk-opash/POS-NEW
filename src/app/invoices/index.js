import { InvoicesHeader } from "@/components/invoices/InvoicesHeader";
import { InvoicesListTab } from "@/components/invoices/InvoicesListTab";
import { InvoicesSummaryCards } from "@/components/invoices/InvoicesSummaryCards";
import { useResponsive } from "@/hooks/useResponsive";
import { fetchInvoices } from "@/store/slices/invoiceSlice";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function InvoicesPage() {
  const [isTodaySelected, setIsTodaySelected] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigation = useNavigation();
  const { isWebDesktop } = useResponsive();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const activeBranch =
    useSelector((state) => state.branch.activeBranch) ||
    user?.branch_id;
  const { items: invoices } = useSelector((state) => state.invoice);

  useEffect(() => {
    if (activeBranch) {
      dispatch(fetchInvoices({ branchId: activeBranch, user }));
    }
  }, [dispatch, activeBranch, user]);

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalInvoices = 0;
    let fullTotal = 0;
    let partTotal = 0;
    let splitEqualTotal = 0;
    let splitItemTotal = 0;
    let splitCustomTotal = 0;

    invoices.forEach((inv) => {
      if (inv.status !== "Paid" && inv.status !== "Pending") return;

      const invDate = new Date(inv.date);
      const now = new Date();

      if (isTodaySelected) {
        if (invDate.toDateString() !== now.toDateString()) return;
      } else {
        if (selectedMonth !== "all" && invDate.getMonth() !== selectedMonth) return;
        if (selectedYear !== "all" && invDate.getFullYear() !== selectedYear) return;
      }

      totalRevenue += inv.grandTotal;
      totalInvoices++;

      const pm = inv.paymentMethod || "Full Payment";
      if (pm.includes("Part Payment")) partTotal += inv.grandTotal;
      else if (pm.includes("Split (Equal)")) splitEqualTotal += inv.grandTotal;
      else if (pm.includes("Split (Item wise)")) splitItemTotal += inv.grandTotal;
      else if (pm.includes("Split")) splitCustomTotal += inv.grandTotal;
      else fullTotal += inv.grandTotal;
    });

    const averageValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    return {
      totalRevenue,
      totalInvoices,
      averageValue,
      fullTotal,
      partTotal,
      splitEqualTotal,
      splitItemTotal,
      splitCustomTotal,
    };
  }, [invoices, isTodaySelected, selectedMonth, selectedYear]);

  return (
    <View style={styles.root}>
      <InvoicesHeader
        isDesktop={isWebDesktop}
        navigation={navigation}
        dateString={dateString}
        isTodaySelected={isTodaySelected}
        setIsTodaySelected={setIsTodaySelected}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InvoicesSummaryCards metrics={metrics} />
        <InvoicesListTab
          invoices={invoices}
          isTodaySelected={isTodaySelected}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  scrollContent: { padding: ThemeSpacing.md },
  bottomPad: { height: 100 },
});

