import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

export function SalesByCategory({ data }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Sales by Category</Text>
        <Text weight="regular" style={styles.subtitle}>Category performance breakdown</Text>
      </View>

      <View style={styles.itemsContainer}>
        {data.map((item) => (
          <View
            key={item.category}
            style={[styles.catCardBox, { borderTopColor: item.color }]}
          >
            <View style={styles.catHeaderLarge}>
              <Text style={[styles.catNameLarge, { color: item.color }]}>
                {item.category}
              </Text>
              <Text weight="black" style={styles.catRevLarge}>
                {item.percent}%
              </Text>
            </View>

            <View style={styles.itemTrack}>
              <View
                style={[
                  styles.itemFill,
                  { width: `${item.percent}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
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
  itemsContainer: { gap: ThemeSpacing.md },
  catCardBox: {
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderTopWidth: 4,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  catHeaderLarge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  catNameLarge: {
    fontSize: 16,
    fontWeight: "800",
  },
  catRevLarge: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  itemTrack: {
    width: "100%",
    height: 8,
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: 6,
    overflow: "hidden",
  },
  itemFill: { height: "100%", borderRadius: 6 },
});
