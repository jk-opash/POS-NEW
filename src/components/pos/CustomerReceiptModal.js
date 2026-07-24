import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Printer, X } from "lucide-react-native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export function CustomerReceiptModal({ visible, order, onClose }) {
  if (!visible || !order) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              Customer Receipt
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.receipt}>
              <Text weight="bold" style={styles.brandName}>
                SPICE GARDEN
              </Text>
              <Text style={styles.receiptType}>--- TAX INVOICE ---</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Order No: {order.id}</Text>
                <Text style={styles.metaText}>
                  {new Date(order.date).toLocaleDateString()}{" "}
                  {new Date(order.date).toLocaleTimeString()}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.tableHeader}>
                <Text weight="bold" style={[styles.columnItem, { flex: 3 }]}>
                  Item
                </Text>
                <Text weight="bold" style={styles.columnQty}>
                  Qty
                </Text>
                <Text weight="bold" style={styles.columnPrice}>
                  Amount
                </Text>
              </View>

              <View style={styles.divider} />

              {order.items.map((item, index) => {
                let itemPrice =
                  item.product.pricing?.sellingPrice || item.product.price || 0;
                if (item.variant) itemPrice = item.variant.price;
                if (item.addons) {
                  item.addons.forEach((a) => {
                    if (a && a.price) itemPrice += a.price;
                  });
                }
                const itemTotal = itemPrice * item.quantity;

                return (
                  <View key={index} style={styles.itemRow}>
                    <View style={{ flex: 3 }}>
                      <Text style={styles.itemName}>
                        {item.product.name}{" "}
                        {item.variant ? `(${item.variant.name})` : ""}
                      </Text>
                    </View>
                    <Text style={styles.itemQty}>{item.quantity}</Text>
                    <Text style={styles.itemPrice}>
                      ₹{itemTotal.toFixed(2)}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.divider} />

              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>
                  ₹{order.totals.subtotal.toFixed(2)}
                </Text>
              </View>
              {order.totals.discountAmount > 0 && (
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Discount</Text>
                  <Text style={styles.totalsValue}>
                    -₹{order.totals.discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax</Text>
                <Text style={styles.totalsValue}>
                  ₹{order.totals.taxAmount.toFixed(2)}
                </Text>
              </View>

              <View style={[styles.divider, { borderStyle: "solid" }]} />

              <View style={styles.totalsRow}>
                <Text weight="bold" style={styles.grandTotalLabel}>
                  GRAND TOTAL
                </Text>
                <Text weight="bold" style={styles.grandTotalValue}>
                  ₹{order.totals.grandTotal.toFixed(2)}
                </Text>
              </View>

              {order.paymentMethods && order.paymentMethods.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text
                    weight="semibold"
                    style={[styles.totalsLabel, { marginBottom: 4 }]}
                  >
                    Payments
                  </Text>
                  {order.paymentMethods.map((pm, i) => (
                    <View key={i} style={styles.totalsRow}>
                      <Text style={styles.totalsLabel}>
                        {pm.label ? `${pm.label} (${pm.method})` : pm.method}
                      </Text>
                      <Text style={styles.totalsValue}>
                        ₹{parseFloat(pm.amount || 0).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.divider} />
              <Text style={styles.footerText}>Thank you for your visit!</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.printBtn} onPress={onClose}>
              <Printer size={18} color={ThemeColors.white} />
              <Text weight="bold" style={styles.printBtnText}>
                Receipt Ready
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
    padding: ThemeSpacing.md,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: ThemeSpacing.xl,
    backgroundColor: "#F9F9F9",
  },
  receipt: {
    backgroundColor: ThemeColors.white,
    padding: ThemeSpacing.xl,
    borderRadius: ThemeRadius.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brandName: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  receiptType: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: ThemeSpacing.lg,
    color: ThemeColors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.md,
    borderStyle: "dashed",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnItem: {
    fontSize: 12,
  },
  columnQty: {
    fontSize: 12,
    width: 30,
    textAlign: "center",
  },
  columnPrice: {
    fontSize: 12,
    width: 60,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  itemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  itemQty: {
    fontSize: 14,
    width: 30,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 14,
    width: 60,
    textAlign: "right",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  totalsValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  grandTotalLabel: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: ThemeSpacing.md,
  },
  footer: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  printBtn: {
    backgroundColor: ThemeColors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
  },
  printBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
