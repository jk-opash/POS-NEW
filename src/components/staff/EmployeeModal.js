import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import {
  createTeamMember,
  updateTeamMember,
} from "@/store/slices/teamMemberSlice";
import { hasPermission, roleDefaults } from "@/utils/permissions";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { CheckSquare, Square, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const PERMISSIONS_LIST = [
  "dashboard",
  "tables",
  "pos",
  "kds",
  "waiter",
  "invoices",
  "operations",
  "orders",
  "menu",
  "day-end",
  "inventory",
  "suppliers",
  "expense",
  "billing-user",
  "tables-qr",
  "logs",
  "support-ticket",
];

const ROLES = ["Manager", "Cashier", "Waiter", "Kitchen"];

export default function EmployeeModal({ visible, onClose, employee }) {
  const dispatch = useDispatch();
  const { isDesktop, isTablet } = useResponsive();
  const isLargeScreen = isDesktop || isTablet;

  const { branches } = useSelector((state) => state.branch || { branches: [] });

  const isEditing = !!employee;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_name: "Manager",
    branch_id: "",
    status: "Active",
    permissions: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setError(""); // Reset error on open
    if (employee) {
      const defaultRole = employee.role?.name || employee.role || "Manager";
      setFormData({
        ...employee,
        first_name: employee.first_name || employee.name?.split(" ")[0] || "",
        last_name: employee.last_name || employee.name?.split(" ")[1] || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role_name: defaultRole,
        branch_id: employee.branch_id || employee.branch?.id || "",
        status:
          employee.status === "Active" ||
          employee.status === "active" ||
          employee.active
            ? "Active"
            : "Inactive",
        permissions: employee.role?.permissions || employee.permissions || [],
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role_name: "Manager",
        branch_id: branches?.[0]?.id || "",
        status: "Active",
        permissions: [],
      });
    }
  }, [employee, visible, branches]);

  const handleSave = () => {
    setError("");
    if (!formData.first_name.trim()) return setError("First Name is required.");
    if (!formData.role_name) return setError("Role is required.");
    if (!formData.branch_id) return setError("Branch is required.");

    // Only send the fields that the backend expects, just like POS-CLIENT
    const dataToSave = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      pin: formData.pin,
      salary: formData.salary,
      status: formData.status,
      branch_id: formData.branch_id,
      name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
      role: {
        name: formData.role_name,
        permissions: formData.permissions,
      },
    };

    if (!isEditing) {
      dataToSave.join_date = new Date().toISOString().split("T")[0];
    }

    if (isEditing) {
      dispatch(updateTeamMember({ id: employee.id, data: dataToSave }));
    } else {
      dispatch(createTeamMember(dataToSave));
    }
    onClose();
  };

  const renderInput = (
    label,
    key,
    placeholder,
    keyboardType = "default",
    required = false,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && "*"}
      </Text>
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

  const togglePermission = (perm) => {
    setFormData((prev) => {
      const perms = prev.permissions || [];
      return {
        ...prev,
        permissions: perms.includes(perm)
          ? perms.filter((p) => p !== perm)
          : [...perms, perm],
      };
    });
  };

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
            <Text weight="bold" style={styles.title}>
              {isEditing ? "Edit Staff Profile" : "Add Staff Profile"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
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
            <View style={styles.row}>
              <View style={styles.flex1}>
                {renderInput(
                  "First Name",
                  "first_name",
                  "Anand",
                  "default",
                  true,
                )}
              </View>
              <View style={styles.flex1}>
                {renderInput("Last Name", "last_name", "Krishnan")}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Status</Text>
                  <Dropdown
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                    value={formData.status}
                    onChange={(val) =>
                      setFormData({ ...formData, status: val })
                    }
                    style={styles.dropdownCustom}
                  />
                </View>
              </View>
              <View style={styles.flex1}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Role *</Text>
                  <Dropdown
                    options={ROLES.map((r) => ({ label: r, value: r }))}
                    value={formData.role_name}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        role_name: val,
                      })
                    }
                    style={styles.dropdownCustom}
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                {renderInput("Phone", "phone", "+91 98400 44001", "phone-pad")}
              </View>
              <View style={styles.flex1}>
                {renderInput(
                  "Email",
                  "email",
                  "anand@dailygrind.co",
                  "email-address",
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Permissions</Text>
              <View style={styles.permissionsGrid}>
                {PERMISSIONS_LIST.map((perm) => {
                  const roleName = formData.role_name.toLowerCase();
                  const defaults = roleDefaults[roleName] || [];
                  const isDefault = defaults.includes(perm) || ["dashboard", "settings"].includes(perm);
                  const isChecked = isDefault || (formData.permissions || []).includes(perm);

                  return (
                    <TouchableOpacity
                      key={perm}
                      style={[styles.permissionItem, isDefault && { opacity: 0.6, backgroundColor: '#f8fafc' }]}
                      onPress={() => {
                        if (!isDefault) togglePermission(perm);
                      }}
                      activeOpacity={isDefault ? 1 : 0.7}
                    >
                      {isChecked ? (
                        <CheckSquare size={18} color={isDefault ? "#94A3B8" : "#0066FF"} />
                      ) : (
                        <Square size={18} color="#94A3B8" />
                      )}
                      <Text style={[styles.permissionText, isDefault && { color: ThemeColors.textSecondary }]}>
                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text weight="semibold" style={styles.cancelBtnText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.saveBtn]}
              onPress={handleSave}
            >
              <Text weight="bold" style={styles.saveBtnText}>
                Save Changes
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  overlayCenter: {
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  modalContainer: {
    backgroundColor: "#F0F2F5",
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    height: "90%",
  },
  modalContainerCentered: {
    width: "100%",
    maxWidth: 640,
    height: "auto",
    maxHeight: "90%",
    borderRadius: ThemeRadius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  formContent: {
    padding: ThemeSpacing.xxl,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.xl,
    marginBottom: ThemeSpacing.lg,
  },
  flex1: {
    flex: 1,
  },
  inputGroup: {
    flex: 1,
    marginBottom: ThemeSpacing.md,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  dropdownCustom: {
    height: 44,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.white,
    borderColor: ThemeColors.border,
    borderWidth: 1,
  },
  permissionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: 8,
  },
  permissionText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: ThemeRadius.md,
  },
  cancelBtn: {
    backgroundColor: "#9370F6",
  },
  cancelBtnText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
  saveBtn: {
    backgroundColor: "#7B51ED",
  },
  saveBtnText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
