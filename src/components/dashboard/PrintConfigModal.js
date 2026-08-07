import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  FileText,
  Printer,
  Settings2,
  Share2,
  Type,
  X,
} from "lucide-react-native";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function PrintConfigModal({ visible, onClose }) {
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
                Bill / KOT Print Configuration
              </Text>
              <Text style={styles.subtitle}>
                Manage receipts and kitchen printers
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
            {/* Printer Settings */}
            <Text weight="bold" style={styles.sectionTitle}>
              Hardware & Layout
            </Text>
            <View style={styles.settingsGroup}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  <Printer size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Print KOTs on Save
                  </Text>
                  <Text style={styles.settingDesc}>
                    Automatically print Kitchen Order Tickets.
                  </Text>
                </View>
                <Switch
                  value={config.printKot}
                  onValueChange={(val) => updateConfig("printKot", val)}
                  style={styles.switchControl}
                />
              </View>

              <View style={[styles.settingRow, styles.settingRowNoBorder]}>
                <View style={styles.settingIconBox}>
                  <Settings2 size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Paper Size (Width)
                  </Text>
                  <Text style={styles.settingDesc}>
                    Adjust layout for 58mm or 80mm rolls.
                  </Text>
                </View>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      config.paperSize === "58mm" && styles.toggleBtnActive,
                    ]}
                    onPress={() => updateConfig("paperSize", "58mm")}
                  >
                    <Text
                      weight={config.paperSize === "58mm" ? "bold" : "medium"}
                      style={[
                        styles.toggleText,
                        config.paperSize === "58mm" && styles.toggleTextActive,
                      ]}
                    >
                      58mm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      config.paperSize === "80mm" && styles.toggleBtnActive,
                    ]}
                    onPress={() => updateConfig("paperSize", "80mm")}
                  >
                    <Text
                      weight={config.paperSize === "80mm" ? "bold" : "medium"}
                      style={[
                        styles.toggleText,
                        config.paperSize === "80mm" && styles.toggleTextActive,
                      ]}
                    >
                      80mm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Customization */}
            <Text weight="bold" style={styles.sectionTitle}>
              Receipt Customization
            </Text>
            <View style={styles.settingsGroup}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Type size={16} color={ThemeColors.textSecondary} />
                  <Text weight="semibold" style={styles.inputLabel}>
                    Header Text
                  </Text>
                </View>
                <Text style={styles.settingDesc}>
                  Prints at the very top (e.g. Name, Address, Tax ID).
                </Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={4}
                  value={config.headerText}
                  onChangeText={(val) => updateConfig("headerText", val)}
                  placeholder="Enter header text..."
                  placeholderTextColor={ThemeColors.textMuted}
                />
              </View>

              <View style={[styles.inputGroup, styles.settingRowNoBorder]}>
                <View style={styles.inputLabelRow}>
                  <FileText size={16} color={ThemeColors.textSecondary} />
                  <Text weight="semibold" style={styles.inputLabel}>
                    Footer Text
                  </Text>
                </View>
                <Text style={styles.settingDesc}>
                  Prints at the bottom (e.g. Thank you message, WiFi password).
                </Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={3}
                  value={config.footerText}
                  onChangeText={(val) => updateConfig("footerText", val)}
                  placeholder="Enter footer text..."
                  placeholderTextColor={ThemeColors.textMuted}
                />
              </View>
            </View>

            {/* Advanced Settings */}
            <Text weight="bold" style={styles.sectionTitle}>
              Advanced
            </Text>
            <View style={styles.settingsGroup}>
              <View style={[styles.settingRow, styles.settingRowNoBorder]}>
                <View style={styles.settingIconBox}>
                  <Share2 size={20} color={ThemeColors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text weight="semibold" style={styles.settingName}>
                    Category-Based Routing
                  </Text>
                  <Text style={styles.settingDesc}>
                    Send specific items to specific printers (e.g. Drinks to
                    Bar).
                  </Text>
                </View>
                <Switch
                  value={config.kotRouting}
                  onValueChange={(val) => updateConfig("kotRouting", val)}
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
  inputGroup: {
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  textArea: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    marginTop: ThemeSpacing.md,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    textAlignVertical: "top",
    minHeight: 80,
    ...Platform.select({
      web: { outlineStyle: "none" },
    }),
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
