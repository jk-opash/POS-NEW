import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { CheckCircle2, Clock, AlertTriangle, CalendarX } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

const METRICS = [
  {
    id: "present",
    label: "Days Present",
    value: "18",
    subtitle: "of 22 scheduled",
    icon: CheckCircle2,
    iconColor: ThemeColors.textMuted,
    valueColor: ThemeColors.emerald,
  },
  {
    id: "hours",
    label: "Total Hours",
    value: "142.5h",
    subtitle: "avg 7.9h / day",
    icon: Clock,
    iconColor: ThemeColors.textMuted,
    valueColor: ThemeColors.textPrimary,
  },
  {
    id: "late",
    label: "Late Arrivals",
    value: "2",
    subtitle: "15 min total delay",
    icon: AlertTriangle,
    iconColor: ThemeColors.textMuted,
    valueColor: ThemeColors.amber,
  },
  {
    id: "absent",
    label: "Days Absent",
    value: "1",
    subtitle: "Unpaid leave",
    icon: CalendarX,
    iconColor: ThemeColors.textMuted,
    valueColor: ThemeColors.red,
  },
];

export function MonthlyInsights() {
  const { isDesktop, isTablet, isMiniTab, isMobile } = useResponsive();

  // Desktop & Tablet: horizontal bar (4 in a row)
  // MiniTab: 2×2 grid
  // Mobile: 2×2 grid but tighter
  const is2Col = isMiniTab || isMobile;

  return (
    <View style={styles.container}>
      <Text weight="semibold" style={styles.sectionTitle}>Monthly Summary</Text>

      {/* Desktop / Tablet → single horizontal bar */}
      {(isDesktop || isTablet) && (
        <View style={styles.statsBar}>
          {METRICS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === METRICS.length - 1;
            return (
              <View
                key={item.id}
                style={[styles.statCell, !isLast && styles.statCellDivider]}
              >
                <View style={styles.labelRow}>
                  <Icon size={13} color={item.iconColor} />
                  <Text weight="medium" style={styles.statLabel}>{item.label}</Text>
                </View>
                <Text weight="bold" style={[styles.statValue, { color: item.valueColor }]}>
                  {item.value}
                </Text>
                <Text style={styles.statSubtitle}>{item.subtitle}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* MiniTab / Mobile → 2×2 grid of cards */}
      {is2Col && (
        <View style={styles.grid}>
          {METRICS.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.id} style={[styles.gridCard, isMobile && styles.gridCardMobile]}>
                <View style={styles.labelRow}>
                  <Icon size={13} color={item.iconColor} />
                  <Text weight="medium" style={styles.statLabel}>{item.label}</Text>
                </View>
                <Text weight="bold" style={[styles.statValueGrid, { color: item.valueColor }]}>
                  {item.value}
                </Text>
                <Text style={styles.statSubtitle}>{item.subtitle}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.md,
  },

  // ── Horizontal bar (desktop / tablet) ──────────────────────────────
  statsBar: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
  },
  statCell: {
    flex: 1,
    paddingVertical: ThemeSpacing.xl,
    paddingHorizontal: ThemeSpacing.lg,
  },
  statCellDivider: {
    borderRightWidth: 1,
    borderRightColor: ThemeColors.border,
  },
  statValue: {
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 4,
  },

  // ── 2×2 grid (miniTab / mobile) ────────────────────────────────────
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  gridCard: {
    // Each card takes ~half width minus the gap
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
    paddingVertical: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.lg,
  },
  gridCardMobile: {
    paddingVertical: ThemeSpacing.md,
  },
  statValueGrid: {
    fontSize: 22,
    lineHeight: 26,
    marginBottom: 2,
  },

  // ── Shared ──────────────────────────────────────────────────────────
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: ThemeSpacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  statSubtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
});


