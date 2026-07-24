import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { LineChart } from "react-native-chart-kit";

export function ProfitMarginChart({ data }) {
  const [containerWidth, setContainerWidth] = React.useState(0);
  
  const minSpacing = 50;
  const chartWidth = Math.max(containerWidth, (data?.length || 0) * minSpacing);

  const labels = data?.map(d => d.label.substring(0, 3)) || [];
  
  // Calculate Profit = Value (Revenue) - Expense
  const profitData = data?.map(d => {
    const expense = d.expense || d.value * 0.7;
    return d.value - expense;
  }) || [];

  return (
    <View style={styles.container} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Net Profit Trend</Text>
        <Text weight="regular" style={styles.subtitle}>Revenue minus operating expenses</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartWrapper}>
          {containerWidth > 0 && profitData.length > 0 ? (
            <LineChart
              data={{
                labels,
                datasets: [{ data: profitData, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, strokeWidth: 3 }]
              }}
              width={chartWidth}
              height={180}
              chartConfig={{
                backgroundColor: ThemeColors.surface,
                backgroundGradientFrom: ThemeColors.surface,
                backgroundGradientTo: ThemeColors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: ThemeColors.surface },
                propsForBackgroundLines: { stroke: ThemeColors.borderSubtle },
              }}
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
            <View style={[styles.emptyWrap, { width: containerWidth }]}><Text style={styles.emptyText}>No data available</Text></View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: ThemeSpacing.xl,
    width: "100%",
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
  scrollContent: {
    flexGrow: 1,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 14
  }
});
