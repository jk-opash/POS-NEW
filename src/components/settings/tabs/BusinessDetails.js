import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TextInput, View } from "react-native";
import { SettingsRow } from "../SettingsRow";

export function BusinessDetails({ settings, updateSetting }) {
  const { business } = settings;

  const handleChange = (key, value) => updateSetting("business", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>
        Business Identity
      </Text>
      <Text style={styles.headerSubtitle}>
        Manage your core business identity and details.
      </Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              value={business.name}
              onChangeText={(t) => handleChange("name", t)}
              placeholder="e.g. Acme Corp"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Legal Name</Text>
            <TextInput
              style={styles.input}
              value={business.legal_name}
              onChangeText={(t) => handleChange("legal_name", t)}
              placeholder="e.g. Acme Corporation Pvt. Ltd."
            />
          </View>
        </SettingsRow>
        
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Type</Text>
            <TextInput
              style={styles.input}
              value={business.business_type}
              onChangeText={(t) => handleChange("business_type", t)}
              placeholder="e.g. restaurant"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Reg Number</Text>
            <TextInput
              style={styles.input}
              value={business.business_registration_number}
              onChangeText={(t) => handleChange("business_registration_number", t)}
              placeholder="Registration No."
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Contact & Web
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={business.phone}
              onChangeText={(t) => handleChange("phone", t)}
              keyboardType="phone-pad"
              placeholder="+1 234 567 890"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={business.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="contact@example.com"
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={business.website}
            onChangeText={(t) => handleChange("website", t)}
            keyboardType="url"
            autoCapitalize="none"
            placeholder="https://www.example.com"
          />
        </View>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Legal & Tax
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>GSTIN</Text>
            <TextInput
              style={styles.input}
              value={business.gstin}
              onChangeText={(t) => handleChange("gstin", t)}
              autoCapitalize="characters"
              placeholder="GST Number"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PAN</Text>
            <TextInput
              style={styles.input}
              value={business.pan}
              onChangeText={(t) => handleChange("pan", t)}
              autoCapitalize="characters"
              placeholder="PAN Number"
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Location
        </Text>
        
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              value={business.address_line1}
              onChangeText={(t) => handleChange("address_line1", t)}
              placeholder="Street Address"
            />
          </View>
        </SettingsRow>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              value={business.address_line2}
              onChangeText={(t) => handleChange("address_line2", t)}
              placeholder="Apartment, suite, etc."
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={business.city}
              onChangeText={(t) => handleChange("city", t)}
              placeholder="City"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={business.state}
              onChangeText={(t) => handleChange("state", t)}
              placeholder="State"
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={business.country}
              onChangeText={(t) => handleChange("country", t)}
              placeholder="Country"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              value={business.pincode}
              onChangeText={(t) => handleChange("pincode", t)}
              placeholder="Postal Code"
            />
          </View>
        </SettingsRow>
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
    color: ThemeColors.textPrimary,
    backgroundColor: ThemeColors.bg,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  switchRowText: { fontSize: 14, color: ThemeColors.textPrimary },
});
