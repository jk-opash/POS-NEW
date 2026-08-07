import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Receipt,
  Send,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export function EBillCheckoutModal({ visible, onClose, onComplete }) {
  const posState = useSelector((state) => state.pos) || {};
  const {
    cart = [],
    runningOrder = [],
    totals = { subtotal: 0, taxAmount: 0, discount: 0, grandTotal: 0 },
    activeTable = null,
    customer = null,
    taxRate = 0,
  } = posState;

  const clearCart = () => {};
  const addOrder = () => {};
  const completeTableOrdersInKDS = () => {};
  const completeOrderInKDS = () => {};
  const activeOrders = [];

  // Payment state
  const [paymentMethods, setPaymentMethods] = useState([
    { method: "Cash", amount: totals.grandTotal.toString() },
  ]);
  const [showSplitPayment, setShowSplitPayment] = useState(false);

  // Contact state
  const [phone, setPhone] = useState(
    customer?.phone?.replace(/[^0-9+]/g, "") || "",
  );
  const [email, setEmail] = useState(customer?.email || "");

  // Step state
  const [step, setStep] = useState("checkout"); // "checkout" | "success"

  const totalPaid = paymentMethods.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0,
  );
  const remaining = totals.grandTotal - totalPaid;

  const methods = ["Cash", "Card", "UPI"];

  const handleUpdateAmount = (index, value) => {
    const updated = [...paymentMethods];
    updated[index].amount = value;
    setPaymentMethods(updated);
  };

  const handleUpdateMethod = (index, method) => {
    const updated = [...paymentMethods];
    updated[index].method = method;
    setPaymentMethods(updated);
  };

  const handleRemoveMethod = (index) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handleAddMethod = () => {
    setPaymentMethods([...paymentMethods, { method: "Card", amount: "" }]);
  };

  const validatePhone = (val) =>
    !val.trim() || /^[+]?[0-9]{7,15}$/.test(val.trim());
  const validateEmail = (val) =>
    !val.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleCompleteAndSend = () => {
    if (Math.abs(remaining) > 0.01) {
      showAlert("Invalid Amount", "Total paid must equal the grand total.");
      return;
    }
    if (!validatePhone(phone)) {
      showAlert(
        "Invalid Number",
        "Please enter a valid phone number or leave it empty.",
      );
      return;
    }
    if (!validateEmail(email)) {
      showAlert(
        "Invalid Email",
        "Please enter a valid email address or leave it empty.",
      );
      return;
    }
    if (!phone.trim() && !email.trim()) {
      showAlert(
        "Contact Required",
        "Please enter at least a phone number or email to send the eBill.",
      );
      return;
    }

    const order = {
      id: `ORD-${Date.now()}`,
      items: [...runningOrder, ...cart],
      totals,
      paymentMethods,
      customer: customer || { name: "Walk-in", phone: phone, email: email },
      ebillContact: { phone: phone.trim(), email: email.trim() },
      status: "Completed",
      date: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();

    // Clear KDS tickets
    if (activeTable) {
      completeTableOrdersInKDS(activeTable.name);
    } else {
      const runningIds = new Set(runningOrder.map((i) => i.id));
      activeOrders.forEach((o) => {
        const hasItem = o.items && o.items.some((i) => runningIds.has(i.id));
        if (hasItem) completeOrderInKDS(o.id);
      });
    }

    setStep("success");
    if (onComplete) onComplete(order, "ebill");
  };

  const handleClose = () => {
    setStep("checkout");
    setPaymentMethods([
      { method: "Cash", amount: totals.grandTotal.toString() },
    ]);
    setPhone(customer?.phone?.replace(/[^0-9+]/g, "") || "");
    setEmail(customer?.email || "");
    setShowSplitPayment(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* ── Header ──────────────────────────── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Receipt size={18} color={ThemeColors.accent} />
              </View>
              <View>
                <Text weight="bold" style={styles.title}>
                  Save & eBill
                </Text>
                <Text style={styles.subtitle}>
                  Complete payment & send digital receipt
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {step === "checkout" ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              {/* ── Order Summary ────────────────── */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text weight="semibold" style={styles.summaryValue}>
                    ₹{(totals.subtotal || 0).toFixed(2)}
                  </Text>
                </View>
                {(totals.discountAmount || 0) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text
                      weight="semibold"
                      style={[
                        styles.summaryValue,
                        { color: ThemeColors.emerald },
                      ]}
                    >
                      − ₹{(totals.discountAmount || 0).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    SGST ({(taxRate / 2).toFixed(1)}%)
                  </Text>
                  <Text weight="semibold" style={styles.summaryValue}>
                    ₹{((totals.taxAmount || 0) / 2).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    CGST ({(taxRate / 2).toFixed(1)}%)
                  </Text>
                  <Text weight="semibold" style={styles.summaryValue}>
                    ₹{((totals.taxAmount || 0) / 2).toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text weight="bold" style={styles.totalLabel}>
                    Grand Total
                  </Text>
                  <Text weight="bold" style={styles.totalValue}>
                    ₹{(totals.grandTotal || 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* ── Payment Method ───────────────── */}
              <View style={styles.sectionCard}>
                <Text weight="semibold" style={styles.sectionTitle}>
                  Payment Method
                </Text>

                {/* Quick method selector for first method */}
                <View style={styles.quickMethodRow}>
                  {methods.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.quickMethodBtn,
                        paymentMethods[0]?.method === m &&
                          styles.quickMethodBtnActive,
                      ]}
                      onPress={() => handleUpdateMethod(0, m)}
                      activeOpacity={0.8}
                    >
                      <Text
                        weight="semibold"
                        style={[
                          styles.quickMethodText,
                          paymentMethods[0]?.method === m &&
                            styles.quickMethodTextActive,
                        ]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Amount input for first method */}
                <View style={styles.amountRow}>
                  <Text style={styles.amountCurrency}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={paymentMethods[0]?.amount}
                    onChangeText={(v) => handleUpdateAmount(0, v)}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={ThemeColors.textMuted}
                  />
                </View>

                {/* Split payment toggle */}
                <TouchableOpacity
                  style={styles.splitToggle}
                  onPress={() => setShowSplitPayment(!showSplitPayment)}
                >
                  <Text style={styles.splitToggleText}>+ Split Payment</Text>
                  {showSplitPayment ? (
                    <ChevronUp size={14} color={ThemeColors.accent} />
                  ) : (
                    <ChevronDown size={14} color={ThemeColors.accent} />
                  )}
                </TouchableOpacity>

                {showSplitPayment &&
                  paymentMethods.slice(1).map((pm, idx) => {
                    const realIdx = idx + 1;
                    return (
                      <View key={realIdx} style={styles.splitRow}>
                        <View style={styles.splitMethodRow}>
                          {methods.map((m) => (
                            <TouchableOpacity
                              key={m}
                              style={[
                                styles.quickMethodBtn,
                                pm.method === m && styles.quickMethodBtnActive,
                                { flex: 1 },
                              ]}
                              onPress={() => handleUpdateMethod(realIdx, m)}
                            >
                              <Text
                                style={[
                                  styles.quickMethodText,
                                  pm.method === m &&
                                    styles.quickMethodTextActive,
                                ]}
                              >
                                {m}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.splitAmountRow}>
                          <Text style={styles.amountCurrency}>₹</Text>
                          <TextInput
                            style={[styles.amountInput, { flex: 1 }]}
                            value={pm.amount}
                            onChangeText={(v) => handleUpdateAmount(realIdx, v)}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor={ThemeColors.textMuted}
                          />
                          <TouchableOpacity
                            onPress={() => handleRemoveMethod(realIdx)}
                            style={styles.removeBtn}
                          >
                            <X size={18} color={ThemeColors.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                {showSplitPayment && (
                  <TouchableOpacity
                    style={styles.addSplitBtn}
                    onPress={handleAddMethod}
                  >
                    <Text style={styles.addSplitText}>
                      + Add Another Method
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Remaining balance */}
                <View
                  style={[
                    styles.balanceRow,
                    remaining !== 0 && {
                      backgroundColor:
                        remaining > 0
                          ? ThemeColors.red + "12"
                          : ThemeColors.emerald + "12",
                    },
                  ]}
                >
                  <Text style={styles.balanceLabel}>Remaining Balance</Text>
                  <Text
                    weight="bold"
                    style={[
                      styles.balanceValue,
                      remaining > 0
                        ? { color: ThemeColors.red }
                        : remaining < 0
                          ? { color: ThemeColors.emerald }
                          : { color: ThemeColors.textPrimary },
                    ]}
                  >
                    ₹{remaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* ── Send eBill To ────────────────── */}
              <Text style={styles.contactSectionLabel}>
                Send eBill to customer
              </Text>

              {/* SMS */}
              <View style={styles.channelCard}>
                <View style={styles.channelHeader}>
                  <View
                    style={[
                      styles.channelIcon,
                      { backgroundColor: ThemeColors.emerald + "20" },
                    ]}
                  >
                    <MessageSquare size={14} color={ThemeColors.emerald} />
                  </View>
                  <Text weight="semibold" style={styles.channelTitle}>
                    SMS / WhatsApp
                  </Text>
                </View>
                <View style={styles.contactInputWrap}>
                  <Phone size={14} color={ThemeColors.textMuted} />
                  <TextInput
                    style={styles.contactInput}
                    placeholder="+91 9876543210 (optional)"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.channelCard}>
                <View style={styles.channelHeader}>
                  <View
                    style={[
                      styles.channelIcon,
                      { backgroundColor: ThemeColors.blue + "20" },
                    ]}
                  >
                    <Mail size={14} color={ThemeColors.blue} />
                  </View>
                  <Text weight="semibold" style={styles.channelTitle}>
                    Email
                  </Text>
                </View>
                <View style={styles.contactInputWrap}>
                  <Mail size={14} color={ThemeColors.textMuted} />
                  <TextInput
                    style={styles.contactInput}
                    placeholder="customer@example.com (optional)"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </ScrollView>
          ) : (
            /* ── Success Step ──────────────────── */
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <Check size={40} color={ThemeColors.emerald} />
              </View>
              <Text weight="bold" style={styles.successTitle}>
                Payment Complete!
              </Text>
              <Text style={styles.successDesc}>
                Order has been completed and the eBill has been sent to the
                customer.
              </Text>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text weight="bold" style={styles.doneBtnText}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Footer ─────────────────────────── */}
          {step === "checkout" && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.completeBtn,
                  Math.abs(remaining) > 0.01 && styles.completeBtnDisabled,
                ]}
                onPress={handleCompleteAndSend}
                activeOpacity={0.85}
              >
                <Send size={18} color={ThemeColors.white} />
                <Text weight="bold" style={styles.completeBtnText}>
                  Complete & Send eBill
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: ThemeColors.surface,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    maxHeight: "94%",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.accent + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 17, color: ThemeColors.textPrimary },
  subtitle: { fontSize: 12, color: ThemeColors.textMuted, marginTop: 1 },
  closeBtn: {
    padding: 8,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.bg,
  },
  content: {
    padding: ThemeSpacing.lg,
    paddingBottom: 10,
    gap: ThemeSpacing.md,
  },

  // Summary
  summaryCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: ThemeColors.textSecondary },
  summaryValue: { fontSize: 13, color: ThemeColors.textPrimary },
  totalRow: {
    marginTop: ThemeSpacing.sm,
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  totalLabel: { fontSize: 15, color: ThemeColors.textPrimary },
  totalValue: { fontSize: 20, color: ThemeColors.accent },

  // Payment
  sectionCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  sectionTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  quickMethodRow: { flexDirection: "row", gap: ThemeSpacing.sm },
  quickMethodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
  },
  quickMethodBtnActive: {
    borderColor: ThemeColors.accent,
    backgroundColor: ThemeColors.accent + "15",
  },
  quickMethodText: { fontSize: 13, color: ThemeColors.textSecondary },
  quickMethodTextActive: { color: ThemeColors.accent },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
    height: 48,
    gap: ThemeSpacing.sm,
  },
  amountCurrency: { fontSize: 18, color: ThemeColors.textSecondary },
  amountInput: {
    flex: 1,
    fontSize: 22,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  splitToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  splitToggleText: { fontSize: 13, color: ThemeColors.accent },
  splitRow: { gap: ThemeSpacing.sm },
  splitMethodRow: { flexDirection: "row", gap: ThemeSpacing.sm },
  splitAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  removeBtn: { padding: 6 },
  addSplitBtn: { alignSelf: "flex-start" },
  addSplitText: { fontSize: 13, color: ThemeColors.textMuted },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surface,
  },
  balanceLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  balanceValue: { fontSize: 18 },

  // Contact
  contactSectionLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: ThemeSpacing.sm,
  },
  channelCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.md,
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  channelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  channelIcon: {
    width: 26,
    height: 26,
    borderRadius: ThemeRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  channelTitle: { fontSize: 13, color: ThemeColors.textPrimary },
  contactInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
    height: 42,
  },
  contactInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },

  // Footer
  footer: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  completeBtn: {
    backgroundColor: ThemeColors.accent,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    gap: ThemeSpacing.sm,
  },
  completeBtnDisabled: { opacity: 0.5 },
  completeBtnText: { color: ThemeColors.white, fontSize: 16 },

  // Success
  successContent: {
    alignItems: "center",
    padding: ThemeSpacing.xxxl,
    gap: ThemeSpacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.emerald + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  successTitle: { fontSize: 22, color: ThemeColors.textPrimary },
  successDesc: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: ThemeSpacing.lg,
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.xxxl,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.lg,
  },
  doneBtnText: { color: ThemeColors.white, fontSize: 16 },
});
