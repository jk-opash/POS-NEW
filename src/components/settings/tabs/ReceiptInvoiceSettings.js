import React from "react";
import { View, TextInput, Switch } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { styles } from "./BusinessSettings"; 
import { SettingsRow } from "../SettingsRow";

import { ThemeColors } from "@/theme/theme";
export function ReceiptInvoiceSettings() {
  const { settings, updateSetting } = useSettings();
  const { receipt, invoice } = settings;

  const handleReceiptChange = (key, value) => updateSetting("receipt", key, value);
  const handleInvoiceChange = (key, value) => updateSetting("invoice", key, value);

  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.headerTitle}>Receipt Settings</Text>
      <Text style={styles.headerSubtitle}>Configure printed and digital receipt formats.</Text>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Receipt Header Message</Text>
          <TextInput 
            style={styles.input} 
            value={receipt.header} 
            onChangeText={(t) => handleReceiptChange("header", t)}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Receipt Footer Message</Text>
          <TextInput 
            style={styles.input} 
            value={receipt.footer} 
            onChangeText={(t) => handleReceiptChange("footer", t)}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Feedback QR Code URL</Text>
          <TextInput 
            style={styles.input} 
            value={receipt.qrCodeUrl} 
            onChangeText={(t) => handleReceiptChange("qrCodeUrl", t)}
          />
        </View>

        <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.white, marginTop: 12 }}>Print Toggles</Text>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchRowText}>Print Tax</Text>
              <Switch value={receipt.showTax} onValueChange={(v) => handleReceiptChange("showTax", v)} />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchRowText}>Print Logo</Text>
              <Switch value={receipt.printLogo} onValueChange={(v) => handleReceiptChange("printLogo", v)} />
            </View>
          </View>
        </SettingsRow>

        <SettingsRow>
          <View style={styles.fieldGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchRowText}>Show Cashier</Text>
              <Switch value={receipt.showCashierName} onValueChange={(v) => handleReceiptChange("showCashierName", v)} />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchRowText}>Print Barcode</Text>
              <Switch value={receipt.barcodeEnabled} onValueChange={(v) => handleReceiptChange("barcodeEnabled", v)} />
            </View>
          </View>
        </SettingsRow>
      </View>

      <Text weight="bold" style={[styles.headerTitle, { marginTop: 32 }]}>Invoice Settings</Text>
      
      <View style={styles.card}>
        <SettingsRow>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Invoice Prefix</Text>
            <TextInput 
              style={styles.input} 
              value={invoice.prefix} 
              onChangeText={(t) => handleInvoiceChange("prefix", t)}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Default Due Days</Text>
            <TextInput 
              style={styles.input} 
              value={String(invoice.dueDays)} 
              keyboardType="numeric"
              onChangeText={(t) => handleInvoiceChange("dueDays", parseInt(t) || 0)}
            />
          </View>
        </SettingsRow>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bank Details</Text>
          <TextInput 
            style={styles.input} 
            value={invoice.bankDetails} 
            onChangeText={(t) => handleInvoiceChange("bankDetails", t)}
          />
        </View>
      </View>
    </View>
  );
}
