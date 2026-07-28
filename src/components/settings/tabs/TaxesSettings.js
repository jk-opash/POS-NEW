import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";
import { ThemeColors } from "@/theme/theme";

export function TaxesSettings() {
  const { settings, updateSetting } = useSettings();
  const { tax, restaurant } = settings;

  const handleTaxChange = (key, value) => updateSetting("tax", key, value);
  const handleRestaurantChange = (key, value) => updateSetting("restaurant", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Taxes & Fees</Text>
      <Text style={styles.headerSubtitle}>Configure tax rates and service charges.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Default Tax Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={String(tax.defaultRate)}
              onChangeText={(v) => handleTaxChange("defaultRate", Number(v) || 0)}
              keyboardType="numeric"
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tax Inclusive Pricing</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Item prices already include tax</Text>
            <Switch 
              value={tax.inclusive} 
              onValueChange={(v) => handleTaxChange("inclusive", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enable GST Features</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Show CGST/SGST breakdowns</Text>
            <Switch 
              value={tax.gstEnabled} 
              onValueChange={(v) => handleTaxChange("gstEnabled", v)}
            />
          </View>
        </View>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12, marginBottom: 8 }}>Service Charges</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enable Service Charge</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Apply service charge on dine-in</Text>
            <Switch 
              value={restaurant.serviceChargeEnabled} 
              onValueChange={(v) => handleRestaurantChange("serviceChargeEnabled", v)}
            />
          </View>
        </View>

        {restaurant.serviceChargeEnabled && (
          <SettingsRow>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Service Charge (%)</Text>
              <TextInput
                style={styles.input}
                value={String(restaurant.serviceCharge)}
                onChangeText={(v) => handleRestaurantChange("serviceCharge", Number(v) || 0)}
                keyboardType="numeric"
              />
            </View>
          </SettingsRow>
        )}
      </View>
    </View>
  );
}
