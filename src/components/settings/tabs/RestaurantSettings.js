import React, { useState } from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";
import { FloorPlanBuilderModal } from "./FloorPlanBuilderModal";
import { TouchableOpacity } from "react-native";

import { ThemeColors } from "@/theme/theme";
export function RestaurantSettings() {
  const { settings, updateSetting } = useSettings();
  const { restaurant } = settings;
  const [showFloorPlanBuilder, setShowFloorPlanBuilder] = useState(false);

  const handleChange = (key, value) => updateSetting("restaurant", key, value);

  return (
    <View style={styles.container}>
      <FloorPlanBuilderModal 
        visible={showFloorPlanBuilder} 
        onClose={() => setShowFloorPlanBuilder(false)} 
      />
      <Text weight="bold" style={styles.headerTitle}>Restaurant & F&B Operations</Text>
      <Text style={styles.headerSubtitle}>Manage dining types, service charges, and kitchen workflows.</Text>

      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Default Service Charge (%)</Text>
            <TextInput 
              style={styles.input} 
              value={String(restaurant.serviceCharge)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("serviceCharge", parseFloat(t) || 0)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Default Tip (%)</Text>
            <TextInput 
              style={styles.input} 
              value={String(restaurant.defaultTipPercentage)} 
              keyboardType="numeric"
              onChangeText={(t) => handleChange("defaultTipPercentage", parseFloat(t) || 0)}
            />
          </View>
        </SettingsRow>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Active Dining Modes (Comma Separated)</Text>
          <TextInput 
            style={styles.input} 
            value={restaurant.diningModes.join(", ")} 
            onChangeText={(t) => handleChange("diningModes", t.split(",").map(m => m.trim()))}
          />
        </View>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Kitchen & Floor Management</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enable Table Management</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Use interactive floor plan for Dine-In</Text>
            <Switch 
              value={restaurant.enableTableManagement} 
              onValueChange={(v) => handleChange("enableTableManagement", v)}
            />
          </View>
          {restaurant.enableTableManagement && (
            <TouchableOpacity 
              style={[styles.btnPrimary, { alignSelf: 'flex-start', marginTop: 12 }]}
              onPress={() => setShowFloorPlanBuilder(true)}
            >
              <Text weight="bold" style={styles.btnPrimaryText}>Edit Floor Plan Layout</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Route to KDS</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchRowText}>Send orders directly to Kitchen Display System</Text>
            <Switch 
              value={restaurant.routeToKDS} 
              onValueChange={(v) => handleChange("routeToKDS", v)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
