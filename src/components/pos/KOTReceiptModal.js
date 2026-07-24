import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, Printer } from "lucide-react-native";

export function KOTReceiptModal({ visible, kot, onClose }) {
  if (!visible || !kot) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>KOT Preview</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.receipt}>
              <Text weight="bold" style={styles.brandName}>SPICE GARDEN</Text>
              <Text style={styles.receiptType}>--- KITCHEN ORDER TICKET ---</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>KOT No: {kot.kotNumber}</Text>
                <Text style={styles.metaText}>{new Date(kot.time).toLocaleTimeString()}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Table: {kot.table ? kot.table.name : "N/A"}</Text>
                <Text style={styles.metaText}>Type: {kot.orderType}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.tableHeader}>
                <Text weight="bold" style={[styles.columnItem, { flex: 3 }]}>Item</Text>
                <Text weight="bold" style={styles.columnQty}>Qty</Text>
              </View>
              
              <View style={styles.divider} />
              
              {kot.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={{ flex: 3 }}>
                    <Text style={styles.itemName}>
                      {item.product.name} {item.variant ? `(${item.variant.name})` : ""}
                    </Text>
                    {item.addons && item.addons.length > 0 && (
                      <Text style={styles.itemModifiers}>
                        {item.addons.map(a => a.name).join(", ")}
                      </Text>
                    )}
                    {item.notes ? (
                      <Text style={styles.itemNotes}>Note: {item.notes}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.itemQty}>{item.quantity}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              <Text style={styles.footerText}>*** END OF KOT ***</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.printBtn} onPress={onClose}>
              <Printer size={18} color={ThemeColors.white} />
              <Text weight="bold" style={styles.printBtnText}>Print KOT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.md,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: ThemeSpacing.xl,
    backgroundColor: "#F9F9F9",
  },
  receipt: {
    backgroundColor: ThemeColors.white,
    padding: ThemeSpacing.xl,
    borderRadius: ThemeRadius.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brandName: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  receiptType: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: ThemeSpacing.lg,
    color: ThemeColors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.md,
    borderStyle: "dashed",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnItem: {
    fontSize: 12,
  },
  columnQty: {
    fontSize: 12,
    width: 30,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  itemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  itemModifiers: {
    fontSize: 11,
    color: ThemeColors.textSecondary,
    fontStyle: "italic",
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 11,
    color: ThemeColors.amber,
    marginTop: 2,
  },
  itemQty: {
    fontSize: 14,
    width: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: ThemeSpacing.md,
  },
  footer: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  printBtn: {
    flexDirection: "row",
    backgroundColor: ThemeColors.emerald,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  printBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
