import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryLedger } from "@/store/slices/inventorySlice";

export function AdjustmentsTab() {
  const dispatch = useDispatch();
  const { activeBranch } = useSelector((state) => state.branch);
  const { ledger, isLedgerLoading: loading } = useSelector((state) => state.inventory);

  const stockAdjustments = ledger.filter(
    (item) => item.movement_type === "ADJUSTMENT"
  );

  useEffect(() => {
    if (activeBranch) {
      dispatch(fetchInventoryLedger(activeBranch));
    }
  }, [dispatch, activeBranch]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <View style={{ minWidth: 800, width: "100%" }}>
        <View style={styles.tableHeader}>
          <Text weight="bold" style={[styles.col, { width: 150 }]}>
            Reference
          </Text>
          <Text weight="bold" style={[styles.col, { width: 180 }]}>
            Date
          </Text>
          <Text weight="bold" style={[styles.col, { width: 220 }]}>
            Product
          </Text>
          <Text weight="bold" style={[styles.col, { flex: 1, minWidth: 200 }]}>
            Reason
          </Text>
          <Text
            weight="bold"
            style={[styles.col, { width: 120, textAlign: "right" }]}
          >
            Qty Adjusted
          </Text>
          <Text
            weight="bold"
            style={[styles.col, { width: 120, textAlign: "right" }]}
          >
            Performed By
          </Text>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={ThemeColors.primary} />
            <Text style={{ color: ThemeColors.textMuted, marginTop: 10 }}>Loading adjustments...</Text>
          </View>
        ) : error ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: ThemeColors.rose }}>{error}</Text>
          </View>
        ) : stockAdjustments.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: ThemeColors.textMuted }}>
              No stock adjustments recorded.
            </Text>
          </View>
        ) : (
          stockAdjustments.map((item) => {
            const qtyChange = Number(item.quantity_change);
            return (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.col, { width: 150, color: ThemeColors.blue }]} numberOfLines={1}>
                  {item.id.slice(0, 13)}
                </Text>
                <Text
                  style={[styles.col, { width: 180, color: ThemeColors.textMuted }]}
                >
                  {new Date(item.created_at).toLocaleString()}
                </Text>
                <Text style={[styles.col, { width: 220 }]} numberOfLines={1}>
                  {item.item?.name || "Unknown Item"}
                </Text>
                <Text
                  style={[
                    styles.col,
                    { flex: 1, minWidth: 200, color: ThemeColors.textSecondary },
                  ]}
                >
                  {item.reason || "-"}
                </Text>

                <Text
                  weight="bold"
                  style={[
                    styles.col,
                    {
                      width: 120,
                      textAlign: "right",
                      color:
                        qtyChange > 0
                          ? ThemeColors.emerald
                          : qtyChange < 0
                          ? ThemeColors.rose
                          : ThemeColors.textSecondary,
                    },
                  ]}
                >
                  {qtyChange > 0 ? "+" : ""}{qtyChange}
                </Text>

                <Text
                  style={[
                    styles.col,
                    {
                      width: 120,
                      textAlign: "right",
                      color: ThemeColors.textSecondary,
                    },
                  ]}
                >
                  {item.performed_by || "System"}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeSuccess: { backgroundColor: ThemeColors.emerald + "20" },
  badgeWarning: { backgroundColor: ThemeColors.amber + "20" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextSuccess: { color: ThemeColors.emerald },
  badgeTextWarning: { color: ThemeColors.amber },
});
