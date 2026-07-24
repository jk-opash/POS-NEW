import { Text } from "@/components/ui/Text";
import { STATUS_CONFIG } from "@/constants/orders";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["In Progress"];
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.statusText, { color: cfg.color }]}>{status}</Text>
    </View>
  );
}

export function OrderCard({ order, onPayBills, onSeeDetails }) {
  const MAX_ITEMS = 3;
  const visibleItems = order.items.slice(0, MAX_ITEMS);
  const extraCount = order.items.length - MAX_ITEMS + (order.extraItems || 0);

  return (
    <View style={styles.card}>
      {/* ── Card Header ─────────────────────────── */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderMid}>
          <Text weight="bold" style={styles.customerName}>
            {order.type === "Takeaway"
              ? order.customer?.name || order.customerName || "Walk-in"
              : `Table ${order.table || order.customer?.initials || ""}`}
          </Text>
          <Text weight="regular" style={styles.orderId}>
            Order #{order.id} | {order.type}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      {/* ── Date/Time ───────────────────────────── */}
      <View style={styles.dateTimeRow}>
        <Text weight="regular" style={styles.dateText}>
          {order.date}
        </Text>
        <Text weight="semibold" style={styles.timeText}>
          {order.time}
        </Text>
      </View>

      {/* ── Divider ─────────────────────────────── */}
      <View style={styles.divider} />

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
        <Text
          weight="semibold"
          style={[styles.itemsHeaderText, styles.itemsPriceCol]}
        >
          Price
        </Text>
      </View>

      {/* ── Items List ──────────────────────────── */}
      <View style={{ flex: 1 }}>
        {visibleItems.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Text
              weight="regular"
              style={[styles.itemName, { flex: 1 }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text weight="regular" style={[styles.itemQty, styles.itemsQtyCol]}>
              {item.qty}
            </Text>
            <Text
              weight="semibold"
              style={[styles.itemPrice, styles.itemsPriceCol]}
            >
              ₹{(item.price || 0).toFixed(2)}
            </Text>
          </View>
        ))}

        {extraCount > 0 && (
          <Text weight="semibold" style={styles.moreItems}>
            +{extraCount} more
          </Text>
        )}
      </View>

      {/* ── Divider ─────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Total ───────────────────────────────── */}
      <View style={styles.totalRow}>
        <Text weight="semibold" style={styles.totalLabel}>
          Total
        </Text>
        <Text weight="extrabold" style={styles.totalAmount}>
          ₹{order.total.toFixed(2)}
        </Text>
      </View>

      {/* ── Actions ─────────────────────────────── */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}
          onPress={() => onSeeDetails(order)}
        >
          <Text weight="semibold" style={styles.btnSecondaryText}>
            See Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.8}
          onPress={() => onPayBills(order)}
        >
          <Text weight="bold" style={styles.btnPrimaryText}>
            Pay Bills
          </Text>
        </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: ThemeColors.border,
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
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  orderId: {
    fontSize: 11,
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
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: ThemeSpacing.sm,
  },
  dateText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  timeText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.sm,
  },
  itemsHeader: {
    flexDirection: "row",
    marginBottom: ThemeSpacing.xs,
  },
  itemsHeaderText: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  itemsQtyCol: {
    width: 30,
    textAlign: "center",
  },
  itemsPriceCol: {
    width: 60,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  itemQty: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
    textAlign: "right",
  },
  moreItems: {
    fontSize: 11,
    color: ThemeColors.blue,
    marginTop: 2,
    marginBottom: ThemeSpacing.xs,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: ThemeSpacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  totalAmount: {
    fontSize: 22,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.5,
  },
  actionsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    marginTop: ThemeSpacing.xs,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: ThemeSpacing.sm + 2,
    borderRadius: ThemeRadius.md,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
  },
  btnSecondaryText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: ThemeSpacing.sm + 2,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emerald,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 13,
    color: ThemeColors.surface,
  },
});
