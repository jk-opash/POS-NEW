import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Store, ShoppingBag, Truck } from "lucide-react-native";

export function SalesByOrderType({ dineIn, takeaway, delivery }) {
  const total = dineIn + takeaway + delivery;
  
  const renderRow = (icon, label, value, color) => (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
          {icon}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text weight="bold" style={styles.value}>₹{(value / 1000).toFixed(1)}K</Text>
        <Text style={styles.percent}>{total > 0 ? Math.round((value / total) * 100) : 0}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text weight="semibold" style={styles.title}>Sales By Order Type</Text>
      
      <View style={styles.list}>
        {renderRow(<Store size={18} color={ThemeColors.blue} />, "Dine-in", dineIn, ThemeColors.blue)}
        <View style={styles.divider} />
        {renderRow(<ShoppingBag size={18} color={ThemeColors.amber} />, "Takeaway", takeaway, ThemeColors.amber)}
        <View style={styles.divider} />
        {renderRow(<Truck size={18} color={ThemeColors.emerald} />, "Delivery", delivery, ThemeColors.emerald)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  list: {
    gap: ThemeSpacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ThemeSpacing.xs,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  rightCol: {
    alignItems: "flex-end",
  },
  value: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  percent: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
  },
});
