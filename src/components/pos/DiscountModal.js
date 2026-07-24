import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, ChevronDown } from "lucide-react-native";
import { usePOS } from "@/context/POSContext";

export function DiscountModal({ visible, onClose }) {
  const { globalDiscount, setGlobalDiscount } = usePOS();
  
  // Local state for editing
  const [type, setType] = useState(globalDiscount.type === "none" ? "percentage" : globalDiscount.type);
  const [value, setValue] = useState(globalDiscount.value ? globalDiscount.value.toString() : "");
  const [reason, setReason] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleSave = () => {
    const val = parseFloat(value);
    if (!val || val <= 0) {
      setGlobalDiscount({ type: "none", value: 0 });
    } else {
      setGlobalDiscount({ type, value: val, reason });
    }
    onClose();
  };

  const handleApplyCoupon = () => {
    if (coupon.trim() === "") {
      setCouponError("Please enter a valid code.");
      return;
    }
    setCouponError("Relevant discount not found.");
  };

  const handleClearCoupon = () => {
    setCoupon("");
    setCouponError("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>Applied Discount</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Custom Discount Section */}
            <View style={styles.sectionHeader}>
              <Text weight="bold" style={styles.sectionTitle}>Custom Discount</Text>
              <TouchableOpacity>
                <Text style={styles.addMoreText}>Add More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownInput}>
              <Text style={styles.dropdownText}>All</Text>
              <ChevronDown size={16} color={ThemeColors.textSecondary} />
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Reason"
              placeholderTextColor={ThemeColors.textMuted}
              value={reason}
              onChangeText={setReason}
            />

            <View style={styles.discountRow}>
              <View style={styles.radioGroup}>
                <TouchableOpacity style={styles.radioItem} onPress={() => setType("percentage")}>
                  <View style={[styles.radioCircle, type === "percentage" && styles.radioCircleActive]}>
                    {type === "percentage" && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Percentage</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.radioItem} onPress={() => setType("fixed")}>
                  <View style={[styles.radioCircle, type === "fixed" && styles.radioCircleActive]}>
                    {type === "fixed" && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Fixed</Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
                maxLength={6}
              />
            </View>

            {/* Coupon Code Section */}
            <Text weight="bold" style={[styles.sectionTitle, { marginTop: ThemeSpacing.md }]}>
              Coupon Code
            </Text>
            
            <View style={styles.couponRow}>
              <TextInput
                style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                placeholder="Enter coupon code"
                placeholderTextColor={ThemeColors.textMuted}
                value={coupon}
                onChangeText={(text) => {
                  setCoupon(text);
                  setCouponError("");
                }}
              />
              <TouchableOpacity onPress={handleClearCoupon}>
                <Text style={styles.clearCouponText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyCouponBtn} onPress={handleApplyCoupon}>
                <Text weight="bold" style={styles.applyCouponText}>Apply</Text>
              </TouchableOpacity>
            </View>
            
            {couponError !== "" && (
              <Text style={styles.errorText}>{couponError}</Text>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="bold" style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text weight="bold" style={styles.saveBtnText}>Save</Text>
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
  },
  modalContainer: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  title: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: ThemeSpacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  addMoreText: {
    fontSize: 13,
    color: ThemeColors.red,
  },
  dropdownInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 10,
    marginBottom: ThemeSpacing.md,
  },
  dropdownText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  radioGroup: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ThemeColors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: ThemeColors.textSecondary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.textSecondary,
  },
  radioLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  amountInput: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    width: 80,
    textAlign: "right",
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    marginTop: ThemeSpacing.sm,
  },
  clearCouponText: {
    color: ThemeColors.red,
    fontSize: 14,
  },
  applyCouponBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.sm,
  },
  applyCouponText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  errorText: {
    color: ThemeColors.red,
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
  },
  cancelBtnText: {
    color: ThemeColors.textSecondary,
    fontSize: 14,
  },
  saveBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 10,
    backgroundColor: ThemeColors.red,
    borderRadius: ThemeRadius.sm,
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
