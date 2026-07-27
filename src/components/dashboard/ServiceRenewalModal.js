import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, Clock, CheckCircle2, ShieldCheck, Smartphone, Globe, MonitorPlay, AlertTriangle } from "lucide-react-native";
import { showAlert } from "@/utils/alert";

export function ServiceRenewalModal({ visible, onClose }) {
  const daysRemaining = 14; // Mock value
  const isExpiringSoon = daysRemaining <= 15;

  const handleRenew = () => {
    showAlert("Renewal Requested", "Our support team will contact you shortly to process your renewal.");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>Service Renewal</Text>
              <Text style={styles.subtitle}>Manage your POS subscription & licenses</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Status Card */}
            <View style={[styles.statusCard, isExpiringSoon ? styles.statusCardWarning : styles.statusCardSuccess]}>
              <View style={styles.statusHeader}>
                <View style={styles.statusTitleRow}>
                  {isExpiringSoon ? (
                    <AlertTriangle size={24} color={ThemeColors.red} />
                  ) : (
                    <ShieldCheck size={24} color={ThemeColors.emerald} />
                  )}
                  <View>
                    <Text weight="bold" style={styles.planName}>Pro Tier License</Text>
                    <Text style={styles.planStatus}>
                      {isExpiringSoon ? "Expiring Soon" : "Active"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.expiryBox}>
                <Clock size={16} color={ThemeColors.textSecondary} style={{ marginTop: 1 }} />
                <View style={styles.expiryTextCol}>
                  <Text weight="medium" style={styles.expiryValue}>
                    {daysRemaining} Days Remaining
                  </Text>
                  <Text style={styles.expiryDate}>Expires on Aug 10, 2026</Text>
                </View>
              </View>
            </View>

            {/* Active Add-ons */}
            <Text weight="bold" style={styles.sectionTitle}>Active Add-on Modules</Text>
            <View style={styles.addonsList}>
              
              <View style={styles.addonCard}>
                <View style={styles.addonIconBox}>
                  <Smartphone size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.addonInfo}>
                  <Text weight="semibold" style={styles.addonName}>Waiter App Devices</Text>
                  <Text style={styles.addonDesc}>5 Active Devices</Text>
                </View>
                <CheckCircle2 size={20} color={ThemeColors.emerald} />
              </View>

              <View style={styles.addonCard}>
                <View style={styles.addonIconBox}>
                  <Globe size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.addonInfo}>
                  <Text weight="semibold" style={styles.addonName}>Online Ordering Sync</Text>
                  <Text style={styles.addonDesc}>Zomato & Swiggy Integration</Text>
                </View>
                <CheckCircle2 size={20} color={ThemeColors.emerald} />
              </View>

              <View style={styles.addonCard}>
                <View style={styles.addonIconBox}>
                  <MonitorPlay size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.addonInfo}>
                  <Text weight="semibold" style={styles.addonName}>Kitchen Display System</Text>
                  <Text style={styles.addonDesc}>2 Active Screens</Text>
                </View>
                <CheckCircle2 size={20} color={ThemeColors.emerald} />
              </View>

            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="semibold" style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.renewBtn} onPress={handleRenew}>
              <Text weight="bold" style={styles.renewText}>Renew License Now</Text>
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
  modalContainer: {
    backgroundColor: ThemeColors.bg,
    width: "90%",
    maxWidth: 450,
    maxHeight: "85%",
    borderRadius: ThemeRadius.xl,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  body: {
    flexShrink: 1,
  },
  scrollContent: {
    padding: ThemeSpacing.xl,
  },
  statusCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.xxl,
  },
  statusCardWarning: {
    borderColor: ThemeColors.red + "40",
    backgroundColor: ThemeColors.red + "05",
  },
  statusCardSuccess: {
    borderColor: ThemeColors.emerald + "40",
    backgroundColor: ThemeColors.emerald + "05",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  statusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  planName: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  planStatus: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  expiryBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
  },
  expiryTextCol: {
    gap: 2,
  },
  expiryValue: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  expiryDate: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  addonsList: {
    gap: ThemeSpacing.md,
  },
  addonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  addonIconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.md,
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  addonDesc: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    justifyContent: "flex-end",
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
  },
  cancelText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  renewBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
  },
  renewText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
