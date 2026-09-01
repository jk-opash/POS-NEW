import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { Shield } from "lucide-react-native";

export function LogsEmptyState() {
  return (
    <View style={styles.emptyState}>
      <Shield size={48} color={ThemeColors.border} />
      <Text weight="bold" style={styles.emptyTitle}>
        No logs found
      </Text>
      <Text style={styles.emptySubtitle}>
        There are no audit logs for this branch yet.
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
