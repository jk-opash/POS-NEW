import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { ThemeColors } from "@/theme/theme";
export function SecuritySettings() {
  const { settings, updateSetting } = useSettings();
  const { security } = settings;

  const handleChange = (key, value) => updateSetting("security", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Security & 2FA</Text>
      <Text style={styles.headerSubtitle}>Manage authentication protocols and system access restrictions.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password Expiry (Days)</Text>
            <TextInput 
              style={styles.input} 
              value={String(security.passwordExpiryDays)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("passwordExpiryDays", parseInt(t) || 0)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Max Login Attempts</Text>
            <TextInput 
              style={styles.input} 
              value={String(security.maxLoginAttempts)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("maxLoginAttempts", parseInt(t) || 0)}
            />
          </View>
        </SettingsRow>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Access Toggles</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enforce Strong Passwords</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Require symbols, numbers, and uppercase for accounts</Text>
            <Switch 
              value={security.strongPasswords} 
              onValueChange={(v) => handleChange("strongPasswords", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Two-Factor Authentication (2FA)</Text>
          <View style={styles.switchRow}>
            <Text style={{color: ThemeColors.white, fontSize: 14}}>Require 2FA for all administrative accounts</Text>
            <Switch 
              value={security.twoFactor} 
              onValueChange={(v) => handleChange("twoFactor", v)}
            />
          </View>
        </View>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>IP Whitelisting</Text>
          <View style={styles.switchRow}>
            <Text style={{color: ThemeColors.white, fontSize: 14}}>Restrict POS login to store network IPs only</Text>
            <Switch 
              value={security.ipWhitelisting} 
              onValueChange={(v) => handleChange("ipWhitelisting", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
