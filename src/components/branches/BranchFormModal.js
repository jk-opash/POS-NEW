import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, Building2, MapPin, Phone, Mail, User } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export function BranchFormModal({ visible, initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Retail Store",
    company: "Mac Burguer India",
    region: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    taxJurisdiction: "",
    storeSize: "",
    openingDate: "",
    taxRegistration: "",
    status: "Operational",
    manager: "",
    schedule: {
      weekday: "",
      weekend: "",
    },
  });

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: "",
          code: "",
          type: "Retail Store",
          company: "Mac Burguer India",
          region: "",
          contact: "",
          email: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          currency: "INR",
          timeZone: "Asia/Kolkata",
          taxJurisdiction: "",
          storeSize: "",
          openingDate: "",
          taxRegistration: "",
          status: "Operational",
          manager: "",
          schedule: {
            weekday: "",
            weekend: "",
          },
        });
      }
    }
  }, [visible, initialData]);

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return; // Simple validation
    onSubmit(formData);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {initialData ? "Edit Branch" : "Add New Branch"}
              </Text>
              <Text style={styles.subtitle}>Enter branch details below</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            
            {/* Basic Info */}
            <Text weight="bold" style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch Name</Text>
              <View style={styles.inputWrap}>
                <Building2 size={20} color={ThemeColors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Surat Outlet"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.name}
                  onChangeText={(val) => updateField("name", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Branch Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. SUR-01"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.code}
                  onChangeText={(val) => updateField("code", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Branch Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Retail Store"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.type}
                  onChangeText={(val) => updateField("type", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mac Burguer India"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.company}
                  onChangeText={(val) => updateField("company", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Region</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. West India"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.region}
                  onChangeText={(val) => updateField("region", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Status</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Operational / Maintenance"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.status}
                  onChangeText={(val) => updateField("status", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Manager</Text>
                <View style={styles.inputWrap}>
                  <User size={18} color={ThemeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Manager Name"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={formData.manager}
                    onChangeText={(val) => updateField("manager", val)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Financial & Configuration */}
            <Text weight="bold" style={styles.sectionTitle}>Configuration & Compliance</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Currency</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. INR"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.currency}
                  onChangeText={(val) => updateField("currency", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time Zone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Asia/Kolkata"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.timeZone}
                  onChangeText={(val) => updateField("timeZone", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Tax Jurisdiction</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. GST - Gujarat"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.taxJurisdiction}
                  onChangeText={(val) => updateField("taxJurisdiction", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Tax Registration ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 24AAAA..."
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.taxRegistration}
                  onChangeText={(val) => updateField("taxRegistration", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Store Size</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2500 sqft"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.storeSize}
                  onChangeText={(val) => updateField("storeSize", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Opening Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.openingDate}
                  onChangeText={(val) => updateField("openingDate", val)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Schedule */}
            <Text weight="bold" style={styles.sectionTitle}>Operating Calendar</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weekday Hours</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00 AM - 10:00 PM"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.schedule?.weekday}
                  onChangeText={(val) => setFormData(prev => ({ ...prev, schedule: { ...prev.schedule, weekday: val } }))}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weekend Hours</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10:00 AM - 11:30 PM"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.schedule?.weekend}
                  onChangeText={(val) => setFormData(prev => ({ ...prev, schedule: { ...prev.schedule, weekend: val } }))}
                />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Contact Info */}
            <Text weight="bold" style={styles.sectionTitle}>Contact & Location</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrap}>
                  <Phone size={18} color={ThemeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor={ThemeColors.textMuted}
                    keyboardType="phone-pad"
                    value={formData.contact}
                    onChangeText={(val) => updateField("contact", val)}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrap}>
                  <Mail size={18} color={ThemeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="branch@example.com"
                    placeholderTextColor={ThemeColors.textMuted}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(val) => updateField("email", val)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.inputWrap}>
                <MapPin size={20} color={ThemeColors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Street address"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.address}
                  onChangeText={(val) => updateField("address", val)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.city}
                  onChangeText={(val) => updateField("city", val)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={formData.state}
                  onChangeText={(val) => updateField("state", val)}
                />
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text weight="bold" style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text weight="bold" style={styles.saveBtnText}>Save Branch</Text>
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
  modalContainer: {
    width: "100%",
    maxWidth: 700,
    height: "90%",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 22,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: ThemeSpacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.xl,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  inputGroup: {
    marginBottom: ThemeSpacing.lg,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
  },
  inputIcon: {
    marginRight: ThemeSpacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cancelBtnText: {
    color: ThemeColors.textSecondary,
    fontSize: 15,
  },
  saveBtn: {
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emerald,
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 15,
  },
});
