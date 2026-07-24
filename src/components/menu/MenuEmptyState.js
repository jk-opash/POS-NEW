import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { Package } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export function MenuEmptyState() {
  return (
    <View style={styles.emptyState}>
      <Package size={48} color={ThemeColors.border} />
      <Text weight="bold" style={styles.emptyTitle}>
        No menu items found
      </Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: ThemeSpacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginTop: ThemeSpacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
});
