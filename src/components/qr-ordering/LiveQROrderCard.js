import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Clock, Utensils } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function LiveQROrderCard({ order, isDesktop, onAccept, onReject }) {
  return (
    <View style={styles.qrOrderCard}>
      <View style={styles.qrOrderHeader}>
        <View style={styles.qrOrderHeaderLeft}>
          <View style={styles.qrOrderIconBox}>
            <Utensils size={18} color={ThemeColors.accent} />
          </View>
          <View>
            <Text weight="bold" style={styles.qrOrderTable}>
              Table {order.table}
            </Text>
            <View style={styles.qrOrderTimeRow}>
              <Clock size={12} color={ThemeColors.textMuted} />
              <Text style={styles.qrOrderTime}>{order.time}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.qrOrderStatus,
            {
              backgroundColor:
                order.status === "Pending"
                  ? ThemeColors.amber + "15"
                  : order.status === "Accepted"
                    ? ThemeColors.blue + "15"
                    : order.status === "Rejected"
                      ? ThemeColors.rose + "15"
                      : ThemeColors.emerald + "15",
            },
          ]}
        >
          <Text
            weight="bold"
            style={[
              styles.qrOrderStatusText,
              {
                color:
                  order.status === "Pending"
                    ? ThemeColors.amber
                    : order.status === "Accepted"
                      ? ThemeColors.blue
                      : order.status === "Rejected"
                        ? ThemeColors.rose
                        : ThemeColors.emerald,
              },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.qrOrderItems}>
        {order.items.map((item, i) => (
          <View key={i} style={styles.qrOrderItemRow}>
            <View style={styles.qrOrderQtyBadge}>
              <Text weight="bold" style={styles.qrOrderQtyText}>
                {item.qty}x
              </Text>
            </View>
            <Text style={styles.qrOrderItemName}>{item.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.qrOrderFooter}>
        <View>
          <Text style={styles.qrOrderTotalLabel}>Total Amount</Text>
          <Text weight="bold" style={styles.qrOrderTotal}>
            ₹{order.total}
          </Text>
        </View>

        {order.status === "Pending" && (
          <View style={styles.qrOrderActions}>
            <TouchableOpacity
              style={styles.rejectQrBtn}
              onPress={() => onReject && onReject(order)}
            >
              <Text weight="bold" style={styles.rejectQrBtnText}>
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptQrBtn}
              onPress={() => onAccept && onAccept(order)}
            >
              <Text weight="bold" style={styles.acceptQrBtnText}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrOrderCard: {
    flex: 1,
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
  },
  qrOrderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  qrOrderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  qrOrderIconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.accent + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  qrOrderTable: { fontSize: 18, color: ThemeColors.textPrimary },
  qrOrderTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  qrOrderTime: { fontSize: 13, color: ThemeColors.textMuted },
  qrOrderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
  },
  qrOrderStatusText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  qrOrderItems: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  qrOrderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  qrOrderQtyBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ThemeColors.borderSubtle,
    justifyContent: "center",
    alignItems: "center",
  },
  qrOrderQtyText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  qrOrderItemName: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  qrOrderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.bg + "50",
  },
  qrOrderTotalLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginBottom: 2,
  },
  qrOrderTotal: { fontSize: 20, color: ThemeColors.textPrimary },
  qrOrderActions: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  rejectQrBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.roseDim,
  },
  rejectQrBtnText: { color: ThemeColors.rose, fontSize: 14 },
  acceptQrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ThemeColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
  },
  acceptQrBtnText: { color: ThemeColors.white, fontSize: 14 },
});
