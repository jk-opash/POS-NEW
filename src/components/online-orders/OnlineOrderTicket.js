import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Check,
  Clock,
  ShoppingBag,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const OrderActionButtons = ({ order, onAction }) => {
  // If the status is not Completed or Cancelled, show action buttons
  if (order.status !== "Completed" && order.status !== "Cancelled") {
    return (
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.iconBtnSmall,
            { backgroundColor: ThemeColors.roseDim },
          ]}
          activeOpacity={0.8}
          onPress={() => onAction(order.id, "Cancelled")}
        >
          <X size={20} color={ThemeColors.rose} strokeWidth={2.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconBtnSmall,
            { backgroundColor: ThemeColors.accent },
          ]}
          activeOpacity={0.8}
          onPress={() => onAction(order.id, "Accepted")}
        >
          <Check size={20} color={ThemeColors.white} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

export function OnlineOrderTicket({ order, onAction, onItemAction }) {
  const [elapsed, setElapsed] = useState(0);

  // Timer logic
  useEffect(() => {
    if (order.status === "Completed" || order.status === "Cancelled") return;

    const calculateElapsed = () => {
      const start = new Date(order.startTime || order.orderedAt).getTime();
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [order.startTime, order.orderedAt, order.status]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "Just now";
    const mins = Math.floor(seconds / 60);
    if (mins === 0) return "Just now";
    return `${mins}m ago`;
  };

  const getPlatformColor = () => {
    const type = String(order.type || order.platform || "").toLowerCase();
    if (type.includes("zomato")) return "#E23744";
    if (type.includes("swiggy")) return "#FC8019";
    if (type.includes("qr")) return "#8B5CF6";
    return ThemeColors.primary;
  };

  const platformColor = getPlatformColor();

  const getCustomerOrTable = () => {
    const type = String(order.type || order.platform || "").toLowerCase();
    if (type.includes("qr") || type.includes("dine")) {
      return `Table ${order.table || order.customer || "N/A"}`.replace("Table Table", "Table");
    }
    if (type.includes("takeaway")) return "Takeaway";
    return order.customer || order.table || "Unknown Customer";
  };

  return (
    <View style={styles.orderCard}>
      {/* ── Card Header ─────────────────────────── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[
              styles.platformIconBox,
              { backgroundColor: platformColor + "15" },
            ]}
          >
            <ShoppingBag size={18} color={platformColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="bold" style={styles.cardPlatform} numberOfLines={1}>
              {order.type || order.platform} #{order.orderNumber || (order.orderId ? order.orderId.split("-")[1] : "")}
            </Text>
            <View style={styles.cardTimeRow}>
              <Clock size={12} color={ThemeColors.textMuted} />
              <Text style={styles.cardTime} numberOfLines={1}>
                {formatTime(elapsed)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Items List ──────────────────────────── */}
      <View style={styles.orderItemsList}>
        <View style={styles.customerRow}>
          <Text weight="bold" style={styles.cardCustomer}>
            {getCustomerOrTable()}
          </Text>
        </View>

        {order.items && order.items.map((item, i) => (
          <View key={`${item.id || item.name}-${i}`} style={styles.orderItemRow}>
            <View style={styles.orderItemQtyBadge}>
              <Text weight="bold" style={styles.orderItemQtyText}>
                {item.qty}x
              </Text>
            </View>
            <Text style={styles.orderItemName}>{item.name}</Text>
          </View>
        ))}
      </View>

      {/* ── Footer ────────────────────────────── */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardTotalLabel}>Total Amount</Text>
          <Text weight="bold" style={styles.cardTotal}>
            ₹{order.total && !isNaN(order.total) ? Number(order.total).toFixed(0) : "0"}
          </Text>
        </View>
        <OrderActionButtons order={order} onAction={onAction} />
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
    borderColor: ThemeColors.borderSubtle,
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
  platformIconBox: {
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
    marginBottom: ThemeSpacing.xs,
  },
  cardCustomer: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
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
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.bg + "50",
  },
  cardTotalLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginBottom: 2,
  },
  cardTotal: {
    fontSize: 22,
    color: ThemeColors.textPrimary,
  },
  cardActions: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  iconBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: ThemeRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
});
