import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { useInventoryContext } from '@/context/InventoryContext';

export function AdjustmentsTab() {
  const { stockAdjustments } = useInventoryContext();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={{ minWidth: 800, width: '100%' }}>
        <View style={styles.tableHeader}>
        <Text weight="bold" style={[styles.col, { width: 150 }]}>Reference</Text>
        <Text weight="bold" style={[styles.col, { width: 180 }]}>Date</Text>
        <Text weight="bold" style={[styles.col, { width: 220 }]}>Product</Text>
        <Text weight="bold" style={[styles.col, { flex: 1, minWidth: 200 }]}>Reason</Text>
        <Text weight="bold" style={[styles.col, { width: 120, textAlign: 'right' }]}>Qty Adjusted</Text>
        <Text weight="bold" style={[styles.col, { width: 120, textAlign: 'right' }]}>Performed By</Text>
      </View>
      
      {stockAdjustments.map(item => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={[styles.col, { width: 150, color: ThemeColors.blue }]}>{item.id}</Text>
          <Text style={[styles.col, { width: 180, color: ThemeColors.textMuted }]}>{new Date(item.timestamp).toLocaleString()}</Text>
          <Text style={[styles.col, { width: 220 }]} numberOfLines={1}>{item.itemName}</Text>
          <Text style={[styles.col, { flex: 1, minWidth: 200, color: ThemeColors.textSecondary }]}>{item.reason}</Text>
          
          <Text weight="bold" style={[styles.col, { 
            width: 120, 
            textAlign: 'right',
            color: item.quantityChange > 0 ? ThemeColors.emerald : ThemeColors.rose
          }]}>
            {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
          </Text>
          
          <Text style={[styles.col, { width: 120, textAlign: 'right', color: ThemeColors.textSecondary }]}>{item.performedBy}</Text>
        </View>
      ))}
      {stockAdjustments.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: ThemeColors.textMuted }}>No stock adjustments recorded.</Text>
        </View>
      )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: 'center',
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeSuccess: { backgroundColor: ThemeColors.emerald + '20' },
  badgeWarning: { backgroundColor: ThemeColors.amber + '20' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgeTextSuccess: { color: ThemeColors.emerald },
  badgeTextWarning: { color: ThemeColors.amber },
});
