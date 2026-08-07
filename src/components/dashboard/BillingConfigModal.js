import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Banknote,
  Image as ImageIcon,
  LayoutGrid,
  Printer,
  ShieldAlert,
  X,
} from "lucide-react-native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

export function BillingConfigModal({ visible, onClose }) {
  const { config = {}, updateConfig = () => {} } = {};

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                Billing Screen Settings
              </Text>
              <Text style={styles.subtitle}>
                Customize the POS checkout experience
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* View Preferences */}
            <Text weight="bold" style={styles.sectionTitle}>
              View Preferences
            </Text>
            <View style={styles.settingsGroup}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  <ImageIcon size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Show Item Images
                  </Text>
                  <Text style={styles.settingDesc}>
                    Display product images on the menu grid.
                  </Text>
                </View>
                <Switch
                  value={config.showItemImages}
                  onValueChange={(val) => updateConfig("showItemImages", val)}
                  style={styles.switchControl}
                />
              </View>

              <View style={[styles.settingRow, styles.settingRowNoBorder]}>
                <View style={styles.settingIconBox}>
                  <LayoutGrid size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Default Menu View
                  </Text>
                  <Text style={styles.settingDesc}>
                    Start with grid or list view.
                  </Text>
                </View>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      config.defaultCategoryView === "grid" &&
                        styles.toggleBtnActive,
                    ]}
                    onPress={() => updateConfig("defaultCategoryView", "grid")}
                  >
                    <Text
                      weight={
                        config.defaultCategoryView === "grid"
                          ? "bold"
                          : "medium"
                      }
                      style={[
                        styles.toggleText,
                        config.defaultCategoryView === "grid" &&
                          styles.toggleTextActive,
                      ]}
                    >
                      Grid
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      config.defaultCategoryView === "list" &&
                        styles.toggleBtnActive,
                    ]}
                    onPress={() => updateConfig("defaultCategoryView", "list")}
                  >
                    <Text
                      weight={
                        config.defaultCategoryView === "list"
                          ? "bold"
                          : "medium"
                      }
                      style={[
                        styles.toggleText,
                        config.defaultCategoryView === "list" &&
                          styles.toggleTextActive,
                      ]}
                    >
                      List
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Workflow & Security */}
            <Text weight="bold" style={styles.sectionTitle}>
              Workflow & Security
            </Text>
            <View style={styles.settingsGroup}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  <Printer size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Auto-Print Bill
                  </Text>
                  <Text style={styles.settingDesc}>
                    Automatically print the receipt when payment completes.
                  </Text>
                </View>
                <Switch
                  value={config.autoPrintBill}
                  onValueChange={(val) => updateConfig("autoPrintBill", val)}
                  style={styles.switchControl}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  <Banknote size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Quick Cash Buttons
                  </Text>
                  <Text style={styles.settingDesc}>
                    Show quick amount buttons (e.g., $10, $50) at checkout.
                  </Text>
                </View>
                <Switch
                  value={config.quickCashButtons}
                  onValueChange={(val) => updateConfig("quickCashButtons", val)}
                  style={styles.switchControl}
                />
              </View>

              <View style={[styles.settingRow, styles.settingRowNoBorder]}>
                <View style={styles.settingIconBox}>
                  <ShieldAlert size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Require PIN for Voids
                  </Text>
                  <Text style={styles.settingDesc}>
                    Ask for manager passcode to void items.
                  </Text>
                </View>
                <Switch
                  value={config.requirePasscodeForVoid}
                  onValueChange={(val) =>
                    updateConfig("requirePasscodeForVoid", val)
                  }
                  style={styles.switchControl}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text weight="bold" style={styles.doneText}>
                Done
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
  modalContainer: {
    backgroundColor: ThemeColors.bg,
    width: "90%",
    maxWidth: 550,
    maxHeight: "90%",
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
    paddingBottom: ThemeSpacing.xxxl,
  },
  sectionTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
    marginTop: ThemeSpacing.sm,
  },
  settingsGroup: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.xl,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  settingRowNoBorder: {
    borderBottomWidth: 0,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.lg,
  },
  settingInfo: {
    flex: 1,
    paddingRight: ThemeSpacing.md,
  },
  settingName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
  },
  switchControl: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThemeRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  toggleTextActive: {
    color: ThemeColors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.md,
    justifyContent: "flex-end",
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  doneBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
  },
  doneText: {
    fontSize: 15,
    color: ThemeColors.white,
  },
});
