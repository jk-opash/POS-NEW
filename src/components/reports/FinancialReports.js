import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { ProfitMarginChart } from "@/components/dashboard/ProfitMarginChart";
import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { ReportAlertsPanel } from "@/components/reports/ReportWidgets";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { CreditCard, Receipt } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export function FinancialReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const { summary } = dash;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View
        key="profit"
        style={isScrollable ? { width: cardWidth } : { flex: 1 }}
      >
        <SummaryCard
          icon={<Receipt size={18} color={ThemeColors.blue} />}
          title="Net Profit"
          primary={`₹${(summary.profit.net / 1000).toFixed(1)}K`}
          badge={{
            label: `${summary.profit.margin}% Margin`,
            positive: summary.profit.margin > 0,
          }}
        >
          <MetricRow
            label="Operating Exp."
            value={`₹${((summary.revenue.today * 0.4) / 1000).toFixed(1)}K`}
          />
          <MetricRow
            label="EBITDA"
            value={`₹${((summary.profit.net * 1.1) / 1000).toFixed(1)}K`}
            highlight
          />
        </SummaryCard>
      </View>,

      <View
        key="cash"
        style={isScrollable ? { width: cardWidth } : { flex: 1 }}
      >
        <SummaryCard
          icon={<CreditCard size={18} color={ThemeColors.emerald} />}
          title="Cash Flow"
          primary={`+₹${((summary.revenue.today * 0.6) / 1000).toFixed(1)}K`}
          badge={{ label: "12.5%", positive: true }}
        >
          <MetricRow
            label="Cash In"
            value={`₹${(summary.revenue.today / 1000).toFixed(1)}K`}
            arrow="up"
          />
          <MetricRow
            label="Cash Out"
            value={`₹${((summary.revenue.today * 0.4) / 1000).toFixed(1)}K`}
            arrow="down"
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {renderKPIs()}

      <View style={styles.section}>
        <ProfitMarginChart data={dash.salesData} />
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>
              Tax Report (Estimates)
            </Text>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>GST Collected (18%)</Text>
              <Text style={styles.taxValue}>
                ₹{(summary.revenue.today * 0.18).toLocaleString()}
              </Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Service Tax (5%)</Text>
              <Text style={styles.taxValue}>
                ₹{(summary.revenue.today * 0.05).toLocaleString()}
              </Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Total Tax Liability</Text>
              <Text weight="bold" style={styles.taxValue}>
                ₹{(summary.revenue.today * 0.23).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ExpensePieChart />
        </View>
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <View style={{ flex: 2 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>
              Cash Flow Statement
            </Text>
            <Text style={styles.cardSubtitle}>Operating Cash In & Out</Text>

            <View style={styles.tableHeader}>
              <Text weight="bold" style={[styles.cell, { flex: 2 }]}>
                Description
              </Text>
              <Text weight="bold" style={styles.cell}>
                Type
              </Text>
              <Text weight="bold" style={[styles.cell, { textAlign: "right" }]}>
                Amount (₹)
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>
                Customer Payments (Revenue)
              </Text>
              <Text style={styles.cell}>Cash In</Text>
              <Text
                weight="bold"
                style={[
                  styles.cell,
                  { textAlign: "right", color: ThemeColors.emerald },
                ]}
              >
                +{summary.revenue.today.toLocaleString()}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>
                Supplier Payments (Inventory)
              </Text>
              <Text style={styles.cell}>Cash Out</Text>
              <Text
                weight="bold"
                style={[
                  styles.cell,
                  { textAlign: "right", color: ThemeColors.red },
                ]}
              >
                -{(summary.revenue.today * 0.45).toLocaleString()}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>Payroll & Salaries</Text>
              <Text style={styles.cell}>Cash Out</Text>
              <Text
                weight="bold"
                style={[
                  styles.cell,
                  { textAlign: "right", color: ThemeColors.red },
                ]}
              >
                -{(summary.revenue.today * 0.3).toLocaleString()}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>Rent & Utilities</Text>
              <Text style={styles.cell}>Cash Out</Text>
              <Text
                weight="bold"
                style={[
                  styles.cell,
                  { textAlign: "right", color: ThemeColors.red },
                ]}
              >
                -{(summary.revenue.today * 0.15).toLocaleString()}
              </Text>
            </View>
            <View
              style={[
                styles.tableRow,
                { borderBottomWidth: 0, marginTop: ThemeSpacing.md },
              ]}
            >
              <Text
                weight="bold"
                style={[styles.cell, { flex: 2, fontSize: 16 }]}
              >
                Net Operating Cash Flow
              </Text>
              <Text style={styles.cell}></Text>
              <Text
                weight="bold"
                style={[
                  styles.cell,
                  {
                    textAlign: "right",
                    fontSize: 16,
                    color: ThemeColors.emerald,
                  },
                ]}
              >
                +{(summary.revenue.today * 0.1).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ReportAlertsPanel
            title="Financial & Payment Alerts"
            alerts={dash.alerts?.filter(
              (a) =>
                a.message.toLowerCase().includes("payment") ||
                a.message.toLowerCase().includes("refund"),
            )}
          />
        </View>
      </View>
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
  row: {
    flexDirection: "column",
    gap: ThemeSpacing.xl,
    marginBottom: ThemeSpacing.xl,
  },
  rowDesktop: {
    flexDirection: "row",
  },
  section: {
    width: "100%",
    marginBottom: ThemeSpacing.xl,
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.xl,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  taxLabel: {
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
  taxValue: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
  },
  cardSubtitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.lg,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    marginBottom: ThemeSpacing.sm,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
});
