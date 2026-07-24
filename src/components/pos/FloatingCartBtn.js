import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";

export function FloatingCartBtn({ cartLength, grandTotal, onPress }) {
  if (cartLength === 0) return null;

  return (
    <View style={styles.floatingCartBar}>
      <TouchableOpacity style={styles.floatingCartBtn} onPress={onPress}>
        <ShoppingCart color={ThemeColors.white} size={20} />
        <Text weight="bold" style={styles.floatingCartText}>
          View Cart ({cartLength}) • ₹{grandTotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingCartBar: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    left: ThemeSpacing.xl,
    right: ThemeSpacing.xl,
  },
  floatingCartBtn: {
    flexDirection: "row",
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 16,
    paddingHorizontal: ThemeSpacing.xl,
    borderRadius: ThemeRadius.full,
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingCartText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
