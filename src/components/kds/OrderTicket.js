import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { AlertCircle, Clock, Utensils } from "lucide-react-native";
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
      case "Served":
      case "Completed":
        return null; // item is finished, no more action needed
      default:
        return null;
    }
  };

  // Derive main ticket button state from the LEAST advanced item status
  // (All items must be Preparing before BUMP TICKET shows)
  const getTicketAction = () => {
    const statusPriority = [
      "Accepted",
      "Preparing",
      "Done",
      "Served",
      "Completed",
      "Cancelled",
    ];
    if (!order.items || order.items.length === 0) return null;
    // Find the minimum (least advanced) item status
    const effectiveStatuses = order.items.map(
      (i) => i.status || order.status || "Accepted",
    );
    const minStatus = effectiveStatuses.reduce(
      (worst, s) =>
        statusPriority.indexOf(s) < statusPriority.indexOf(worst) ? s : worst,
      "Completed",
    );

    if (minStatus === "Accepted") {
      return {
        label: "START PREP",
        action: "Preparing",
        color: ThemeColors.statusNew,
      };
    } else if (minStatus === "Preparing") {
      return {
        label: "BUMP TICKET",
        action: "Completed",
        color: ThemeColors.statusReady,
      };
    }
    return null; // All items are Done/Served/Completed
  };

  const isUrgent = order.priority === "High";
  const isOverdue = elapsed >= 15 * 60;

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
            <Text weight="bold" style={styles.cardPlatform} numberOfLines={1}>
              {order.type} - #{order.orderNumber}
            </Text>

            {order.status !== "Served" &&
            order.status !== "Completed" &&
            order.status !== "Cancelled" ? (
              <View style={styles.cardTimeRow}>
                <Clock size={12} color={getTimerColor()} />
                <Text
                  style={[styles.cardTime, { color: getTimerColor() }]}
                  numberOfLines={1}
                >
                  {formatTime(elapsed)} {isOverdue && " (Overdue)"}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {(isUrgent || isOverdue) && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: ThemeColors.redDim },
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

      {/* ── Items List ──────────────────────────── */}
      <View style={styles.orderItemsList}>
        <View style={styles.customerRow}>
          <Text weight="medium" style={styles.cardCustomer}>
            {order.type !== "Takeaway"
              ? `Table: ${order.table || order.customer || "N/A"}`
              : "Takeaway"}
          </Text>
          <Text style={styles.stationText}>Station: {order.station}</Text>
        </View>

        {Array.from(
          new Set(order.items.map((i) => i.course || "Uncategorized")),
        ).map((courseName) => {
          const courseItems = order.items.filter(
            (item) => (item.course || "Uncategorized") === courseName,
          );
          if (courseItems.length === 0) return null;

          return (
            <View key={courseName} style={styles.courseGroup}>
              {courseItems.map((item, i) => {
                // Item button uses its OWN status first, then falls back to the ticket's status
                // This means clicking "START PREP" on the main button syncs all item buttons too
                const effectiveStatus =
                  item.status || order.status || "Accepted";
                const itemAction = getNextItemAction(effectiveStatus);
                return (
                  <View key={`${item.id}-${i}`} style={styles.itemContainer}>
                    <View style={styles.orderItemRow}>
                      <View style={styles.orderItemQtyBadge}>
                        <Text weight="bold" style={styles.orderItemQtyText}>
                          {item.qty}x
                        </Text>
                      </View>
                      <Text style={styles.orderItemName}>{item.name}</Text>

                      {/* {itemAction ? (
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
                      ) : null} */}
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
                        <Text style={styles.itemNoteText}>
                          Note: {item.note}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
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
      {(() => {
        if (order.status === "Completed" || order.status === "Cancelled")
          return null;

        const ticketAction = getTicketAction();
        if (!ticketAction) return null;

        return (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={[
                styles.btnAction,
                { backgroundColor: ticketAction.color },
              ]}
              activeOpacity={0.8}
              onPress={() => onAction(order.id, ticketAction.action)}
            >
              <Text weight="bold" style={styles.btnActionText}>
                {ticketAction.label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })()}
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
  },
  statusText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  actionBtn: {
    width: 80,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: ThemeColors.white,
    fontSize: 11,
  },
  modifiersList: {
    paddingLeft: 44, // 28 (badge width) + 16 (gap)
  },
  modifierText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  itemNoteBox: {
    marginTop: 2,
    paddingLeft: ThemeSpacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: ThemeColors.amber,
    marginLeft: 44,
  },
  itemNoteText: {
    fontSize: 12,
    fontStyle: "italic",
    color: ThemeColors.amber,
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
  btnAction: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
    width: "100%",
    alignItems: "center",
  },
  btnActionText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
