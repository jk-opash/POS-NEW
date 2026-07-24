import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { useInventoryContext } from '@/context/InventoryContext';
import { Clock } from 'lucide-react-native';

export function AuditLogTab() {
  const { stockLedger } = useInventoryContext();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={{ minWidth: 800, width: '100%' }}>
        <View style={styles.tableHeader}>
        <Text weight="bold" style={[styles.col, { width: 100 }]}>Log ID</Text>
        <Text weight="bold" style={[styles.col, { width: 160 }]}>Timestamp</Text>
        <Text weight="bold" style={[styles.col, { width: 160 }]}>User / System</Text>
        <Text weight="bold" style={[styles.col, { width: 180 }]}>Action</Text>
        <Text weight="bold" style={[styles.col, { flex: 1, minWidth: 250 }]}>Details</Text>
      </View>
      
      {stockLedger.map(item => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={[styles.col, { width: 100, color: ThemeColors.textMuted }]}>{item.id.split('-').slice(0, 2).join('-')}</Text>
          
          <View style={[styles.col, { width: 160, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
            <Clock size={12} color={ThemeColors.textMuted} />
            <Text style={{ fontSize: 13, color: ThemeColors.textSecondary }}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
          
          <View style={[styles.col, { width: 160 }]}>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>{item.performedBy || 'System'}</Text>
            </View>
          </View>
          
          <Text weight="medium" style={[styles.col, { width: 180, color: ThemeColors.textPrimary }]}>{item.type}</Text>
          <Text style={[styles.col, { flex: 1, minWidth: 250, color: ThemeColors.textSecondary }]} numberOfLines={2}>
            {item.itemName} ({item.quantityChange > 0 ? '+' : ''}{item.quantityChange}) - {item.reason}
          </Text>
        </View>
      ))}
      
      {stockLedger.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: ThemeColors.textMuted }}>No stock movements recorded yet.</Text>
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
  userBadge: {
    backgroundColor: ThemeColors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  userBadgeText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
  }
});
