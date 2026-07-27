import { Text } from "@/components/ui/Text";
import {
  PLATFORM_COLORS,
  getTimeSince,
} from "@/screens/online-orders/OnlineOrdersScreen";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Check, Clock, ShoppingBag, X } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const OrderActionButtons = ({ order, onUpdateStatus }) => {
  switch (order.status) {
    case "New":
      return (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.iconBtnSmall,
              { backgroundColor: ThemeColors.roseDim },
            ]}
            onPress={() => onUpdateStatus(order.id, "Rejected")}
          >
            <X size={20} color={ThemeColors.rose} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconBtnSmall,
              { backgroundColor: ThemeColors.accent },
            ]}
            onPress={() => onUpdateStatus(order.id, "Accepted")}
          >
            <Check size={20} color={ThemeColors.white} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      );

    case "Ready":
      return (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.btnDispatchSmall}
            onPress={() => onUpdateStatus(order.id, "Dispatched")}
          >
            <Text
              weight="bold"
              style={{ color: ThemeColors.white, fontSize: 14 }}
            >
              Dispatch
            </Text>
          </TouchableOpacity>
        </View>
      );
    default:
      return null;
  }
};

export function OnlineOrderCard({
  order,
  isSelected,
  onSelect,
  onUpdateStatus,
}) {
  return (
    <TouchableOpacity
      style={[styles.orderCard, isSelected && styles.orderCardSelected]}
      onPress={() => onSelect(order)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[
              styles.platformIconBox,
              { backgroundColor: PLATFORM_COLORS[order.platform] + "15" },
            ]}
          >
            <ShoppingBag size={18} color={PLATFORM_COLORS[order.platform]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="bold" style={styles.cardPlatform} numberOfLines={1}>
              {order.platform} #{order.orderId.split("-")[1] || order.orderId}
            </Text>
            <View style={styles.cardTimeRow}>
              <Clock size={12} color={ThemeColors.textMuted} />
              <Text style={styles.cardTime} numberOfLines={1}>
                {getTimeSince(order.orderedAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.orderItemsList}>
        <View style={styles.customerRow}>
          <Text weight="medium" style={styles.cardCustomer}>
            {order.customer}
          </Text>
        </View>
        {order.items.map((item, i) => (
          <View key={i} style={styles.orderItemRow}>
            <View style={styles.orderItemQtyBadge}>
              <Text weight="bold" style={styles.orderItemQtyText}>
                {item.qty}x
              </Text>
            </View>
            <Text style={styles.orderItemName}>{item.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardTotalLabel}>Total Amount</Text>
          <Text weight="bold" style={styles.cardTotal}>
            ₹{order.total.toFixed(0)}
          </Text>
        </View>
        <OrderActionButtons order={order} onUpdateStatus={onUpdateStatus} />
      </View>
    </TouchableOpacity>
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
  orderCardSelected: {
    borderColor: ThemeColors.primary,
    shadowOpacity: 0.1,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
  },
  statusBadgeText: {
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
    fontSize: 18,
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
  btnPrimarySmall: {
    backgroundColor: ThemeColors.violet,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
  },
  btnReadySmall: {
    backgroundColor: ThemeColors.amber,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
  },
  btnDispatchSmall: {
    backgroundColor: ThemeColors.teal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
  },
});
