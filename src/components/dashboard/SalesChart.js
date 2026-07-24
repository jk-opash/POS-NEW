import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const TABS = [
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function formatValue(v) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v}`;
}

export function SalesChart({ data, activeTab, onTabChange }) {
  const [containerWidth, setContainerWidth] = useState(0);

  const minSpacing = 50;
  const chartWidth = Math.max(containerWidth, (data?.length || 0) * minSpacing);

  const totalIncome = data.reduce((s, d) => s + d.value, 0);
  const totalExpense = data.reduce(
    (s, d) => s + (d.expense || d.value * 0.7),
    0,
  );

  const labels = data.map((d) => d.label.substring(0, 3));
  const incomeData = data.map((d) => d.value);
  const expenseData = data.map((d) => d.expense || d.value * 0.7);

  const renderChart = (title, chartData, colorStr, total) => {
    const config = {
      backgroundColor: ThemeColors.surface,
      backgroundGradientFrom: ThemeColors.surface,
      backgroundGradientTo: ThemeColors.surface,
      decimalPlaces: 0,
      color: (opacity = 1) => colorStr.replace("${opacity}", opacity),
      labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
      style: { borderRadius: 16 },
      propsForDots: { r: "4", strokeWidth: "2", stroke: ThemeColors.surface },
      propsForBackgroundLines: { stroke: ThemeColors.borderSubtle },
    };

    return (
      <View style={styles.chartSection}>
        <View style={styles.headerLeft}>
          <Text weight="bold" style={styles.title}>
            {title}
          </Text>
          <Text weight="bold" style={styles.totalVal}>
            {formatValue(total)}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.chartWrapper}>
            {containerWidth > 0 && data.length > 0 ? (
              <LineChart
                data={{
                  labels,
                  datasets: [
                    { data: chartData, color: config.color, strokeWidth: 3 },
                  ],
                }}
                width={chartWidth}
                height={180}
                chartConfig={config}
                bezier
                withVerticalLines={false}
                withDots={false}
                formatYLabel={(y) => {
                  const val = parseInt(y, 10);
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                  return val;
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            ) : (
              <View style={[styles.emptyWrap, { width: containerWidth }]}>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {renderChart(
        "Income Trend",
        incomeData,
        "rgba(16, 185, 129, ${opacity})",
        totalIncome,
      )}
      <View style={styles.divider} />
      {renderChart(
        "Expense Trend",
        expenseData,
        "rgba(249, 115, 22, ${opacity})",
        totalExpense,
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginTop: ThemeSpacing.sm,
  },
  chartSection: {
    marginBottom: ThemeSpacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
  },
  headerLeft: {
    gap: ThemeSpacing.xs,
    marginBottom: ThemeSpacing.sm,
  },
  title: { fontSize: 14, color: ThemeColors.textPrimary },
  totalVal: { fontSize: 22, color: ThemeColors.textPrimary },
  tabStrip: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: 12,
    padding: 3,
    marginBottom: ThemeSpacing.lg,
    alignSelf: "flex-start",
  },
  tab: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 12, color: ThemeColors.textMuted },
  tabTextActive: { color: ThemeColors.textPrimary },
  scrollContent: { flexGrow: 1 },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
});
