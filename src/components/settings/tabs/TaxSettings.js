import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { ThemeColors } from "@/theme/theme";
export function TaxSettings() {
  const { settings, updateSetting } = useSettings();
  const { tax } = settings;

  const handleChange = (key, value) => updateSetting("tax", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Tax & Compliance</Text>
      <Text style={styles.headerSubtitle}>Configure regional taxation rules and rates.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Global Tax Rate (%)</Text>
            <TextInput 
              style={styles.input} 
              value={String(tax.defaultRate)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("defaultRate", parseFloat(t) || 0)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tax Registration ID</Text>
            <TextInput 
              style={styles.input} 
              value={tax.taxId} 
              onChangeText={(t) => handleChange("taxId", t)}
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Regional Tax (%)</Text>
            <TextInput 
              style={styles.input} 
              value={String(tax.regionalTax)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("regionalTax", parseFloat(t) || 0)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Service Tax (%)</Text>
            <TextInput 
              style={styles.input} 
              value={String(tax.serviceTax)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("serviceTax", parseFloat(t) || 0)}
            />
          </View>
        </SettingsRow>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Application Rules</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tax Inclusive Pricing</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Are your product prices inclusive of tax?</Text>
            <Switch 
              value={tax.inclusive} 
              onValueChange={(v) => handleChange("inclusive", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Compound Taxes</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Apply secondary taxes on top of primary tax</Text>
            <Switch 
              value={tax.compound} 
              onValueChange={(v) => handleChange("compound", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enable Tax Exemptions</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Allow staff to remove tax for exempt customers</Text>
            <Switch 
              value={tax.exemptionsEnabled} 
              onValueChange={(v) => handleChange("exemptionsEnabled", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
