import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  X,
  Send,
  Mail,
  Phone,
  Check,
  Receipt,
  MessageSquare,
  ChevronRight,
} from "lucide-react-native";

export function EBillModal({ visible, order, onClose }) {
  const [step, setStep] = useState("contact"); // "contact" | "sent"
  const [contactType, setContactType] = useState("Phone");
  const [phone, setPhone] = useState(
    order?.customer?.phone?.replace(/[^0-9+]/g, "") || ""
  );
  const [email, setEmail] = useState(order?.customer?.email || "");
  const [sendingSMS, setSendingSMS] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!visible || !order) return null;

  const totals = order.totals || {};

  const validatePhone = (val) => /^[+]?[0-9]{7,15}$/.test(val.trim());
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSendSMS = () => {
    if (!validatePhone(phone)) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }
    setSendingSMS(true);
    setTimeout(() => {
      setSendingSMS(false);
      setStep("sent");
    }, 1200);
  };

  const handleSendEmail = () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      setStep("sent");
    }, 1200);
  };

  const handleClose = () => {
    setStep("contact");
    setPhone(order?.customer?.phone?.replace(/[^0-9+]/g, "") || "");
    setEmail(order?.customer?.email || "");
    setSendingSMS(false);
    setSendingEmail(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* ── Header ─────────────────────────── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Receipt size={18} color={ThemeColors.accent} />
              </View>
              <View>
                <Text weight="bold" style={styles.title}>
                  Send eBill
                </Text>
                <Text style={styles.subtitle}>Order #{order.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {step === "contact" ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {/* ── Invoice Summary ──────────────── */}
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
                    <Text weight="semibold" style={[styles.summaryValue, { color: ThemeColors.emerald }]}>
                      − ₹{(totals.discountAmount || 0).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text weight="semibold" style={styles.summaryValue}>
                    ₹{(totals.taxAmount || 0).toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text weight="bold" style={styles.totalLabel}>Total Paid</Text>
                  <Text weight="bold" style={styles.totalValue}>
                    ₹{(totals.grandTotal || 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Send to customer via</Text>

              {/* ── SMS Section ─────────────────── */}
              <View style={styles.channelCard}>
                <View style={styles.channelHeader}>
                  <View style={[styles.channelIcon, { backgroundColor: ThemeColors.emerald + "20" }]}>
                    <MessageSquare size={16} color={ThemeColors.emerald} />
                  </View>
                  <Text weight="semibold" style={styles.channelTitle}>
                    SMS / WhatsApp
                  </Text>
                </View>
                <View style={styles.inputRow}>
                  <View style={styles.inputWrap}>
                    <Phone size={15} color={ThemeColors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+91 9876543210"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.sendBtn, { backgroundColor: ThemeColors.emerald }, sendingSMS && styles.sendBtnLoading]}
                    onPress={handleSendSMS}
                    disabled={sendingSMS}
                    activeOpacity={0.8}
                  >
                    {sendingSMS ? (
                      <Text weight="bold" style={styles.sendBtnText}>Sending…</Text>
                    ) : (
                      <>
                        <Send size={14} color={ThemeColors.white} />
                        <Text weight="bold" style={styles.sendBtnText}>Send</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── Email Section ────────────────── */}
              <View style={styles.channelCard}>
                <View style={styles.channelHeader}>
                  <View style={[styles.channelIcon, { backgroundColor: ThemeColors.blue + "20" }]}>
                    <Mail size={16} color={ThemeColors.blue} />
                  </View>
                  <Text weight="semibold" style={styles.channelTitle}>
                    Email
                  </Text>
                </View>
                <View style={styles.inputRow}>
                  <View style={styles.inputWrap}>
                    <Mail size={15} color={ThemeColors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="customer@example.com"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.sendBtn, { backgroundColor: ThemeColors.blue }, sendingEmail && styles.sendBtnLoading]}
                    onPress={handleSendEmail}
                    disabled={sendingEmail}
                    activeOpacity={0.8}
                  >
                    {sendingEmail ? (
                      <Text weight="bold" style={styles.sendBtnText}>Sending…</Text>
                    ) : (
                      <>
                        <Send size={14} color={ThemeColors.white} />
                        <Text weight="bold" style={styles.sendBtnText}>Send</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.skipBtn} onPress={handleClose}>
                <Text style={styles.skipBtnText}>Skip & Close</Text>
                <ChevronRight size={14} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </ScrollView>
          ) : (
            /* ── Success Step ──────────────────── */
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <Check size={36} color={ThemeColors.emerald} />
              </View>
              <Text weight="bold" style={styles.successTitle}>eBill Sent!</Text>
              <Text style={styles.successDesc}>
                The digital receipt has been delivered to your customer successfully.
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text weight="bold" style={styles.doneBtnText}>Done</Text>
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
    maxHeight: "92%",
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
    width: 36,
    height: 36,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.accent + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    padding: 8,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.bg,
  },
  content: {
    padding: ThemeSpacing.lg,
    paddingBottom: 30,
    gap: ThemeSpacing.lg,
  },
  summaryCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  totalRow: {
    marginTop: ThemeSpacing.sm,
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  totalLabel: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    color: ThemeColors.accent,
  },
  sectionTitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  channelCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  channelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  channelIcon: {
    width: 30,
    height: 30,
    borderRadius: ThemeRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  channelTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  inputRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    alignItems: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 44,
    gap: ThemeSpacing.sm,
  },
  inputIcon: {},
  input: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: ThemeSpacing.lg,
    height: 44,
    borderRadius: ThemeRadius.md,
    minWidth: 80,
  },
  sendBtnLoading: {
    opacity: 0.7,
  },
  sendBtnText: {
    color: ThemeColors.white,
    fontSize: 13,
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: ThemeSpacing.sm,
  },
  skipBtnText: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
  // ── Success ──────────────────────────────────────
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
  },
  successTitle: {
    fontSize: 22,
    color: ThemeColors.textPrimary,
  },
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
  doneBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
