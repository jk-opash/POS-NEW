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
import { Picker } from "@react-native-picker/picker";

export function WithdrawalModal({ visible, onClose, onSubmit, isLoading, teamMembers }) {
  const [amount, setAmount] = useState("");
  const [withdrawnBy, setWithdrawnBy] = useState("");
  const [description, setDescription] = useState("");
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!amount.trim()) return setError("Amount is required.");
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return setError("Please enter a valid positive amount.");
    if (!withdrawnBy) return setError("Please select a team member.");
    if (!withdrawalDate.trim()) return setError("Withdrawal date is required.");

    onSubmit({
      amount: Number(amount),
      withdrawn_by: withdrawnBy,
      description: description.trim(),
      withdrawal_date: new Date(withdrawalDate).toISOString(),
      payment_method: "Cash"
    });
    
    // Reset form
    setAmount("");
    setWithdrawnBy("");
    setDescription("");
    setWithdrawalDate(new Date().toISOString().split('T')[0]);
    setError("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.headerTitle}>
              Add Withdrawal
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
                Withdrawn By
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={withdrawnBy}
                  onValueChange={(itemValue) => setWithdrawnBy(itemValue)}
                >
                  <Picker.Item label="Select Team Member..." value="" color={ThemeColors.textMuted} />
                  {teamMembers?.map((member) => (
                    <Picker.Item 
                      key={member.id} 
                      label={`${member.first_name} ${member.last_name}`} 
                      value={member.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text weight="medium" style={styles.label}>
                Date (YYYY-MM-DD)
              </Text>
              <TextInput
                style={styles.input}
                value={withdrawalDate}
                onChangeText={setWithdrawalDate}
                placeholder="2024-12-31"
              />
            </View>

            <View style={styles.field}>
              <Text weight="medium" style={styles.label}>
                Description
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Optional description..."
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
                (!amount || !withdrawnBy || isLoading) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!amount || !withdrawnBy || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={ThemeColors.white} />
              ) : (
                <>
                  <Plus size={18} color={ThemeColors.white} />
                  <Text weight="semibold" style={styles.submitBtnText}>
                    Add Withdrawal
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
    minHeight: 48,
    justifyContent: 'center',
  },
  textArea: {
    minHeight: 80,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surface,
    overflow: 'hidden',
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
