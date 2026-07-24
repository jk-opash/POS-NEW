import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { AlertCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function WaiterTicket({ order, onServeAll }) {
  const [elapsed, setElapsed] = useState(0);

  // Timer logic
  useEffect(() => {
    if (order.status === "Completed" || order.status === "Cancelled") return;

    const calculateElapsed = () => {
      const start = new Date(order.startTime).getTime();
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [order.startTime, order.status]);

  const isOverdue = elapsed >= 15 * 60;

  const cardDynamicStyle = {
    backgroundColor: isOverdue ? ThemeColors.red + "15" : ThemeColors.surface,
    borderWidth: isOverdue ? 2 : 1,
    borderColor: isOverdue ? ThemeColors.red : ThemeColors.borderSubtle,
  };

  return (
    <View style={[styles.card, cardDynamicStyle]}>
      {/* ── Card Header ─────────────────────────── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderMid}>
          <Text weight="bold" style={styles.customerName}>
            #{order.orderNumber} - {order.table || order.customer}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: ThemeSpacing.sm,
            }}
          >
            <Text weight="regular" style={styles.orderType}>
              {order.type} | Station: {order.station}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Items Header ────────────────────────── */}
      <View style={styles.itemsHeader}>
        <Text weight="semibold" style={[styles.itemsHeaderText, { flex: 1 }]}>
          Items
        </Text>
        <Text
          weight="semibold"
          style={[styles.itemsHeaderText, styles.itemsQtyCol]}
        >
          Qty
        </Text>
      </View>

      {/* ── Items List ──────────────────────────── */}
      <View style={{ flex: 1 }}>
        {["Starter", "Main", "Dessert", "Uncategorized"].map((courseName) => {
          const courseItems = order.items.filter((item) => {
            const matchesCourse =
              (item.course || "Uncategorized") === courseName;
            const matchesStatus = item.status === "Done" || item.status === "Completed" || item.status === "Ready";
            return matchesCourse && matchesStatus;
          });
          if (courseItems.length === 0) return null;

          return (
            <View key={courseName} style={styles.courseGroup}>
              {courseItems.map((item, i) => (
                <View key={`${item.id}-${i}`} style={styles.itemContainer}>
                  <View style={styles.itemRow}>
                    <Text
                      weight="regular"
                      style={[styles.itemName, { flex: 1 }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      weight="semibold"
                      style={[styles.itemQty, styles.itemsQtyCol]}
                    >
                      {item.qty}
                    </Text>
                  </View>

                  {/* Modifiers */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <View style={styles.modifiersList}>
                      {item.modifiers.map((mod, mIdx) => (
                        <Text key={mIdx} style={styles.modifierText}>
                          + {mod}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          );
        })}

        {/* Notes */}
        {order.notes ? (
          <View style={styles.notesBox}>
            <AlertCircle size={14} color={ThemeColors.amber} />
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        ) : null}

        {/* ── Main Action Button ──────────────────────── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: ThemeColors.amber }]}
            activeOpacity={0.8}
            onPress={onServeAll}
          >
            <Text weight="bold" style={styles.btnPrimaryText}>
              MARK ALL AS SERVED
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ThemeSpacing.sm,
    marginBottom: 4,
  },
  cardHeaderMid: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  orderType: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 4,
    borderRadius: ThemeRadius.xl,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: ThemeSpacing.sm,
  },
  timeText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.sm,
  },
  itemsHeader: {
    flexDirection: "row",
    paddingBottom: ThemeSpacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    marginBottom: ThemeSpacing.sm,
  },
  itemsHeaderText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
  },
  itemsQtyCol: {
    width: 30,
    textAlign: "right",
  },
  actionCol: {
    width: 100,
    marginLeft: 12,
  },
  actionBtn: {
    width: 100,
    marginLeft: 12,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: ThemeColors.white,
    fontSize: 12,
  },
  courseGroup: {
    gap: 4,
  },
  courseHeader: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.xs,
    letterSpacing: 0.5,
  },
  itemContainer: {
    marginBottom: ThemeSpacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  itemQty: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  modifiersList: {},
  modifierText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  notesBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.amberDim,
    padding: ThemeSpacing.sm,
    marginTop: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: ThemeColors.amber,
  },
  actionsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    marginTop: ThemeSpacing.xs,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 13,
  },
});
