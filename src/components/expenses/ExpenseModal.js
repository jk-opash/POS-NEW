import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  "Supplies & Ingredients",
  "Maintenance & Repairs",
  "Utilities (Water, Power, Web)",
  "Salary & Wages",
  "Marketing & Ads",
  "Rent & Lease",
  "Taxes & Licenses",
  "Office Supplies",
  "Delivery & Logistics",
  "Miscellaneous",
];

export function ExpenseModal({ visible, onClose, onSubmit, isLoading }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!amount.trim()) return setError("Amount is required.");
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return setError("Please enter a valid positive amount.");
    if (!description.trim()) return setError("Description is required.");

    onSubmit({
      amount: Number(amount),
      category,
      description: description.trim(),
    });
    // Reset form
    setAmount("");
    setCategory(CATEGORIES[0]);
    setDescription("");
    setError("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.headerTitle}>
              Add Expense
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {error ? (
              <Text
                style={{
                  color: ThemeColors.error,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                {error}
              </Text>
            ) : null}
            <View style={styles.field}>
              <Text weight="medium" style={styles.label}>
                Amount
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.field}>
              <Text weight="medium" style={styles.label}>
                Category
              </Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryChip,
                      category === c && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(c)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === c && styles.categoryChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text weight="medium" style={styles.label}>
                Description
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="What was this expense for?"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="medium" style={styles.cancelBtnText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!amount || isLoading) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!amount || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={ThemeColors.white} />
              ) : (
                <>
                  <Plus size={18} color={ThemeColors.white} />
                  <Text weight="semibold" style={styles.submitBtnText}>
                    Add Expense
                  </Text>
                </>
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
  modal: {
    backgroundColor: ThemeColors.bg,
    width: "90%",
    maxWidth: 500,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  headerTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.sm,
  },
  content: {
    padding: ThemeSpacing.lg,
  },
  field: {
    marginBottom: ThemeSpacing.lg,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    fontSize: 15,
    color: ThemeColors.textPrimary,
    backgroundColor: ThemeColors.surface,
  },
  textArea: {
    minHeight: 80,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  categoryChipActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  categoryChipTextActive: {
    color: ThemeColors.white,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
    gap: ThemeSpacing.md,
  },
  cancelBtn: {
    flex: 1,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
  },
  cancelBtnText: {
    color: ThemeColors.textPrimary,
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: ThemeColors.white,
  },
});
