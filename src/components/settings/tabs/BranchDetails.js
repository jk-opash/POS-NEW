import { Text } from "@/components/ui/Text";
import { ThemeColors } from "@/theme/theme";
import { TextInput, View } from "react-native";
import { styles } from "./BusinessDetails";
import { SettingsRow } from "../SettingsRow";

export function BranchDetails({ settings, updateSetting }) {
  const { branch } = settings;

  const handleChange = (key, value) => updateSetting("branch", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>
        Branch Settings
      </Text>
      <Text style={styles.headerSubtitle}>
        Manage branch-specific details, location, and configuration.
      </Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Branch Name</Text>
            <TextInput
              style={styles.input}
              value={branch.name}
              onChangeText={(t) => handleChange("name", t)}
              placeholder="e.g. Downtown Outlet"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Branch Code</Text>
            <TextInput
              style={styles.input}
              value={branch.code}
              onChangeText={(t) => handleChange("code", t)}
              placeholder="e.g. DT-01"
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Branch Type</Text>
            <TextInput
              style={styles.input}
              value={branch.branch_type}
              onChangeText={(t) => handleChange("branch_type", t)}
              placeholder="e.g. Restaurant"
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Contact Information
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={branch.contact}
              onChangeText={(t) => handleChange("contact", t)}
              keyboardType="phone-pad"
              placeholder="+1 234 567 890"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={branch.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="branch@example.com"
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
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={branch.address}
              onChangeText={(t) => handleChange("address", t)}
              placeholder="Full Address"
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={branch.city}
              onChangeText={(t) => handleChange("city", t)}
              placeholder="City"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={branch.state}
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
              value={branch.country}
              onChangeText={(t) => handleChange("country", t)}
              placeholder="Country"
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Tax Information
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tax Jurisdiction</Text>
            <TextInput
              style={styles.input}
              value={branch.tax_jurisdiction || ""}
              onChangeText={(t) => handleChange("tax_jurisdiction", t)}
              placeholder="e.g. State / National"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tax Registration No.</Text>
            <TextInput
              style={styles.input}
              value={branch.tax_registration || ""}
              onChangeText={(t) => handleChange("tax_registration", t)}
              placeholder="e.g. GSTIN/VAT"
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tax Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={String(branch.tax_percentage || "")}
              onChangeText={(t) => handleChange("tax_percentage", Number(t) || 0)}
              keyboardType="numeric"
              placeholder="e.g. 5.00"
            />
          </View>
        </SettingsRow>

        <Text
          weight="bold"
          style={{ fontSize: 16, color: ThemeColors.textPrimary, marginTop: 12, marginBottom: 8 }}
        >
          Operations
        </Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={branch.currency}
              onChangeText={(t) => handleChange("currency", t)}
              placeholder="e.g. INR"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Time Zone</Text>
            <TextInput
              style={styles.input}
              value={branch.time_zone}
              onChangeText={(t) => handleChange("time_zone", t)}
              placeholder="e.g. Asia/Kolkata"
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Capacity (Persons)</Text>
            <TextInput
              style={styles.input}
              value={String(branch.capacity || "")}
              onChangeText={(t) => handleChange("capacity", Number(t) || 0)}
              keyboardType="numeric"
              placeholder="e.g. 100"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tables Count</Text>
            <TextInput
              style={styles.input}
              value={String(branch.tables_count || "")}
              onChangeText={(t) => handleChange("tables_count", Number(t) || 0)}
              keyboardType="numeric"
              placeholder="e.g. 20"
            />
          </View>
        </SettingsRow>
      </View>
    </View>
  );
}
