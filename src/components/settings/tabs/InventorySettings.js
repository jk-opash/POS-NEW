import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { ThemeColors } from "@/theme/theme";
export function InventorySettings() {
  const { settings, updateSetting } = useSettings();
  const { inventory } = settings;

  const handleChange = (key, value) => updateSetting("inventory", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Inventory Management</Text>
      <Text style={styles.headerSubtitle}>Control stock behaviors, purchasing, and waste tracking.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Low Stock Threshold (Units)</Text>
            <TextInput 
              style={styles.input} 
              value={String(inventory.lowStockThreshold)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("lowStockThreshold", parseInt(t) || 0)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Barcode Format</Text>
            <TextInput 
              style={styles.input} 
              value={inventory.barcodeFormat} 
              onChangeText={(t) => handleChange("barcodeFormat", t)}
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Default Supplier Name</Text>
          <TextInput 
            style={styles.input} 
            value={inventory.defaultSupplier} 
            onChangeText={(t) => handleChange("defaultSupplier", t)}
          />
        </View>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Advanced Operations</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Allow Negative Stock</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Allow sales even if items are out of stock</Text>
            <Switch 
              value={inventory.allowNegative} 
              onValueChange={(v) => handleChange("allowNegative", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Auto-Purchase Orders</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Generate PO drafts when threshold is met</Text>
            <Switch 
              value={inventory.autoPurchaseOrders} 
              onValueChange={(v) => handleChange("autoPurchaseOrders", v)}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Track Waste & Spoilage</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Require reason codes for inventory adjustments</Text>
            <Switch 
              value={inventory.trackWaste} 
              onValueChange={(v) => handleChange("trackWaste", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
