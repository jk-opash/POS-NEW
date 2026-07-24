import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

export function BranchSettings() {
  const { settings, updateSetting } = useSettings();
  const { branch } = settings;

  const handleChange = (key, value) => updateSetting("branch", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Branch Settings</Text>
      <Text style={styles.headerSubtitle}>Configure specific settings for this physical location.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Branch Code</Text>
            <TextInput 
              style={styles.input} 
              value={branch.code} 
              onChangeText={(t) => handleChange("code", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Branch Status</Text>
            <TextInput 
              style={styles.input} 
              value={branch.status} 
              onChangeText={(t) => handleChange("status", t)}
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Branch Manager</Text>
          <TextInput 
            style={styles.input} 
            value={branch.manager} 
            onChangeText={(t) => handleChange("manager", t)}
          />
        </View>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput 
              style={styles.input} 
              value={branch.contactEmail} 
              onChangeText={(t) => handleChange("contactEmail", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput 
              style={styles.input} 
              value={branch.contactPhone} 
              onChangeText={(t) => handleChange("contactPhone", t)}
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Opening Hours</Text>
            <TextInput 
              style={styles.input} 
              value={branch.openingHours} 
              onChangeText={(t) => handleChange("openingHours", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Capacity (Persons)</Text>
            <TextInput 
              style={styles.input} 
              value={String(branch.capacity)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("capacity", parseInt(t) || 0)}
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Branch Features (Comma Separated)</Text>
          <TextInput 
            style={styles.input} 
            value={branch.features.join(", ")} 
            onChangeText={(t) => handleChange("features", t.split(",").map(f => f.trim()))}
          />
        </View>
      </View>
    </View>
  );
}
