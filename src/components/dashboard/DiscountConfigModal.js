import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Check,
  Edit2,
  FileText,
  Percent,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { useState } from "react";
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

export function DiscountConfigModal({ visible, onClose }) {
  const {
    discountRules = [],
    addDiscountRule = () => {},
    updateDiscountRule = () => {},
    deleteDiscountRule = () => {},
  } = {};

  // State for the "Add/Edit" sub-form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("percentage"); // "percentage" or "fixed"
  const [value, setValue] = useState("");

  const handleAddClick = () => {
    setEditingId(null);
    setName("");
    setType("percentage");
    setValue("");
    setShowForm(true);
  };

  const handleEditClick = (rule) => {
    setEditingId(rule.id);
    setName(rule.name);
    setType(rule.type);
    setValue(String(rule.value));
    setShowForm(true);
  };

  const handleSaveForm = () => {
    if (!name.trim() || !value.trim()) return;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    if (editingId) {
      updateDiscountRule(editingId, {
        name: name.trim(),
        type,
        value: parsedValue,
      });
    } else {
      addDiscountRule({
        name: name.trim(),
        type,
        value: parsedValue,
        active: true,
      });
    }
    setShowForm(false);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                Discount Configuration
              </Text>
              <Text style={styles.subtitle}>Manage global discount rules</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {showForm ? (
              <View style={styles.formContainer}>
                <Text weight="bold" style={styles.formTitle}>
                  {editingId ? "Edit Discount" : "Add New Discount"}
                </Text>

                <View style={styles.inputGroup}>
                  <Text weight="medium" style={styles.label}>
                    Discount Name
                  </Text>
                  <View style={styles.inputWrap}>
                    <FileText
                      size={18}
                      color={ThemeColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Happy Hour"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text weight="medium" style={styles.label}>
                    Discount Type
                  </Text>
                  <View style={styles.typeToggleRow}>
                    <TouchableOpacity
                      style={[
                        styles.typeToggleBtn,
                        type === "percentage" && styles.typeToggleBtnActive,
                      ]}
                      onPress={() => setType("percentage")}
                    >
                      <Text
                        weight={type === "percentage" ? "bold" : "medium"}
                        style={[
                          styles.typeToggleText,
                          type === "percentage" && styles.typeToggleTextActive,
                        ]}
                      >
                        Percentage
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeToggleBtn,
                        type === "fixed" && styles.typeToggleBtnActive,
                      ]}
                      onPress={() => setType("fixed")}
                    >
                      <Text
                        weight={type === "fixed" ? "bold" : "medium"}
                        style={[
                          styles.typeToggleText,
                          type === "fixed" && styles.typeToggleTextActive,
                        ]}
                      >
                        Fixed Amount
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text weight="medium" style={styles.label}>
                    {type === "percentage" ? "Percentage (%)" : "Amount"}
                  </Text>
                  <View style={styles.inputWrap}>
                    {type === "percentage" ? (
                      <Percent
                        size={18}
                        color={ThemeColors.textMuted}
                        style={styles.inputIcon}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.inputIcon,
                          { fontSize: 16, color: ThemeColors.textMuted },
                        ]}
                      >
                        $
                      </Text>
                    )}
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor={ThemeColors.textMuted}
                      keyboardType="numeric"
                      value={value}
                      onChangeText={setValue}
                    />
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowForm(false)}
                  >
                    <Text weight="semibold" style={styles.cancelText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      (!name.trim() || !value.trim()) && styles.saveBtnDisabled,
                    ]}
                    onPress={handleSaveForm}
                    disabled={!name.trim() || !value.trim()}
                  >
                    <Text weight="semibold" style={styles.saveText}>
                      Save Discount
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.listHeader}>
                  <Text weight="semibold" style={styles.listTitle}>
                    Active Rules
                  </Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleAddClick}
                  >
                    <Plus size={16} color={ThemeColors.primary} />
                    <Text weight="semibold" style={styles.addBtnText}>
                      Add Discount
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContent}
                >
                  {discountRules.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Percent size={32} color={ThemeColors.borderSubtle} />
                      <Text style={styles.emptyStateText}>
                        No discounts configured.
                      </Text>
                    </View>
                  ) : (
                    discountRules.map((rule) => (
                      <View key={rule.id} style={styles.ruleCard}>
                        <View style={styles.ruleInfo}>
                          <View style={styles.ruleTitleRow}>
                            <Text weight="bold" style={styles.ruleName}>
                              {rule.name}
                            </Text>
                            {rule.active && (
                              <View style={styles.activeBadge}>
                                <Check size={10} color={ThemeColors.emerald} />
                                <Text style={styles.activeBadgeText}>
                                  Active
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.ruleDetails}>
                            {rule.type === "percentage"
                              ? `${rule.value}%`
                              : `$${rule.value.toFixed(2)}`}{" "}
                            off
                          </Text>
                        </View>
                        <View style={styles.ruleActions}>
                          <Switch
                            value={rule.active}
                            onValueChange={(val) =>
                              updateDiscountRule(rule.id, { active: val })
                            }
                            style={{
                              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                            }}
                          />
                          <View style={styles.actionDivider} />
                          <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => handleEditClick(rule)}
                          >
                            <Edit2
                              size={16}
                              color={ThemeColors.textSecondary}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => deleteDiscountRule(rule.id)}
                          >
                            <Trash2 size={16} color={ThemeColors.red} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </>
            )}
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
    maxWidth: 500,
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
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.md,
  },
  listTitle: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.primary + "15",
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.md,
  },
  addBtnText: {
    fontSize: 13,
    color: ThemeColors.primary,
  },
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    padding: ThemeSpacing.xl,
    paddingTop: 0,
    gap: ThemeSpacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: "dashed",
  },
  emptyStateText: {
    marginTop: ThemeSpacing.md,
    color: ThemeColors.textMuted,
    fontSize: 14,
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
  },
  ruleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    marginBottom: 4,
  },
  ruleName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald + "15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ThemeRadius.full,
    gap: 2,
  },
  activeBadgeText: {
    fontSize: 10,
    color: ThemeColors.emerald,
    fontWeight: "700",
  },
  ruleDetails: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  ruleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: ThemeColors.borderSubtle,
    marginHorizontal: 4,
  },
  iconBtn: {
    padding: 6,
  },
  formContainer: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.lg,
  },
  formTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 44,
  },
  inputIcon: {
    marginRight: ThemeSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    ...Platform.select({
      web: { outlineStyle: "none" },
    }),
  },
  typeToggleRow: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.md,
    padding: 4,
  },
  typeToggleBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: ThemeRadius.sm,
  },
  typeToggleBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeToggleText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  typeToggleTextActive: {
    color: ThemeColors.textPrimary,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: ThemeSpacing.md,
    marginTop: ThemeSpacing.md,
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  cancelText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  saveBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
