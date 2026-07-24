import React from "react";
import { View, StyleSheet, TextInput, Switch, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useSettings } from "@/context/SettingsContext";
import { SettingsRow } from "../SettingsRow";

export function BusinessSettings() {
  const { settings, updateSetting } = useSettings();
  const { business } = settings;

  const handleChange = (key, value) => {
    updateSetting("business", key, value);
  };

  const handleVerticalChange = (newVertical) => {
    updateSetting("business", "vertical", newVertical);
    updateSetting("business", "verticalFlags", {
      isRetail: newVertical === "RETAIL",
      isFNB: newVertical === "FNB",
      isServices: newVertical === "SERVICES"
    });
  };

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Business Settings</Text>
      <Text style={styles.headerSubtitle}>Manage your company's primary identity and contact information.</Text>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Logo URL</Text>
          <TextInput 
            style={styles.input} 
            value={business.logoUrl} 
            onChangeText={(t) => handleChange("logoUrl", t)}
            placeholder="https://..."
            placeholderTextColor={ThemeColors.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Business Vertical</Text>
          <View style={styles.verticalSelector}>
            {['RETAIL', 'FNB', 'SERVICES'].map((vert) => (
              <TouchableOpacity
                key={vert}
                style={[
                  styles.verticalBtn,
                  business.vertical === vert && styles.verticalBtnActive
                ]}
                onPress={() => handleVerticalChange(vert)}
              >
                <Text style={[
                  styles.verticalBtnText,
                  business.vertical === vert && styles.verticalBtnTextActive
                ]}>
                  {vert === 'FNB' ? 'Food & Beverage' : vert === 'RETAIL' ? 'Retail / Grocery' : 'Services'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput 
              style={styles.input} 
              value={business.name} 
              onChangeText={(t) => handleChange("name", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Type</Text>
            <TextInput 
              style={styles.input} 
              value={business.type} 
              onChangeText={(t) => handleChange("type", t)}
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Registration Number</Text>
            <TextInput 
              style={styles.input} 
              value={business.regNumber} 
              onChangeText={(t) => handleChange("regNumber", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>GST / VAT Number</Text>
            <TextInput 
              style={styles.input} 
              value={business.gstVat} 
              onChangeText={(t) => handleChange("gstVat", t)}
            />
          </View>
        </SettingsRow>
      </View>

      <Text weight="bold" style={[styles.headerTitle, { marginTop: ThemeSpacing.xl }]}>Contact & Social</Text>
      
      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              value={business.email} 
              keyboardType="email-address"
              onChangeText={(t) => handleChange("email", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              value={business.phone} 
              keyboardType="phone-pad"
              onChangeText={(t) => handleChange("phone", t)}
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput 
            style={styles.input} 
            value={business.website} 
            keyboardType="url"
            onChangeText={(t) => handleChange("website", t)}
          />
        </View>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Instagram Handle</Text>
            <TextInput 
              style={styles.input} 
              value={business.instagram} 
              onChangeText={(t) => handleChange("instagram", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Facebook Handle</Text>
            <TextInput 
              style={styles.input} 
              value={business.facebook} 
              onChangeText={(t) => handleChange("facebook", t)}
            />
          </View>
        </SettingsRow>
      </View>

      <Text weight="bold" style={[styles.headerTitle, { marginTop: ThemeSpacing.xl }]}>Address & Location</Text>
      
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput 
            style={styles.input} 
            value={business.address} 
            onChangeText={(t) => handleChange("address", t)}
          />
        </View>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput 
              style={styles.input} 
              value={business.city} 
              onChangeText={(t) => handleChange("city", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>State / Province</Text>
            <TextInput 
              style={styles.input} 
              value={business.state} 
              onChangeText={(t) => handleChange("state", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput 
              style={styles.input} 
              value={business.postalCode} 
              onChangeText={(t) => handleChange("postalCode", t)}
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
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Time Zone</Text>
            <TextInput 
              style={styles.input} 
              value={business.timeZone} 
              onChangeText={(t) => handleChange("timeZone", t)}
            />
          </View>
        </SettingsRow>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
  headerTitle: { fontSize: 24, color: ThemeColors.textPrimary },
  headerSubtitle: { fontSize: 14, color: ThemeColors.textMuted, marginTop: 4, marginBottom: ThemeSpacing.xl },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  col: {
    flexDirection: "column",
  },
  fieldGroup: {
    flex: 1,
    gap: ThemeSpacing.sm,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontFamily: "Outfit_500Medium",
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 12,
    gap: ThemeSpacing.md,
  },
  switchRowText: {
    color: ThemeColors.textPrimary, 
    fontSize: 14,
    flex: 1, 
    flexWrap: 'wrap'
  },
  verticalSelector: {
    flexDirection: 'row',
    gap: ThemeSpacing.sm,
    flexWrap: 'wrap'
  },
  verticalBtn: {
    paddingVertical: 10,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  verticalBtnActive: {
    backgroundColor: ThemeColors.emeraldDim,
    borderColor: ThemeColors.emerald,
  },
  verticalBtnText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: '500'
  },
  verticalBtnTextActive: {
    color: ThemeColors.emerald,
    fontWeight: 'bold'
  }
});
