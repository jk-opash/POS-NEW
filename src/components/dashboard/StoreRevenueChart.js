import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { BarChart } from "react-native-chart-kit";

export function StoreRevenueChart({ data }) {
  const [containerWidth, setContainerWidth] = React.useState(0);
  
  const minSpacing = 60;
  const chartWidth = Math.max(containerWidth, (data?.length || 0) * minSpacing * 2); // wider because bar chart

  if (!data || data.length === 0) return null;

  const labels = data.map(d => d.store);
  const revenueData = data.map(d => d.revenue);

  return (
    <View style={styles.container} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Branch Revenue Comparison</Text>
        <Text weight="regular" style={styles.subtitle}>Gross revenue across all locations</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartWrapper}>
          {containerWidth > 0 && (
            <BarChart
              data={{
              labels,
              datasets: [{ data: revenueData }]
            }}
            width={chartWidth}
            height={220}
            yAxisLabel="₹"
            chartConfig={{
              backgroundColor: ThemeColors.surface,
              backgroundGradientFrom: ThemeColors.surface,
              backgroundGradientTo: ThemeColors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: { borderRadius: 16 },
              barPercentage: 0.7,
              propsForBackgroundLines: { stroke: ThemeColors.borderSubtle },
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
            showValuesOnTopOfBars
            withInnerLines={true}
          />
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
  }
});
