import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

const STORE_COLORS = [ThemeColors.emerald, ThemeColors.blue, ThemeColors.purple];

export function MultiStorePerformance({ stores }) {
  const maxRevenue = Math.max(...stores.map((s) => s.revenue));
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text weight="bold" style={styles.title}>Multi-Store Performance</Text>
          <Text weight="regular" style={styles.subtitle}>{stores.length} Stores</Text>
        </View>
      </View>

      {stores.map((store, i) => {
        const color = STORE_COLORS[i % STORE_COLORS.length];
        return (
          <View key={store.store} style={styles.storeRow}>
            <View style={styles.storeLeft}>
              <Text weight="semibold" style={styles.storeName}>{store.store}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(store.revenue / maxRevenue) * 100}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
            <View style={styles.storeRight}>
              <Text weight="extrabold" style={[styles.storeRevenue, { color }]}>
                ₹{(store.revenue / 1000).toFixed(0)}K
              </Text>
              <Text weight="regular" style={styles.storeProfit}>
                +₹{(store.profit / 1000).toFixed(1)}K profit
              </Text>
            </View>
          </View>
        );
      })}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.lg,
  },
  title: { fontSize: 15, color: ThemeColors.textPrimary },
  subtitle: { fontSize: 12, color: ThemeColors.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: ThemeColors.blueDim,
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, color: ThemeColors.blue },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.md,
  },
  storeLeft: { flex: 1, gap: 6 },
  storeName: { fontSize: 13, color: ThemeColors.textPrimary },
  barTrack: {
    height: 6,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },
  storeRight: { alignItems: "flex-end", minWidth: 80 },
  storeRevenue: { fontSize: 14 },
  storeProfit: { fontSize: 11, color: ThemeColors.emerald, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: ThemeSpacing.sm,
    marginTop: ThemeSpacing.md,
  },
  inventoryRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    justifyContent: "space-around",
  },
  inventoryCard: { flex: 1, alignItems: "center", gap: 6 },
  inventoryPct: { fontSize: 14 },
  inventoryBarTrack: {
    width: 28, height: 60,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: 6, justifyContent: "flex-end", overflow: "hidden",
  },
  inventoryBarFill: { width: "100%", borderRadius: 6 },
  inventoryStore: { fontSize: 11, color: ThemeColors.textMuted, textAlign: "center" },
});
