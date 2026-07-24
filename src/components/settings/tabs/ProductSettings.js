import React from "react";
import { View, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 

export function ProductSettings() {
  const { settings, updateSetting } = useSettings();
  const { product } = settings;

  const handleChange = (key, value) => updateSetting("product", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Product Settings</Text>
      <Text style={styles.headerSubtitle}>Manage product catalog rules and behaviors.</Text>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Auto-generate SKU</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Automatically create SKUs for new products</Text>
            <Switch 
              value={product.skuAutoGenerate} 
              onValueChange={(v) => handleChange("skuAutoGenerate", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
