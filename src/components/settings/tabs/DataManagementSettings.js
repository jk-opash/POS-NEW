import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { styles } from "./BusinessSettings"; 
import { Download, Upload } from "lucide-react-native";

export function DataManagementSettings() {
  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Data Management</Text>
      <Text style={styles.headerSubtitle}>Import and export data in CSV/Excel formats.</Text>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', gap: ThemeSpacing.md, flexWrap: 'wrap' }}>
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: ThemeColors.bg,
            padding: ThemeSpacing.lg,
            borderRadius: ThemeRadius.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ThemeColors.border
          }}>
            <Download color={ThemeColors.textPrimary} size={24} style={{ marginBottom: ThemeSpacing.sm }} />
            <Text weight="bold">Export Products (CSV)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: ThemeColors.bg,
            padding: ThemeSpacing.lg,
            borderRadius: ThemeRadius.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ThemeColors.border
          }}>
            <Upload color={ThemeColors.textPrimary} size={24} style={{ marginBottom: ThemeSpacing.sm }} />
            <Text weight="bold">Import Products</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: ThemeSpacing.md, flexWrap: 'wrap', marginTop: ThemeSpacing.md }}>
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: ThemeColors.bg,
            padding: ThemeSpacing.lg,
            borderRadius: ThemeRadius.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ThemeColors.border
          }}>
            <Download color={ThemeColors.textPrimary} size={24} style={{ marginBottom: ThemeSpacing.sm }} />
            <Text weight="bold">Export Customers (CSV)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: ThemeColors.bg,
            padding: ThemeSpacing.lg,
            borderRadius: ThemeRadius.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ThemeColors.border
          }}>
            <Upload color={ThemeColors.textPrimary} size={24} style={{ marginBottom: ThemeSpacing.sm }} />
            <Text weight="bold">Import Customers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
