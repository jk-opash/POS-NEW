import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { ListOrdered } from "lucide-react-native";

export function OrdersEmptyState() {
  return (
    <View style={styles.emptyState}>
      <ListOrdered size={48} color={ThemeColors.border} />
      <Text weight="bold" style={styles.emptyTitle}>
        No orders found
      </Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filter or create a new order.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    gap: ThemeSpacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
});
