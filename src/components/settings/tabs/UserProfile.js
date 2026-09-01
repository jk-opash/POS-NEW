import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TextInput, View } from "react-native";
import { SettingsRow } from "../SettingsRow";
import { useSelector } from "react-redux";

export function UserProfileCard({ settings, updateSetting }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>
        My Profile
      </Text>
      <Text style={styles.headerSubtitle}>
        View and manage your login details and account information.
      </Text>

      <View style={styles.card}>
        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginBottom: 8 }}
        >
          Personal Information
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={user.first_name}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={user.last_name || ""}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={user.phone || ""}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Role & Access
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>System Role</Text>
            <TextInput
              style={styles.input}
              value={user.role === "admin" ? "Administrator" : "Team Member"}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Login PIN</Text>
            <TextInput
              style={styles.input}
              value={user.pin ? "••••••" : "Not Set"}
              secureTextEntry={false}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
        </SettingsRow>
        
        <Text style={styles.infoText}>
          Contact your system administrator if you need to update your email, phone, or PIN.
        </Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { gap: ThemeSpacing.lg },
  headerTitle: { fontSize: 24, color: ThemeColors.textPrimary },
  headerSubtitle: { fontSize: 14, color: ThemeColors.textMuted, marginTop: 4 },
  card: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.xl,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.lg,
  },
  fieldGroup: { flex: 1, gap: ThemeSpacing.xs },
  label: { fontSize: 13, color: ThemeColors.textSecondary, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.md,
    fontSize: 14,
    color: ThemeColors.textSecondary, // Secondary color for disabled fields
    backgroundColor: ThemeColors.surfaceElevated, // Slightly darker bg for disabled
  },
  infoText: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  }
});
