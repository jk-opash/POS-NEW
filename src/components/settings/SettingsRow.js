import React from "react";
import { View, StyleSheet } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeSpacing } from "@/theme/theme";

export function SettingsRow({ children, style }) {
  const { isMobile, isMiniTab } = useResponsive();
  const isSmall = isMobile || isMiniTab;

  return (
    <View style={[styles.row, isSmall && styles.col, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  col: {
    flexDirection: "column",
  },
});
