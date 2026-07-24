import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Banknote, CreditCard, Smartphone, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

function ZigZagEdge({ width }) {
  // A simple repeating zigzag pattern
  return (
    <View
      style={{ height: 12, width: "100%", overflow: "hidden", marginTop: -1 }}
    >
      <Svg
        width="100%"
        height="12"
        viewBox="0 0 800 12"
        preserveAspectRatio="none"
      >
        <Path
          d={`M0,0 ${Array.from({ length: 40 })
            .map((_, i) => `L${(i + 0.5) * 20},12 L${(i + 1) * 20},0`)
            .join(" ")}`}
          fill={ThemeColors.surfaceElevated}
        />
      </Svg>
    </View>
  );
}

export function PaymentModal({
  visible,
  onClose,
  order,
  viewMode = "payment",
}) {
  const { isMobile, isMiniTab } = useResponsive();
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("cash");

  const PAYMENT_METHODS = [
    { id: "cash", label: "Cash", Icon: Banknote },
    { id: "card", label: "Card", Icon: CreditCard },
    { id: "wallet", label: "E-Wallet", Icon: Smartphone },
  ];

  if (!order) return null;

  const discountVal = parseFloat(discount) || 0;
  const subtotal = order.total;
  const tax = subtotal * 0.05;
  const finalTotal = Math.max(0, subtotal + tax - discountVal);

  const modalWidth =
    viewMode === "receipt"
      ? isMobile || isMiniTab
        ? "100%"
        : 450
      : isMobile || isMiniTab
        ? "100%"
        : 750;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile || isMiniTab ? "slide" : "fade"}
    >
      <View
        style={[
          styles.overlay,
          (isMobile || isMiniTab) && { justifyContent: "flex-end", padding: 0 },
        ]}
      >
        <View
          style={[
            styles.container,
            { width: modalWidth },
            (isMobile || isMiniTab) && {
              maxHeight: "80%",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              paddingBottom: ThemeSpacing.xl + 20,
            },
          ]}
        >
          {/* ── Header ──────────────────────────────────────── */}
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              {viewMode === "receipt" ? "Order Details" : "Take Payment"}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.content,
                (isMobile || isMiniTab) && { flexDirection: "column" },
              ]}
            >
              {/* ── Left Column: Receipt ──────────────────────── */}
              <View
                style={[
                  styles.leftCol,
                  (isMobile || isMiniTab || viewMode === "receipt") && {
                    borderRightWidth: 0,
                    paddingRight: 0,
                    paddingBottom: viewMode === "receipt" ? 0 : ThemeSpacing.lg,
                  },
                ]}
              >
                <Text weight="bold" style={styles.sectionTitle}>
                  Customer Info
                </Text>
                <View style={styles.customerRow}>
                  <View style={styles.avatar}>
                    <Text weight="bold" style={styles.avatarText}>
                      {order.type === "Takeaway"
                        ? order.customer.name.substring(0, 2).toUpperCase()
                        : order.table || "TB"}
                    </Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text weight="bold" style={styles.customerName}>
                      {order.type === "Takeaway"
                        ? order.customer.name
                        : `Table ${order.table || order.customer.initials}`}
                    </Text>
                    <Text weight="regular" style={styles.customerMeta}>
                      Order #{order.id} / {order.type}
                    </Text>
                  </View>
                  <View style={styles.dateTime}>
                    <Text weight="regular" style={styles.dateText}>
                      {order.date}
                    </Text>
                    <Text weight="regular" style={styles.timeText}>
                      {order.time}
                    </Text>
                  </View>
                </View>

                {/* Receipt Card */}
                <View style={styles.receiptContainer}>
                  <View style={styles.receiptBody}>
                    <Text weight="bold" style={styles.sectionTitle}>
                      Transaction Details
                    </Text>

                    <ScrollView
                      style={styles.itemsScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {order.items.map((item, i) => (
                        <View key={i} style={styles.itemRow}>
                          <View style={{ flex: 1 }}>
                            <Text weight="medium" style={styles.itemName}>
                              {item.name}
                            </Text>
                            <Text weight="semibold" style={styles.itemPrice}>
                              ₹{item.price.toFixed(2)}
                            </Text>
                          </View>
                          <Text weight="bold" style={styles.itemQty}>
                            {item.qty}x
                          </Text>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.subtotalRow}>
                      <Text weight="medium" style={styles.subtotalLabel}>
                        Items ({order.items.length})
                      </Text>
                      <Text weight="semibold" style={styles.subtotalVal}>
                        ₹{order.total.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text weight="medium" style={styles.subtotalLabel}>
                        Tax (5%)
                      </Text>
                      <Text weight="semibold" style={styles.subtotalVal}>
                        ₹{tax.toFixed(2)}
                      </Text>
                    </View>

                    {discountVal > 0 && (
                      <View style={styles.subtotalRow}>
                        <Text weight="medium" style={styles.subtotalLabel}>
                          Discount
                        </Text>
                        <Text
                          weight="semibold"
                          style={[
                            styles.subtotalVal,
                            { color: ThemeColors.red || ThemeColors.red },
                          ]}
                        >
                          -₹{discountVal.toFixed(2)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                      <Text weight="bold" style={styles.totalLabel}>
                        Total
                      </Text>
                      <Text weight="extrabold" style={styles.totalVal}>
                        ₹{finalTotal.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <ZigZagEdge />
                </View>
              </View>
              {/* ── Right Column: Payment Options ─────────────── */}
              {viewMode !== "receipt" && (
                <View
                  style={[
                    styles.rightCol,
                    (isMobile || isMiniTab) && {
                      paddingLeft: 0,
                      paddingTop: ThemeSpacing.lg,
                      borderTopWidth: 1,
                      borderTopColor: ThemeColors.border,
                    },
                  ]}
                >
                  <View style={styles.paymentSection}>
                    <Text weight="bold" style={styles.sectionTitle}>
                      Select a payment method
                    </Text>

                    <View style={styles.methodsRow}>
                      {PAYMENT_METHODS.map((method) => {
                        const isActive = selectedMethod === method.id;
                        const Icon = method.Icon;
                        return (
                          <TouchableOpacity
                            key={method.id}
                            style={[
                              styles.paymentMethodCard,
                              isActive && styles.paymentMethodCardActive,
                            ]}
                            onPress={() => setSelectedMethod(method.id)}
                            activeOpacity={0.8}
                          >
                            <Icon
                              size={20}
                              color={
                                isActive
                                  ? ThemeColors.emerald
                                  : ThemeColors.textSecondary
                              }
                            />
                            <Text
                              weight={isActive ? "semibold" : "medium"}
                              style={[
                                styles.paymentMethodText,
                                isActive && styles.paymentMethodTextActive,
                              ]}
                            >
                              {method.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text weight="bold" style={styles.sectionTitle}>
                      Discount
                    </Text>
                    <View style={styles.inputContainer}>
                      <Text
                        weight="semibold"
                        style={styles.currencySymbolInput}
                      >
                        ₹
                      </Text>
                      <TextInput
                        style={styles.amountInput}
                        value={discount}
                        onChangeText={setDiscount}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor={ThemeColors.textMuted}
                      />
                    </View>

                    <Text weight="bold" style={styles.sectionTitle}>
                      Amount
                    </Text>
                    <View style={styles.inputContainer}>
                      <Text
                        weight="semibold"
                        style={styles.currencySymbolInput}
                      >
                        ₹
                      </Text>
                      <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor={ThemeColors.textMuted}
                      />
                      <TouchableOpacity
                        style={styles.copyTotalBtn}
                        onPress={() => setAmount(finalTotal.toFixed(2))}
                      >
                        <Text weight="semibold" style={styles.copyTotalText}>
                          Exact
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.payBtn} onPress={onClose}>
                      <Text weight="bold" style={styles.payBtnText}>
                        Pay Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
  },
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.xl,
    maxHeight: "95%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: 20,
  },
  content: {
    flexDirection: "row",
  },
  leftCol: {
    flex: 1.2,
    paddingRight: ThemeSpacing.xl,
    borderRightWidth: 1,
    borderColor: ThemeColors.border,
  },
  rightCol: {
    flex: 1,
    paddingLeft: ThemeSpacing.xl,
  },
  paymentSection: {
    // Let it size to content
  },
  sectionTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: ThemeColors.emerald,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.md,
  },
  avatarText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  customerMeta: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
  dateTime: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
  timeText: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
  receiptContainer: {
    marginTop: ThemeSpacing.md,
  },
  receiptBody: {
    backgroundColor: ThemeColors.surfaceElevated,
    borderTopLeftRadius: ThemeRadius.md,
    borderTopRightRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
  },
  itemsScroll: {
    maxHeight: 200,
    marginBottom: ThemeSpacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  itemName: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  itemQty: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  subtotalLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  subtotalVal: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  methodsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.xl,
  },
  paymentMethodCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
  },
  paymentMethodCardActive: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  paymentMethodText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginLeft: ThemeSpacing.sm,
  },
  paymentMethodTextActive: {
    color: ThemeColors.emerald,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    marginBottom: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surface,
  },
  currencySymbolInput: {
    fontSize: 18,
    color: ThemeColors.textSecondary,
    marginRight: ThemeSpacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Outfit_500Medium",
    color: ThemeColors.textPrimary,
    paddingVertical: ThemeSpacing.md,
  },
  copyTotalBtn: {
    backgroundColor: ThemeColors.emeraldDim,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.sm,
    marginLeft: ThemeSpacing.sm,
  },
  copyTotalText: {
    color: ThemeColors.emerald,
    fontSize: 13,
  },
  payBtn: {
    backgroundColor: ThemeColors.amber,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  payBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
