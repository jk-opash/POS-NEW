import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X } from "lucide-react-native";

export function ItemNoteModal({
  visible,
  onClose,
  item,
  onSaveNote,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (visible && item) {
      setNote(item.note || "");
    }
  }, [visible, item]);

  const handleSave = () => {
    if (item) {
      onSaveNote(item.id, note.trim());
    }
    onClose();
  };

  if (!visible || !item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text weight="bold" style={styles.title}>
                  Add Note to {item.product?.name}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={ThemeColors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Less spicy, no onions..."
                  placeholderTextColor={ThemeColors.borderSubtle}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text weight="semibold" style={styles.cancelBtnText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text weight="bold" style={styles.saveBtnText}>
                    Save Note
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
  },
  keyboardView: {
    width: "100%",
    maxWidth: 500,
  },
  modalContainer: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    width: "100%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
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
  content: {
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    height: 100,
    color: ThemeColors.textPrimary,
    fontSize: 15,
    fontFamily: "Outfit-Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  cancelBtn: {
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xl,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.white,
  },
  cancelBtnText: {
    color: ThemeColors.textPrimary,
    fontSize: 15,
  },
  saveBtn: {
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xl,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.primary,
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 15,
  },
});
