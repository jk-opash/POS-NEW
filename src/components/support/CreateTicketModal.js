import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X } from "lucide-react-native";
import { useSupport } from "@/context/SupportContext";

export function CreateTicketModal({ visible, onClose }) {
  const { addTicket } = useSupport();
  
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!subject || !description) return;

    addTicket({
      subject,
      category,
      description,
      priority: "Medium",
    });

    // Reset form
    setSubject("");
    setCategory("Hardware");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>Create Support Ticket</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief description of the issue"
                placeholderTextColor={ThemeColors.textMuted}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.radioGroup}>
                {["Hardware", "Inventory", "Account", "Other"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.radioBtn,
                      category === cat && styles.radioBtnActive
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.radioText,
                      category === cat && styles.radioTextActive
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Please describe the issue in detail..."
                placeholderTextColor={ThemeColors.textMuted}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="bold" style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitBtn, (!subject || !description) && { opacity: 0.5 }]} 
              onPress={handleSubmit}
              disabled={!subject || !description}
            >
              <Text weight="bold" style={styles.submitBtnText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  modalContent: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    width: "100%",
    maxWidth: 500,
    borderWidth: 1,
    borderColor: ThemeColors.border,
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
    padding: 4,
  },
  form: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.lg,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 48,
    color: ThemeColors.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: ThemeSpacing.md,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  radioBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  radioBtnActive: {
    borderColor: ThemeColors.blue,
    backgroundColor: ThemeColors.blue + '15',
  },
  radioText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  radioTextActive: {
    color: ThemeColors.blue,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: ThemeColors.textSecondary,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: ThemeColors.blue,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
  },
  submitBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  }
});
