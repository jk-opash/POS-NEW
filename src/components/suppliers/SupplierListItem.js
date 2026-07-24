import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { Star, ChevronRight, Building } from 'lucide-react-native';

export function SupplierListItem({ item, onPress, isMobile }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return ThemeColors.emerald;
      case 'Blocked': return ThemeColors.rose;
      case 'Archived': return ThemeColors.amber;
      default: return ThemeColors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoWrap}>
        <Text weight="bold" style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.subInfoWrap}>
          <Text style={styles.empId}>{item.id}</Text>
          <Text style={styles.separator}>|</Text>
          <Building size={12} color={ThemeColors.textMuted} />
          <Text style={styles.empId} numberOfLines={1}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.detailRow}>
          <Star size={16} color={ThemeColors.amber} fill={ThemeColors.amber} />
          <Text style={styles.detailText}>{item.performance?.overallRating} Rating</Text>
        </View>
        <ChevronRight size={20} color={ThemeColors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.lg,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: ThemeSpacing.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ThemeColors.surfaceHighlight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surfaceHighlight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoWrap: {
    marginBottom: ThemeSpacing.lg,
  },
  name: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  subInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  separator: {
    color: ThemeColors.border,
  },
  empId: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginBottom: ThemeSpacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
});
