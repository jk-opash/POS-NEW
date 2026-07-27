import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { Plus, Percent, Settings2, ShieldCheck, Check, Edit2, Trash2, X } from "lucide-react-native";
import { useTax } from "@/context/TaxContext";
import { AddTaxModal } from "@/components/tax/AddTaxModal";

export function TaxConfigModal({ visible, onClose }) {
  const { taxRules, taxSettings, updateTaxSetting, deleteTaxRule, updateTaxRule } = useTax();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const handleAddPress = () => {
    setEditingRule(null);
    setAddModalVisible(true);
  };

  const handleEditPress = (rule) => {
    setEditingRule(rule);
    setAddModalVisible(true);
  };

  const toggleRuleActive = (id, currentActive) => {
    updateTaxRule(id, { active: !currentActive });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>Tax Configuration</Text>
              <Text style={styles.subtitle}>Manage taxes and application rules</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text weight="bold" style={styles.sectionTitle}>Active Tax Rules</Text>
                <Text style={styles.sectionSubtitle}>Manage the taxes applied to orders in your restaurant.</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
                <Plus size={18} color={ThemeColors.white} />
                <Text weight="semibold" style={styles.addBtnText}>Add Tax Rule</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rulesList}>
              {taxRules.length === 0 ? (
                <View style={styles.emptyState}>
                  <Percent size={40} color={ThemeColors.borderSubtle} />
                  <Text style={styles.emptyStateText}>No tax rules configured yet.</Text>
                </View>
              ) : (
                taxRules.map((rule) => (
                  <View key={rule.id} style={styles.ruleCard}>
                    <View style={styles.ruleInfo}>
                      <View style={styles.ruleTitleRow}>
                        <Text weight="bold" style={styles.ruleName}>{rule.name}</Text>
                        {rule.active && (
                          <View style={styles.activeBadge}>
                            <Check size={12} color={ThemeColors.emerald} />
                            <Text style={styles.activeBadgeText}>Active</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.ruleDetails}>
                        {rule.rate}% ({rule.type})
                      </Text>
                    </View>
                    <View style={styles.ruleActions}>
                      <Switch
                        value={rule.active}
                        onValueChange={() => toggleRuleActive(rule.id, rule.active)}
                        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                      />
                      <View style={styles.actionDivider} />
                      <TouchableOpacity style={styles.iconBtn} onPress={() => handleEditPress(rule)}>
                        <Edit2 size={16} color={ThemeColors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => deleteTaxRule(rule.id)}>
                        <Trash2 size={16} color={ThemeColors.red} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.sectionSeparator} />

            <View style={styles.settingsSection}>
              <Text weight="bold" style={styles.sectionTitle}>Tax Application Rules</Text>
              <Text style={styles.sectionSubtitle}>Global settings that dictate how taxes behave at checkout.</Text>
              
              <View style={styles.settingsGrid}>
                <View style={styles.settingCard}>
                  <View style={styles.settingIconBox}>
                    <Settings2 size={24} color={ThemeColors.primary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text weight="bold" style={styles.settingLabel}>Inclusive Pricing</Text>
                    <Text style={styles.settingDesc}>Menu item prices already include all active taxes.</Text>
                  </View>
                  <Switch
                    value={taxSettings.inclusive}
                    onValueChange={(val) => updateTaxSetting("inclusive", val)}
                  />
                </View>

                <View style={styles.settingCard}>
                  <View style={styles.settingIconBox}>
                    <ShieldCheck size={24} color={ThemeColors.primary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text weight="bold" style={styles.settingLabel}>Compound Taxes</Text>
                    <Text style={styles.settingDesc}>Apply secondary taxes on top of primary tax subtotals.</Text>
                  </View>
                  <Switch
                    value={taxSettings.compound}
                    onValueChange={(val) => updateTaxSetting("compound", val)}
                  />
                </View>

                <View style={styles.settingCard}>
                  <View style={styles.settingIconBox}>
                    <Percent size={24} color={ThemeColors.primary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text weight="bold" style={styles.settingLabel}>Allow Tax Exemptions</Text>
                    <Text style={styles.settingDesc}>Give cashiers the ability to remove tax on the billing screen.</Text>
                  </View>
                  <Switch
                    value={taxSettings.exemptionsEnabled}
                    onValueChange={(val) => updateTaxSetting("exemptionsEnabled", val)}
                  />
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text weight="bold" style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <AddTaxModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        editingRule={editingRule}
      />
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
    maxWidth: 700,
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: ThemeSpacing.xl,
    flexWrap: "wrap",
    gap: ThemeSpacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
    gap: 8,
  },
  addBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  rulesList: {
    gap: ThemeSpacing.md,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: ThemeColors.border,
  },
  emptyStateText: {
    marginTop: ThemeSpacing.md,
    fontSize: 15,
    color: ThemeColors.textMuted,
  },
  ruleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  ruleInfo: {
    flex: 1,
    gap: 4,
  },
  ruleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  ruleName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ThemeRadius.full,
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    color: ThemeColors.emerald,
    fontWeight: "600",
  },
  ruleDetails: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  ruleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  actionDivider: {
    width: 1,
    height: 24,
    backgroundColor: ThemeColors.borderSubtle,
    marginHorizontal: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.xl,
  },
  settingsSection: {},
  settingsGrid: {
    marginTop: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
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
  settingContent: {
    flex: 1,
    paddingRight: ThemeSpacing.lg,
  },
  settingLabel: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
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
