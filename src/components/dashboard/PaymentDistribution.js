import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

export function PaymentDistribution({ data }) {
  const { width, isMobile, isMiniTab, isTablet, isDesktop } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>
          Payment Distribution
        </Text>
        <Text weight="regular" style={styles.subtitle}>
          Revenue by payment method
        </Text>
      </View>

      <View
        style={{
          flexDirection: isTablet || isDesktop ? "row" : "column",
          gap: ThemeSpacing.md,
        }}
      >
        {data.map((ps, idx) => {
          const colors = [
            ThemeColors.blue, // Blue for UPI
            ThemeColors.violet, // Purple for Card
            ThemeColors.emeraldChart, // Emerald for Cash
          ];
          const color = colors[idx % 3];

          return (
            <View key={ps.method} style={styles.paymentCard}>
              <View style={styles.paymentContent}>
                <View style={styles.payHeader}>
                  <Text weight="bold" style={styles.payName}>
                    {ps.method}
                  </Text>
                  <Text
                    weight="extrabold"
                    style={[styles.payPercent, { color }]}
                  >
                    {ps.percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text weight="black" style={styles.payAmount}>
                  ₹{ps.amount.toLocaleString()}
                </Text>
                <Text weight="semibold" style={styles.payCount}>
                  {ps.count} orders
                </Text>
              </View>
              <View style={styles.payProgress}>
                <View
                  style={[
                    styles.payProgressFill,
                    {
                      width: `${ps.percentage}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
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
    marginTop: ThemeSpacing.md,
  },
  header: { marginBottom: ThemeSpacing.lg },
  title: { fontSize: 16, color: ThemeColors.textPrimary },
  subtitle: { fontSize: 13, color: ThemeColors.textMuted, marginTop: 2 },
  paymentCard: {
    flex: 1,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentContent: { gap: 4, marginBottom: ThemeSpacing.md },
  payHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  payCount: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  payAmount: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginTop: 4,
  },
  payPercent: {
    fontSize: 12,
  },
  payProgress: {
    height: 4,
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: 2,
    overflow: "hidden",
  },
  payProgressFill: { height: "100%", borderRadius: 2 },
});
