import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { ShoppingBag, X } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { PLATFORM_COLORS } from "@/screens/online-orders/OnlineOrdersScreen";
import { OrderActionButtons } from "./OnlineOrderCard";

export function OnlineOrderDetailPanel({ selectedOrder, onClose, onUpdateStatus }) {
  if (!selectedOrder) return null;

  const platColor = PLATFORM_COLORS[selectedOrder.platform];

  return (
    <View style={styles.receiptContainer}>
      <View style={styles.receiptHeader}>
        <TouchableOpacity
          style={styles.receiptCloseBtn}
          onPress={onClose}
        >
          <X size={24} color={ThemeColors.textPrimary} />
        </TouchableOpacity>
        <Text weight="bold" style={styles.receiptTitle}>
          Order Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.receiptScroll}>
        {/* Top Info */}
        <View style={styles.receiptTopInfo}>
          <View
            style={[
              styles.receiptPlatformBadge,
              { backgroundColor: platColor + "20" },
            ]}
          >
            <View
              style={[
                styles.receiptPlatformDot,
                { backgroundColor: platColor },
              ]}
            />
            <Text weight="bold" style={{ color: platColor, fontSize: 13 }}>
              {selectedOrder.platform}
            </Text>
          </View>
          <Text weight="bold" style={styles.receiptOrderId}>
            #{selectedOrder.orderId}
          </Text>
          <Text style={styles.receiptOrderTime}>
            Ordered at {new Date(selectedOrder.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Customer */}
        <View style={styles.receiptSection}>
          <View style={styles.receiptRow}>
            <ShoppingBag size={18} color={ThemeColors.textMuted} />
            <View style={{ marginLeft: 12 }}>
              <Text weight="bold" style={styles.receiptCustomerName}>
                {selectedOrder.customer}
              </Text>
              <Text style={styles.receiptCustomerPhone}>
                {selectedOrder.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View style={styles.receiptSection}>
          <Text weight="bold" style={styles.receiptSectionTitle}>
            ORDER SUMMARY
          </Text>
          {selectedOrder.items.map((item, i) => (
            <View key={i} style={styles.receiptItemRow}>
              <View style={styles.receiptItemLeft}>
                <Text weight="bold" style={styles.receiptItemQty}>
                  {item.qty}x
                </Text>
                <Text style={styles.receiptItemName}>{item.name}</Text>
              </View>
              <Text weight="semibold" style={styles.receiptItemPrice}>
                ₹{(item.price * item.qty).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.receiptSection}>
          <View style={styles.receiptTotalRow}>
            <Text style={styles.receiptTotalLabel}>Item Total</Text>
            <Text style={styles.receiptTotalValue}>
              ₹{selectedOrder.subtotal.toFixed(2)}
            </Text>
          </View>
          {selectedOrder.discount > 0 && (
            <View style={styles.receiptTotalRow}>
              <Text style={styles.receiptTotalLabel}>Discount</Text>
              <Text style={[styles.receiptTotalValue, { color: ThemeColors.emerald }]}>
                -₹{selectedOrder.discount.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.receiptTotalRow}>
            <Text style={styles.receiptTotalLabel}>Taxes & Charges</Text>
            <Text style={styles.receiptTotalValue}>
              ₹{(selectedOrder.packagingCharge + selectedOrder.deliveryCharge + selectedOrder.gst).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.receiptDivider} />
          
          <View style={styles.receiptGrandTotalRow}>
            <Text weight="bold" style={styles.receiptGrandTotalLabel}>
              Grand Total
            </Text>
            <Text weight="bold" style={styles.receiptGrandTotalValue}>
              ₹{selectedOrder.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Instructions & Delivery */}
        <View style={[styles.receiptSection, { borderBottomWidth: 0 }]}>
           {selectedOrder.instructions ? (
            <View style={styles.instructionBox}>
              <Text weight="bold" style={styles.instructionLabel}>Cooking Instructions</Text>
              <Text style={styles.instructionText}>{selectedOrder.instructions}</Text>
            </View>
           ) : null}

          <Text weight="bold" style={[styles.receiptSectionTitle, { marginTop: ThemeSpacing.md }]}>
            DELIVERY
          </Text>
          <Text style={styles.receiptDeliveryAddress}>
            {selectedOrder.deliveryAddress}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.receiptFooter}>
        <OrderActionButtons order={selectedOrder} onUpdateStatus={onUpdateStatus} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptContainer: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
  },
  receiptTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  receiptCloseBtn: {
    padding: ThemeSpacing.xs,
  },
  receiptScroll: {
    padding: ThemeSpacing.xl,
  },
  receiptTopInfo: {
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
  },
  receiptPlatformBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    marginBottom: ThemeSpacing.md,
  },
  receiptPlatformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  receiptOrderId: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  receiptOrderTime: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
  receiptSection: {
    marginBottom: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptCustomerName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  receiptCustomerPhone: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
  receiptSectionTitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.md,
    letterSpacing: 0.5,
  },
  receiptItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.md,
  },
  receiptItemLeft: {
    flexDirection: "row",
    flex: 1,
    paddingRight: ThemeSpacing.md,
  },
  receiptItemQty: {
    width: 24,
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  receiptItemName: {
    flex: 1,
    fontSize: 15,
    color: ThemeColors.textSecondary,
    lineHeight: 22,
  },
  receiptItemPrice: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  receiptTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  receiptTotalLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  receiptTotalValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
    borderStyle: "dashed",
  },
  receiptGrandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptGrandTotalLabel: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  receiptGrandTotalValue: {
    fontSize: 22,
    color: ThemeColors.primary,
  },
  instructionBox: {
    backgroundColor: ThemeColors.amber + "15",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    marginBottom: ThemeSpacing.lg,
  },
  instructionLabel: {
    fontSize: 13,
    color: ThemeColors.amber,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  receiptDeliveryAddress: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
    lineHeight: 22,
  },
  receiptFooter: {
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
});
