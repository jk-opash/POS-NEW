import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { FileText, Percent, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function AddTaxModal({ visible, onClose, editingRule }) {
  const { addTaxRule, updateTaxRule } = [];
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    if (editingRule) {
      setName(editingRule.name);
      setRate(String(editingRule.rate));
    } else {
      setName("");
      setRate("");
    }
  }, [editingRule, visible]);

  const handleSave = () => {
    if (!name.trim() || !rate.trim()) return;

    const parsedRate = parseFloat(rate);
    if (isNaN(parsedRate)) return;

    if (editingRule) {
      updateTaxRule(editingRule.id, {
        name: name.trim(),
        rate: parsedRate,
      });
    } else {
      addTaxRule({
        name: name.trim(),
        rate: parsedRate,
        type: "percentage",
        active: true,
      });
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              {editingRule ? "Edit Tax Rule" : "Add Tax Rule"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Tax Name
              </Text>
              <View style={styles.inputWrap}>
                <FileText
                  size={18}
                  color={ThemeColors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., CGST, VAT"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Tax Rate (%)
              </Text>
              <View style={styles.inputWrap}>
                <Percent
                  size={18}
                  color={ThemeColors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={ThemeColors.textMuted}
                  keyboardType="numeric"
                  value={rate}
                  onChangeText={setRate}
                />
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="semibold" style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                (!name.trim() || !rate.trim()) && styles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={!name.trim() || !rate.trim()}
            >
              <Text weight="semibold" style={styles.saveText}>
                Save Rule
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
  modalContent: {
    backgroundColor: ThemeColors.surface,
    width: "90%",
    maxWidth: 400,
    borderRadius: ThemeRadius.xl,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  body: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.lg,
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
    backgroundColor: ThemeColors.bg,
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
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    paddingTop: 0,
    gap: ThemeSpacing.md,
    justifyContent: "flex-end",
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
