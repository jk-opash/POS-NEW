import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Banknote,
  Check,
  CreditCard,
  Smartphone,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const PAYMENT_METHODS = [
  { id: "Prepaid", icon: CreditCard, label: "Platform Pre-paid" },
  { id: "Cash", icon: Banknote, label: "Cash" },
  { id: "Card", icon: CreditCard, label: "Card" },
  { id: "UPI", icon: Smartphone, label: "UPI" },
];

export function OnlineOrderPaymentModal({
  visible,
  order,
  onClose,
  onComplete,
}) {
  const [selectedMethod, setSelectedMethod] = useState("Prepaid");

  useEffect(() => {
    if (visible && order) {
      // Default to Prepaid for typical online orders
      setSelectedMethod("Prepaid");
    }
  }, [visible, order]);

  if (!visible || !order) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                Dispatch Order
              </Text>
              <Text style={styles.subtitle}>
                {order.platform} #
                {order.orderId?.split("-")[1] || order.orderId}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Amount to Collect / Paid</Text>
              <Text weight="bold" style={styles.totalValue}>
                ₹{order.total?.toFixed(2)}
              </Text>
            </View>

            <Text weight="semibold" style={styles.sectionTitle}>
              Select Payment Method
            </Text>

            <View style={styles.methodsGrid}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      isSelected && styles.methodCardSelected,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    <Icon
                      size={24}
                      color={
                        isSelected
                          ? ThemeColors.primary
                          : ThemeColors.textSecondary
                      }
                    />
                    <Text
                      weight={isSelected ? "bold" : "medium"}
                      style={[
                        styles.methodText,
                        isSelected && styles.methodTextSelected,
                      ]}
                    >
                      {method.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check
                          size={14}
                          color={ThemeColors.white}
                          strokeWidth={3}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => {
                onComplete({
                  ...order,
                  paymentMethods: [
                    { method: selectedMethod, amount: order.total },
                  ],
                });
              }}
            >
              <Text weight="bold" style={styles.payBtnText}>
                Confirm & Dispatch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.xl,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: ThemeSpacing.lg,
  },
  totalBox: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.xl,
    borderRadius: ThemeRadius.lg,
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  totalLabel: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    color: ThemeColors.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  methodCard: {
    width: "48%",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
  },
  methodCardSelected: {
    borderColor: ThemeColors.primary,
    backgroundColor: ThemeColors.primary + "0A",
  },
  methodText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: "center",
  },
  methodTextSelected: {
    color: ThemeColors.primary,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  payBtn: {
    backgroundColor: ThemeColors.primary,
    paddingVertical: 16,
    borderRadius: ThemeRadius.full,
    alignItems: "center",
  },
  payBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
