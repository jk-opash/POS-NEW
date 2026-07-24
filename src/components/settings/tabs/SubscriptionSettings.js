import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

export function SubscriptionSettings() {
  const { settings, updateSetting } = useSettings();
  const { subscription } = settings;

  const handleChange = (key, value) => updateSetting("subscription", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Subscription & Billing</Text>
      <Text style={styles.headerSubtitle}>Manage your current POS plan and payment details.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Plan</Text>
            <TextInput 
              style={styles.input} 
              value={subscription.plan} 
              onChangeText={(t) => handleChange("plan", t)}
              editable={false}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Billing Cycle</Text>
            <TextInput 
              style={styles.input} 
              value={subscription.billingCycle} 
              onChangeText={(t) => handleChange("billingCycle", t)}
              editable={false}
            />
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Next Billing Date</Text>
            <TextInput 
              style={styles.input} 
              value={subscription.nextBillingDate} 
              onChangeText={(t) => handleChange("nextBillingDate", t)}
              editable={false}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Primary Payment Method</Text>
            <TextInput 
              style={styles.input} 
              value={subscription.paymentMethod} 
              onChangeText={(t) => handleChange("paymentMethod", t)}
              editable={false}
            />
          </View>
        </SettingsRow>
      </View>
    </View>
  );
}
