import { Text } from "@/components/ui/Text";
import { LOW_STOCK, OUT_OF_STOCK, SLOW_MOVING_PRODUCTS } from "@/constants/dashboard";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TABS = [
  { key: "lowStock",    label: "Low Stock",   color: ThemeColors.amber  },
  { key: "outOfStock",  label: "Out of Stock", color: ThemeColors.red    },
  { key: "slow",        label: "Slow Moving",  color: ThemeColors.purple },
];

export function StockAlerts({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      <Text weight="bold" style={styles.title}>📦 Product Alerts</Text>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { backgroundColor: tab.color + "20", borderColor: tab.color }]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              weight={activeTab === tab.key ? "semibold" : "regular"}
              style={[styles.tabText, activeTab === tab.key && { color: tab.color }]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "lowStock" && LOW_STOCK.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text weight="medium" style={styles.itemName}>{item.name}</Text>
            <Text weight="regular" style={styles.itemSku}>{item.sku}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text weight="bold" style={[styles.badge, { color: ThemeColors.amber, backgroundColor: ThemeColors.amberDim }]}>
              {item.current} / {item.minimum}
            </Text>
          </View>
        </View>
      ))}

      {activeTab === "outOfStock" && OUT_OF_STOCK.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text weight="medium" style={styles.itemName}>{item.name}</Text>
            <Text weight="regular" style={styles.itemSku}>{item.sku}</Text>
          </View>
          <Text weight="bold" style={[styles.badge, { color: ThemeColors.red, backgroundColor: ThemeColors.redDim }]}>
            {item.lastAvailable}
          </Text>
        </View>
      ))}

      {activeTab === "slow" && SLOW_MOVING_PRODUCTS.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text weight="medium" style={styles.itemName}>{item.name}</Text>
            <Text weight="regular" style={styles.itemSku}>Last sold: {item.lastSold}</Text>
          </View>
          <Text weight="bold" style={[styles.badge, { color: ThemeColors.purple, backgroundColor: ThemeColors.purpleDim }]}>
            {item.qty} sold
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    marginTop: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  title: { fontSize: 15, color: ThemeColors.textPrimary, marginBottom: ThemeSpacing.md },
  tabs:  { flexDirection: "row", gap: ThemeSpacing.sm, marginBottom: ThemeSpacing.lg },
  tab:   { paddingHorizontal: ThemeSpacing.md, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: ThemeColors.border },
  tabText: { fontSize: 11, color: ThemeColors.textSecondary },
  row:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: ThemeSpacing.sm, borderTopWidth: 1, borderColor: ThemeColors.borderSubtle },
  rowLeft:  { flex: 1 },
  rowRight: { alignItems: "flex-end" },
  itemName: { fontSize: 13, color: ThemeColors.textPrimary },
  itemSku:  { fontSize: 11, color: ThemeColors.textMuted, marginTop: 2 },
  badge:    { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
});
