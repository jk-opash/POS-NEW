import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Clock } from "lucide-react-native";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryLedger } from "@/store/slices/inventorySlice";

export function AuditLogTab() {
  const dispatch = useDispatch();
  const { activeBranch } = useSelector((state) => state.branch);
  const { ledger: stockLedger, isLedgerLoading: loading } = useSelector(
    (state) => state.inventory
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
          <Text weight="bold" style={[styles.col, { width: 100 }]}>
            Log ID
          </Text>
          <Text weight="bold" style={[styles.col, { width: 160 }]}>
            Timestamp
          </Text>
          <Text weight="bold" style={[styles.col, { width: 160 }]}>
            User / System
          </Text>
          <Text weight="bold" style={[styles.col, { width: 180 }]}>
            Action
          </Text>
          <Text weight="bold" style={[styles.col, { flex: 1, minWidth: 250 }]}>
            Details
          </Text>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={ThemeColors.primary} />
            <Text style={{ color: ThemeColors.textMuted, marginTop: 10 }}>Loading audit log...</Text>
          </View>
        ) : error ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: ThemeColors.rose }}>{error}</Text>
          </View>
        ) : stockLedger.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: ThemeColors.textMuted }}>
              No stock movements recorded yet.
            </Text>
          </View>
        ) : (
          stockLedger.map((item) => {
            const qtyChange = Number(item.quantity_change);
            return (
              <View key={item.id} style={styles.tableRow}>
                <Text
                  style={[styles.col, { width: 100, color: ThemeColors.textMuted }]}
                >
                  {item.id.slice(0, 8)}
                </Text>

                <View
                  style={[
                    styles.col,
                    {
                      width: 160,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    },
                  ]}
                >
                  <Clock size={12} color={ThemeColors.textMuted} />
                  <Text style={{ fontSize: 13, color: ThemeColors.textSecondary }}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                </View>

                <View style={[styles.col, { width: 160 }]}>
                  <View style={styles.userBadge}>
                    <Text style={styles.userBadgeText}>
                      {item.performed_by || "System"}
                    </Text>
                  </View>
                </View>

                <Text
                  weight="medium"
                  style={[
                    styles.col,
                    { width: 180, color: ThemeColors.textPrimary },
                  ]}
                >
                  {item.movement_type}
                </Text>
                <Text
                  style={[
                    styles.col,
                    { flex: 1, minWidth: 250, color: ThemeColors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  <Text style={{ fontWeight: "bold", color: ThemeColors.textPrimary }}>
                    {item.item?.name || "Unknown Item"}
                  </Text>
                  {" ("}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        qtyChange > 0
                          ? ThemeColors.emerald
                          : qtyChange < 0
                          ? ThemeColors.rose
                          : ThemeColors.textSecondary,
                    }}
                  >
                    {qtyChange > 0 ? "+" : ""}{qtyChange}
                  </Text>
                  {") - "}
                  {item.reason || "No reason provided"}
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
  userBadge: {
    backgroundColor: ThemeColors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  userBadgeText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
  },
});
