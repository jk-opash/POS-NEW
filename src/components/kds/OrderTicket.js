import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { AlertCircle, Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function OrderTicket({ order, onAction, onItemAction }) {
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getTimerColor = () => {
    const mins = elapsed / 60;
    if (mins < 10) return ThemeColors.emerald;
    if (mins < 15) return ThemeColors.amber;
    return ThemeColors.red;
  };

  const getStatusConfig = () => {
    switch (order.status) {
      case "New":
        return {
          bg: ThemeColors.statusNew + "20",
          color: ThemeColors.statusNew,
        };
      case "Accepted":
        return {
          bg: ThemeColors.statusAccepted + "20",
          color: ThemeColors.statusAccepted,
        };
      case "Preparing":
        return {
          bg: ThemeColors.statusPreparing + "20",
          color: ThemeColors.statusPreparing,
        };
      case "Done":
      case "Ready":
        return {
          bg: ThemeColors.statusReady + "20",
          color: ThemeColors.statusReady,
        };
      case "Served":
        return {
          bg: ThemeColors.statusServed + "20",
          color: ThemeColors.statusServed,
        };
      case "Completed":
        return {
          bg: ThemeColors.statusCompleted + "20",
          color: ThemeColors.statusCompleted,
        };
      case "Cancelled":
        return {
          bg: ThemeColors.statusCancelled + "20",
          color: ThemeColors.statusCancelled,
        };
      default:
        return { bg: ThemeColors.bg, color: ThemeColors.textSecondary };
    }
  };

  const getNextItemAction = (status) => {
    switch (status) {
      case "Accepted":
        return {
          label: "Start Prep",
          action: "Preparing",
          color: ThemeColors.statusNew,
        };
      case "Preparing":
        return {
          label: "Mark Done",
          action: "Done",
          color: ThemeColors.statusPreparing,
        };
      case "Done":
        return null;
      case "Served":
        return null; // No action needed for Served
      default:
        return null;
    }
  };
  const statusCfg = getStatusConfig();
  const isUrgent = order.priority === "High";
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
        <View
          style={{
            justifyContent: "center",
            gap: 3,
          }}
        >
          {order.status !== "Served" &&
            order.status !== "Completed" &&
            order.status !== "Cancelled" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Clock size={16} color={getTimerColor()} />
                <Text
                  weight="bold"
                  style={[
                    styles.timeText,
                    { color: getTimerColor(), fontSize: 15 },
                  ]}
                >
                  {formatTime(elapsed)}
                </Text>
              </View>
            )}
          {(isUrgent || isOverdue) && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: ThemeColors.redDim, paddingVertical: 2 },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: ThemeColors.red, fontWeight: "bold" },
                ]}
              >
                {isOverdue ? "OVERDUE" : "URGENT"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Items Header ────────────────────────── */}
      <View style={styles.itemsHeader}>
        <Text weight="semibold" style={[styles.itemsHeaderText, { flex: 1 }]}>
          Items
        </Text>
        <Text
          weight="semibold"
          style={[
            styles.itemsHeaderText,
            styles.itemsQtyCol,
            { flex: 1, textAlign: "left" },
          ]}
        >
          Qty
        </Text>
      </View>

      {/* ── Items List ──────────────────────────── */}
      <View style={{ flex: 1 }}>
        {["Starter", "Main", "Dessert", "Uncategorized"].map((courseName) => {
          const courseItems = order.items.filter(
            (item) => (item.course || "Uncategorized") === courseName,
          );
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
                    {(() => {
                      const itemAction = getNextItemAction(
                        item.status || "Accepted",
                      );
                      if (!itemAction) return <View style={styles.actionCol} />;
                      return (
                        <TouchableOpacity
                          style={[
                            styles.actionBtn,
                            { backgroundColor: itemAction.color },
                          ]}
                          activeOpacity={0.8}
                          onPress={() =>
                            onItemAction(order.id, item.id, itemAction.action)
                          }
                        >
                          <Text weight="bold" style={styles.actionBtnText}>
                            {itemAction.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })()}
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

                  {/* Item Notes */}
                  {item.note ? (
                    <View style={styles.itemNoteBox}>
                      <Text style={styles.itemNoteText}>Note: {item.note}</Text>
                    </View>
                  ) : null}
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

      {/* ── Actions ─────────────────────────────── */}
      <View style={styles.actionsRow}>
        {(() => {
          if (order.status === "Completed" || order.status === "Cancelled")
            return null;

          const isAccepted = order.status === "Accepted";
          const btnLabel = isAccepted ? "START PREP" : "BUMP TICKET";
          const actionVal = isAccepted ? "Preparing" : "Completed";
          const btnColor = isAccepted
            ? ThemeColors.statusNew
            : ThemeColors.statusReady;

          return (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: btnColor,
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
              onPress={() => onAction(order.id, actionVal)}
            >
              <Text
                weight="bold"
                style={[
                  styles.actionBtnText,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                {btnLabel}
              </Text>
            </TouchableOpacity>
          );
        })()}
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
    maxWidth: 400,
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
    color: ThemeColors.textMuted,
    marginTop: ThemeSpacing.xs,
  },
  itemNoteBox: {
    marginTop: 4,
    paddingLeft: ThemeSpacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: ThemeColors.amber,
  },
  itemNoteText: {
    fontSize: 12,
    fontStyle: "italic",
    color: ThemeColors.amber,
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
