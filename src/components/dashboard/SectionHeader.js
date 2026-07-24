import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";

export function SectionHeader({ title, action, isOverview, onDatePress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text weight="bold" style={styles.sectionTitle}>
        {title}
      </Text>
      {action && <View>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
    marginTop: ThemeSpacing.xl,
  },
  sectionTitle: { 
    fontSize: 18, 
    color: ThemeColors.textPrimary 
  },
});
