import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

export function TablesLegend({
  isSmallScreen,
  availableCount,
  dineInCount,
  reservedCount,
}) {
  return (
    <View
      style={[
        styles.legend,
        isSmallScreen && {
          left: ThemeSpacing.md,
          bottom: ThemeSpacing.md,
          flexDirection: "column",
          alignItems: "flex-start",
          gap: ThemeSpacing.sm,
        },
      ]}
    >
      <View style={styles.legendItem}>
        <View
          style={[
            styles.legendDot,
            {
              backgroundColor: ThemeColors.white,
              borderWidth: 1,
              borderColor: ThemeColors.border,
            },
          ]}
        />
        <Text style={styles.legendText}>Available: {availableCount}</Text>
      </View>
      <View style={styles.legendItem}>
        <View
          style={[styles.legendDot, { backgroundColor: ThemeColors.blue }]}
        />
        <Text style={styles.legendText}>Dine in: {dineInCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    left: ThemeSpacing.xxl,
    flexDirection: "column",
    backgroundColor: ThemeColors.primary, // Modified background
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    gap: ThemeSpacing.md,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: ThemeColors.textWhite,
    fontWeight: "500",
  },
});
