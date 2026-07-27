import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { AlertCircle, Utensils } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function WaiterTicket({ order, onServeAll }) {
  const [elapsed, setElapsed] = useState(0);

  // Timer logic
  useEffect(() => {
    if (order.status === "Completed" || order.status === "Cancelled") return;

    const calculateElapsed = () => {
      const timeValue =
        order.startTime || order.time || order.orderedAt || order.createdAt;
      if (!timeValue) return;
      const start = new Date(timeValue).getTime();
      if (isNaN(start)) return;
      const now = Date.now();
      setElapsed(Math.max(0, Math.floor((now - start) / 1000)));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [
    order.startTime,
    order.time,
    order.orderedAt,
    order.createdAt,
    order.status,
  ]);

  const isOverdue = elapsed >= 15 * 60;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0m 0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const cardDynamicStyle = {
    backgroundColor: isOverdue ? ThemeColors.red + "15" : ThemeColors.surface,
    borderColor: isOverdue ? ThemeColors.red : ThemeColors.borderSubtle,
  };

  return (
    <View style={[styles.orderCard, cardDynamicStyle]}>
      {/* ── Card Header ─────────────────────────── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: ThemeColors.primary + "15" },
            ]}
          >
            <Utensils size={18} color={ThemeColors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="bold" style={styles.cardPlatform} numberOfLines={2}>
              #{order.orderNumber} - {order.type}
            </Text>
            {/* <View style={styles.cardTimeRow}>
              <Clock size={12} color={ThemeColors.textMuted} />
              <Text style={styles.cardTime} numberOfLines={1}>
                {formatTime(elapsed)} {isOverdue && " (Overdue)"}
              </Text>
            </View> */}
          </View>
        </View>
      </View>

      {/* ── Items List ──────────────────────────── */}
      <View style={styles.orderItemsList}>
        <View style={styles.customerRow}>
          <Text weight="medium" style={styles.cardCustomer}>
            Table: {order.table || order.customer || "N/A"}
          </Text>
          <Text style={styles.stationText}>Station: {order.station}</Text>
        </View>

        {["Starter", "Main", "Dessert", "Uncategorized"].map((courseName) => {
          const courseItems = order.items.filter((item) => {
            const matchesCourse =
              (item.course || "Uncategorized") === courseName;
            const matchesStatus =
              item.status === "Done" ||
              item.status === "Completed" ||
              item.status === "Ready";
            return matchesCourse && matchesStatus;
          });
          if (courseItems.length === 0) return null;

          return (
            <View key={courseName} style={styles.courseGroup}>
              {courseItems.map((item, i) => (
                <View key={`${item.id}-${i}`} style={styles.itemContainer}>
                  <View style={styles.orderItemRow}>
                    <View style={styles.orderItemQtyBadge}>
                      <Text weight="bold" style={styles.orderItemQtyText}>
                        {item.qty}x
                      </Text>
                    </View>
                    <Text style={styles.orderItemName}>{item.name}</Text>
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
      </View>

      {/* ── Footer / Action Button ──────────────── */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.btnServeAll}
          activeOpacity={0.8}
          onPress={onServeAll}
        >
          <Text weight="bold" style={styles.btnServeAllText}>
            SERVE ALL READY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    marginBottom: ThemeSpacing.lg,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    marginRight: ThemeSpacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPlatform: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  cardTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cardTime: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
  orderItemsList: {
    flex: 1,
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  customerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.xs,
  },
  cardCustomer: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  stationText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  courseGroup: {
    gap: ThemeSpacing.sm,
  },
  itemContainer: {
    gap: 4,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  orderItemQtyBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ThemeColors.borderSubtle,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItemQtyText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  orderItemName: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
    flex: 1,
  },
  modifiersList: {
    paddingLeft: 44, // 28 (badge width) + 16 (gap)
  },
  modifierText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  notesBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.amberDim,
    padding: ThemeSpacing.sm,
    marginTop: ThemeSpacing.xs,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: ThemeColors.amber,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.bg + "50",
  },
  btnServeAll: {
    backgroundColor: ThemeColors.amber,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
    width: "100%",
    alignItems: "center",
  },
  btnServeAllText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
