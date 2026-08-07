import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export function AddCustomerModal({ visible, onClose, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              Add New Customer
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. John Doe"
                placeholderTextColor={ThemeColors.textMuted}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="e.g. 9876543210"
                placeholderTextColor={ThemeColors.textMuted}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Email Address
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. john@example.com"
                placeholderTextColor={ThemeColors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text weight="medium" style={styles.label}>
                Address
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Full address..."
                placeholderTextColor={ThemeColors.textMuted}
                multiline
                numberOfLines={3}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={ThemeColors.white} size="small" />
              ) : (
                <Text weight="semibold" style={styles.saveBtnText}>
                  Save Customer
                </Text>
              )}
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
    width: "90%",
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  content: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.lg,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  required: {
    color: ThemeColors.error,
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  inputError: {
    borderColor: ThemeColors.error,
    backgroundColor: ThemeColors.error + "0A",
  },
  errorText: {
    color: ThemeColors.error,
    fontSize: 11,
    marginTop: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    justifyContent: "center",
  },
  cancelBtnText: {
    color: ThemeColors.textSecondary,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: ThemeColors.accent,
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
