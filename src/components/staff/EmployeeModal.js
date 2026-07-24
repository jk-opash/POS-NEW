import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { useStaff } from "@/context/StaffContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmployeeModal({ visible, onClose, employee }) {
  const { addEmployee, updateEmployee } = useStaff();
  const { isDesktop, isTablet } = useResponsive();
  const isLargeScreen = isDesktop || isTablet;

  const isEditing = !!employee;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Cashier",
    department: "Sales",
    store: "All Stores",
    status: "Active",
    salary: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee, salary: employee.salary?.toString() || "" });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "Cashier",
        department: "Sales",
        store: "All Stores",
        status: "Active",
        salary: "",
      });
    }
  }, [employee, visible]);

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      salary: parseFloat(formData.salary) || 0,
      joinDate: isEditing
        ? employee.joinDate
        : new Date().toISOString().split("T")[0],
    };

    if (isEditing) {
      updateEmployee(employee.id, dataToSave);
    } else {
      addEmployee(dataToSave);
    }
    onClose();
  };

  const renderInput = (label, key, placeholder, keyboardType = "default") => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={ThemeColors.textMuted}
        value={formData[key]}
        onChangeText={(text) => setFormData({ ...formData, [key]: text })}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isLargeScreen ? "fade" : "slide"}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.overlay, isLargeScreen && styles.overlayCenter]}
      >
        <View
          style={[
            styles.modalContainer,
            isLargeScreen && styles.modalContainerCentered,
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {isEditing ? "Edit Employee" : "Add New Employee"}
              </Text>
              <Text style={styles.subtitle}>
                {isEditing ? `ID: ${employee.id}` : "Fill out employee details"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.row}>
              <View style={styles.flex1}>
                {renderInput("First Name", "firstName", "John")}
              </View>
              <View style={styles.flex1}>
                {renderInput("Last Name", "lastName", "Doe")}
              </View>
            </View>

            {renderInput(
              "Email Address",
              "email",
              "john.doe@example.com",
              "email-address",
            )}
            {renderInput(
              "Phone Number",
              "phone",
              "+1 234 567 8900",
              "phone-pad",
            )}

            <View style={styles.row}>
              <View style={styles.flex1}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Role</Text>
                  <Dropdown
                    options={[
                      { label: "Cashier", value: "Cashier" },
                      { label: "Manager", value: "Manager" },
                      { label: "Inventory", value: "Inventory" },
                      { label: "Staff", value: "Staff" },
                    ]}
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val })}
                    style={styles.dropdownCustom}
                  />
                </View>
              </View>
              <View style={styles.flex1}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Department</Text>
                  <Dropdown
                    options={[
                      { label: "Sales", value: "Sales" },
                      { label: "Operations", value: "Operations" },
                      { label: "Management", value: "Management" },
                    ]}
                    value={formData.department}
                    onChange={(val) =>
                      setFormData({ ...formData, department: val })
                    }
                    style={styles.dropdownCustom}
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Assigned Store</Text>
                  <Dropdown
                    options={[
                      { label: "All Stores", value: "All Stores" },
                      { label: "Surat Branch", value: "Surat Branch" },
                      { label: "Mumbai Branch", value: "Mumbai Branch" },
                    ]}
                    value={formData.store}
                    onChange={(val) => setFormData({ ...formData, store: val })}
                    style={styles.dropdownCustom}
                  />
                </View>
              </View>
              <View style={styles.flex1}>
                {renderInput("Salary", "salary", "0.00", "numeric")}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.switchContainer}>
                <View style={styles.switchTextGroup}>
                  <Text
                    style={[
                      styles.switchLabel,
                      {
                        color:
                          formData.status === "Active"
                            ? ThemeColors.emerald
                            : ThemeColors.textMuted,
                      },
                    ]}
                  >
                    {formData.status}
                  </Text>
                </View>
                <Switch
                  value={formData.status === "Active"}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      status: val ? "Active" : "Inactive",
                    })
                  }
                  trackColor={{
                    false: ThemeColors.border,
                    true: ThemeColors.emerald,
                  }}
                  thumbcolor={ThemeColors.white}
                  ios_backgroundColor={ThemeColors.border}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="semibold" style={styles.cancelBtnText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text weight="bold" style={styles.saveBtnText}>
                {isEditing ? "Save Changes" : "Create Employee"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayCenter: {
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  modalContainer: {
    backgroundColor: ThemeColors.surface,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    height: "90%", // large modal
  },
  modalContainerCentered: {
    width: "100%",
    maxWidth: 600,
    height: "auto",
    maxHeight: "90%",
    borderRadius: ThemeRadius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  formContent: {
    padding: ThemeSpacing.xl,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  flex1: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: ThemeSpacing.lg,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
    gap: ThemeSpacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cancelBtnText: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: ThemeColors.emerald,
    borderRadius: ThemeRadius.md,
  },
  saveBtnText: {
    fontSize: 16,
    color: ThemeColors.white,
  },
  dropdownCustom: {
    height: 48, // matching text input height
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    borderColor: ThemeColors.border,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
  },
  switchTextGroup: {
    flex: 1,
    gap: 4,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "bold",
  },
  switchSubText: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
});
