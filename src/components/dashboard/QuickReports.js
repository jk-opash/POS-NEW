import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";

export function QuickReports({ oneColumn = false }) {
  const items = [
    { icon: "📊", label: "Sales Report", color: ThemeColors.emerald },
    { icon: "📦", label: "Inventory Report", color: ThemeColors.amber },
    { icon: "👥", label: "Customer Report", color: ThemeColors.blue },
    { icon: "👔", label: "Employee Report", color: ThemeColors.purple },
  ];

  return (
    <View style={oneColumn ? styles.reportCol : styles.reportGrid}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.reportCard,
            { borderColor: item.color + "40" },
            oneColumn && { width: "100%" },
          ]}
        >
          <Text style={styles.reportIcon}>{item.icon}</Text>
          <Text
            weight="semibold"
            style={[styles.reportLabel, { color: item.color }]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.sm,
  },
  reportCol: {
    flexDirection: "column",
    gap: ThemeSpacing.sm,
  },
  reportCard: {
    width: "48%",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  reportIcon: { fontSize: 20 },
  reportLabel: { fontSize: 13 },
});
