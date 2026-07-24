import React from "react";
import { View, StyleSheet, } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { PieChart } from "react-native-chart-kit";

export function ExpensePieChart() {
  const [chartWidth, setChartWidth] = React.useState(0);

  const data = [
    { name: "Inventory", percent: 45, color: ThemeColors.blue, legendFontColor: ThemeColors.textPrimary, legendFontSize: 12 },
    { name: "Payroll", percent: 30, color: ThemeColors.emerald, legendFontColor: ThemeColors.textPrimary, legendFontSize: 12 },
    { name: "Rent", percent: 15, color: ThemeColors.amber, legendFontColor: ThemeColors.textPrimary, legendFontSize: 12 },
    { name: "Misc", percent: 10, color: ThemeColors.red, legendFontColor: ThemeColors.textPrimary, legendFontSize: 12 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Expense Distribution</Text>
        <Text weight="regular" style={styles.subtitle}>Operating cost breakdown</Text>
      </View>
      <View 
        style={styles.chartWrapper}
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        {chartWidth > 0 && (
          <PieChart
            data={data}
            width={chartWidth}
            height={160}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={"percent"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[(chartWidth / 4) - 20, 0]}
            absolute
          />
        )}
      </View>
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
    flex: 1,
  },
  header: {
    marginBottom: ThemeSpacing.md,
  },
  title: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  }
});
