import React from "react";
import { View, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { ThemeColors } from "@/theme/theme";
export function NotificationSettings() {
  const { settings, updateSetting } = useSettings();
  const { notification } = settings;

  const handleChange = (key, value) => updateSetting("notification", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Notifications</Text>
      <Text style={styles.headerSubtitle}>Manage email, SMS, and in-app alerts.</Text>

      <View style={styles.card}>
        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginBottom: 4 }}>Manager Alerts</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Receipts</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Send digital receipts via email</Text>
            <Switch 
              value={notification.emailReceipts} 
              onValueChange={(v) => handleChange("emailReceipts", v)}
            />
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <View style={styles.switchRow}>
            <Text style={{color: ThemeColors.white, fontSize: 14}}>Low Stock Push Notifications</Text>
            <Switch value={notification.lowStockAlerts} onValueChange={(v) => handleChange("lowStockAlerts", v)} />
          </View>
        </View>
      </View>
    </View>
  );
}
