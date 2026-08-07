import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { AlertCircle, Check, DollarSign, IndianRupee, Menu, Moon, Printer } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SHIFT_SUMMARY = {
  shiftStart: "11:00 AM",
  shiftEnd: "Now",
  openingCash: 5000,
  totalSales: 42800,
  totalOrders: 67,
  avgOrderValue: 639,
  payments: { cash: 18200, card: 12600, upi: 10500, wallet: 1500 },
  taxes: { cgst: 1020, sgst: 1020, total: 2040 },
  discounts: 3200,
  refunds: 800,
  tips: 1450,
  orderTypes: { dineIn: 35, takeaway: 18, delivery: 8, online: 6 },
  topItems: [
    { name: "Butter Chicken", qty: 14, revenue: 4900 },
    { name: "Paneer Butter Masala", qty: 12, revenue: 3600 },
    { name: "Chicken Biryani", qty: 11, revenue: 3850 },
    { name: "Garlic Naan", qty: 28, revenue: 2240 },
    { name: "Masala Dosa", qty: 9, revenue: 1350 },
  ],
};

export default function DayEndPage() {
  const navigation = useNavigation();
  const { isDesktop, isMobile, isWebDesktop } = useResponsive();
  const [cashCount, setCashCount] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const expectedCash = SHIFT_SUMMARY.openingCash + SHIFT_SUMMARY.payments.cash - SHIFT_SUMMARY.refunds;
  const variance = cashCount ? parseFloat(cashCount) - expectedCash : 0;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Moon size={22} color={ThemeColors.accent} />
            <Text weight="bold" style={styles.pageTitle}>Day End / Shift Close</Text>
          </View>
          <TouchableOpacity style={styles.printBtn}>
            <Printer size={16} color={ThemeColors.accent} />
            <Text weight="semibold" style={styles.printBtnText}>Print Summary</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shiftBar}>
          <Text weight="semibold" style={styles.shiftBarText}>
            Current Shift: {SHIFT_SUMMARY.shiftStart} → {SHIFT_SUMMARY.shiftEnd}
          </Text>
          <View style={styles.shiftLive}>
            <View style={styles.liveDot} />
            <Text weight="semibold" style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          {[
            { label: "Total Sales", value: `₹${SHIFT_SUMMARY.totalSales.toLocaleString()}`, color: ThemeColors.emerald, bg: ThemeColors.emeraldDim },
            { label: "Total Orders", value: SHIFT_SUMMARY.totalOrders, color: ThemeColors.blue, bg: ThemeColors.blueDim },
            { label: "Avg Order Value", value: `₹${SHIFT_SUMMARY.avgOrderValue}`, color: ThemeColors.violet, bg: ThemeColors.violetDim },
            { label: "Total Discounts", value: `₹${SHIFT_SUMMARY.discounts}`, color: ThemeColors.amber, bg: ThemeColors.amberDim },
          ].map((card, i) => (
            <View key={i} style={[styles.summaryCard, { borderLeftColor: card.color }]}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text weight="bold" style={[styles.summaryValue, { color: card.color }]}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text weight="bold" style={styles.sectionTitle}>PAYMENT BREAKDOWN</Text>
          <View style={styles.paymentGrid}>
            {Object.entries(SHIFT_SUMMARY.payments).map(([mode, amount]) => (
              <View key={mode} style={styles.paymentRow}>
                <Text weight="medium" style={styles.paymentMode}>{mode.toUpperCase()}</Text>
                <Text weight="semibold" style={styles.paymentAmount}>₹{amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text weight="bold" style={styles.sectionTitle}>GST SUMMARY</Text>
          <View style={styles.taxGrid}>
            <View style={styles.taxRow}><Text style={styles.taxLabel}>CGST</Text><Text weight="semibold" style={styles.taxValue}>₹{SHIFT_SUMMARY.taxes.cgst}</Text></View>
            <View style={styles.taxRow}><Text style={styles.taxLabel}>SGST</Text><Text weight="semibold" style={styles.taxValue}>₹{SHIFT_SUMMARY.taxes.sgst}</Text></View>
            <View style={[styles.taxRow, styles.taxTotal]}><Text weight="bold" style={styles.taxLabel}>Total GST</Text><Text weight="bold" style={styles.taxValue}>₹{SHIFT_SUMMARY.taxes.total}</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text weight="bold" style={styles.sectionTitle}>ORDER TYPES</Text>
          <View style={styles.orderTypesRow}>
            {Object.entries(SHIFT_SUMMARY.orderTypes).map(([type, count]) => (
              <View key={type} style={styles.orderTypeBox}>
                <Text weight="bold" style={styles.orderTypeCount}>{count}</Text>
                <Text style={styles.orderTypeLabel}>{type.replace(/([A-Z])/g, ' $1').trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text weight="bold" style={styles.sectionTitle}>TOP SELLING ITEMS</Text>
          {SHIFT_SUMMARY.topItems.map((item, i) => (
            <View key={i} style={styles.topItemRow}>
              <View style={styles.topItemRank}><Text weight="bold" style={styles.topItemRankText}>#{i + 1}</Text></View>
              <Text weight="medium" style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemQty}>{item.qty} sold</Text>
              <Text weight="semibold" style={styles.topItemRevenue}>₹{item.revenue}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reconciliation}>
          <Text weight="bold" style={styles.sectionTitle}>CASH RECONCILIATION</Text>
          <View style={styles.reconRow}><Text style={styles.reconLabel}>Opening Cash</Text><Text weight="semibold" style={styles.reconValue}>₹{SHIFT_SUMMARY.openingCash}</Text></View>
          <View style={styles.reconRow}><Text style={styles.reconLabel}>Cash Sales</Text><Text weight="semibold" style={styles.reconValue}>+₹{SHIFT_SUMMARY.payments.cash}</Text></View>
          <View style={styles.reconRow}><Text style={styles.reconLabel}>Refunds (Cash)</Text><Text weight="semibold" style={[styles.reconValue, { color: ThemeColors.red }]}>-₹{SHIFT_SUMMARY.refunds}</Text></View>
          <View style={[styles.reconRow, { borderTopWidth: 2, borderTopColor: ThemeColors.border, paddingTop: 12, marginTop: 8 }]}>
            <Text weight="bold" style={styles.reconLabel}>Expected Cash</Text>
            <Text weight="bold" style={styles.reconValue}>₹{expectedCash.toLocaleString()}</Text>
          </View>
          <View style={styles.cashCountRow}>
            <Text weight="semibold" style={styles.cashCountLabel}>Actual Cash Count:</Text>
            <TextInput
              style={styles.cashCountInput}
              value={cashCount}
              onChangeText={setCashCount}
              placeholder="Enter amount"
              keyboardType="numeric"
              placeholderTextColor={ThemeColors.textMuted}
            />
          </View>
          {cashCount !== "" && (
            <View style={[styles.varianceBox, { backgroundColor: variance === 0 ? ThemeColors.emeraldDim : variance > 0 ? ThemeColors.blueDim : ThemeColors.redDim }]}>
              {variance === 0 ? <Check size={16} color={ThemeColors.emerald} /> : <AlertCircle size={16} color={variance > 0 ? ThemeColors.blue : ThemeColors.red} />}
              <Text weight="semibold" style={{ color: variance === 0 ? ThemeColors.emerald : variance > 0 ? ThemeColors.blue : ThemeColors.red, fontSize: 14 }}>
                {variance === 0 ? "Perfect! No variance" : `Variance: ${variance > 0 ? "+" : ""}₹${variance.toFixed(0)}`}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.closeShiftBtn} onPress={() => setIsClosing(true)}>
          <Moon size={18} color={ThemeColors.white} />
          <Text weight="bold" style={styles.closeShiftBtnText}>Close Shift & Generate Report</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  headerSafe: { backgroundColor: ThemeColors.surface, borderBottomWidth: 1, borderBottomColor: ThemeColors.border },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: ThemeSpacing.xxl, paddingVertical: ThemeSpacing.md },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md },
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 22, color: ThemeColors.textPrimary },
  printBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: ThemeColors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: ThemeRadius.md },
  printBtnText: { color: ThemeColors.accent, fontSize: 13 },
  content: { padding: ThemeSpacing.lg },
  shiftBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: ThemeColors.primary, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.lg },
  shiftBarText: { fontSize: 14, color: ThemeColors.white },
  shiftLive: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ThemeColors.emerald },
  liveText: { fontSize: 12, color: ThemeColors.emerald, letterSpacing: 1 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: ThemeSpacing.md, marginBottom: ThemeSpacing.xl },
  summaryCard: { flex: 1, minWidth: 140, backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, borderLeftWidth: 4, gap: 4, borderWidth: 1, borderColor: ThemeColors.border },
  summaryLabel: { fontSize: 12, color: ThemeColors.textMuted },
  summaryValue: { fontSize: 22 },
  section: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.lg, borderWidth: 1, borderColor: ThemeColors.border },
  sectionTitle: { fontSize: 12, color: ThemeColors.textMuted, letterSpacing: 1, marginBottom: ThemeSpacing.md },
  paymentGrid: { gap: 8 },
  paymentRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: ThemeColors.borderSubtle },
  paymentMode: { fontSize: 14, color: ThemeColors.textSecondary },
  paymentAmount: { fontSize: 14, color: ThemeColors.textPrimary },
  taxGrid: { gap: 8 },
  taxRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  taxLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  taxValue: { fontSize: 14, color: ThemeColors.textPrimary },
  taxTotal: { borderTopWidth: 1, borderTopColor: ThemeColors.border, paddingTop: 8, marginTop: 4 },
  orderTypesRow: { flexDirection: "row", gap: ThemeSpacing.sm },
  orderTypeBox: { flex: 1, backgroundColor: ThemeColors.bg, borderRadius: ThemeRadius.md, padding: ThemeSpacing.md, alignItems: "center", gap: 4 },
  orderTypeCount: { fontSize: 22, color: ThemeColors.textPrimary },
  orderTypeLabel: { fontSize: 11, color: ThemeColors.textMuted, textTransform: "capitalize" },
  topItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: ThemeColors.borderSubtle, gap: 10 },
  topItemRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: ThemeColors.accentDim, justifyContent: "center", alignItems: "center" },
  topItemRankText: { fontSize: 12, color: ThemeColors.accent },
  topItemName: { flex: 1, fontSize: 14, color: ThemeColors.textPrimary },
  topItemQty: { fontSize: 13, color: ThemeColors.textMuted },
  topItemRevenue: { fontSize: 14, color: ThemeColors.emerald },
  reconciliation: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.lg, borderWidth: 1, borderColor: ThemeColors.border },
  reconRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  reconLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  reconValue: { fontSize: 14, color: ThemeColors.textPrimary },
  cashCountRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: ThemeSpacing.lg },
  cashCountLabel: { fontSize: 14, color: ThemeColors.textPrimary },
  cashCountInput: { flex: 1, borderWidth: 1, borderColor: ThemeColors.border, borderRadius: ThemeRadius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: ThemeColors.textPrimary },
  varianceBox: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: ThemeSpacing.md, padding: ThemeSpacing.md, borderRadius: ThemeRadius.md },
  closeShiftBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: ThemeColors.accent, paddingVertical: 16, borderRadius: ThemeRadius.lg, marginTop: ThemeSpacing.lg },
  closeShiftBtnText: { color: ThemeColors.white, fontSize: 16 },
});
