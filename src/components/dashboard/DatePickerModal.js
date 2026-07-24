import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Calendar, ChevronRight, X } from "lucide-react-native";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

export const DATE_RANGES = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7days", label: "Last 7 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "customRange", label: "Custom Range" },
];

export function DatePickerModal({ visible, onClose, selectedRange, onSelectRange }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Calendar size={20} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.title}>
                Custom Range
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>01 / 06 / 2026</Text>
              <Calendar size={16} color={ThemeColors.textSecondary} />
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: ThemeSpacing.md }]}>End Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>30 / 06 / 2026</Text>
              <Calendar size={16} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.applyBtn}
              onPress={() => {
                onSelectRange("customRange");
                onClose();
              }}
            >
              <Text weight="semibold" style={styles.applyBtnText}>Apply Custom Range</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  title: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.xs,
  },
  body: {
    padding: ThemeSpacing.xl,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.xs,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.bg,
  },
  dateText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  footer: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  applyBtn: {
    backgroundColor: ThemeColors.emerald,
    borderRadius: ThemeRadius.md,
    paddingVertical: ThemeSpacing.md,
    alignItems: "center",
  },
  applyBtnText: {
    color: ThemeColors.white,
    fontSize: 15,
  },
});
