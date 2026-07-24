import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { Dropdown } from "@/components/ui/Dropdown";
import { ThemeColors } from "@/theme/theme";

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
];

export function SystemPreferences() {
  const { settings, updateSetting } = useSettings();
  const { system } = settings;

  const handleChange = (key, value) => updateSetting("system", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>System Preferences</Text>
      <Text style={styles.headerSubtitle}>Customize behavior, language, and POS appearance.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Language</Text>
            <Dropdown 
              options={LANGUAGE_OPTIONS}
              value={system.language} 
              onChange={(value) => handleChange("language", value)}
              style={styles.input}
            />
          </View>
        </SettingsRow>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Analytics & Debugging</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enable App Analytics</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Send crash reports and telemetry data</Text>
            <Switch 
              value={system.enableAnalytics} 
              onValueChange={(v) => handleChange("enableAnalytics", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Developer Debug Mode</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Enable verbose logging for troubleshooting</Text>
            <Switch 
              value={system.debugMode} 
              onValueChange={(v) => handleChange("debugMode", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
