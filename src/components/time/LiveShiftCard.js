import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { LogOut, Coffee, Zap, Timer } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

function pad(n) {
  return String(n).padStart(2, '0');
}

export function LiveShiftCard() {
  const { isMobile } = useResponsive();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const shiftStart = new Date();
  shiftStart.setHours(9, 0, 0, 0);
  const elapsed = Math.max(0, Math.floor((now - shiftStart) / 1000));
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const elapsedLabel = `${pad(h)}:${pad(m)}:${pad(s)}`;
  const progress = Math.min(1, elapsed / (8 * 3600));

  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>

      {/* Left: Clock + Shift info */}
      <View style={[styles.leftPane, isMobile && styles.leftPaneMobile]}>
        <View style={styles.statusChip}>
          <View style={styles.pulseDot} />
          <Text weight="semibold" style={styles.statusText}>ON SHIFT</Text>
        </View>

        <Text weight="bold" style={styles.elapsedTime}>{elapsedLabel}</Text>
        <Text style={styles.shiftLabel}>Time elapsed today</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelText}>09:00 AM</Text>
          <Text style={styles.progressLabelText}>{`${Math.round(progress * 100)}% of 8h`}</Text>
          <Text style={styles.progressLabelText}>05:00 PM</Text>
        </View>
      </View>

      {/* Divider */}
      {!isMobile && <View style={styles.divider} />}
      {isMobile && <View style={styles.dividerH} />}

      {/* Right: Actions */}
      <View style={[styles.rightPane, isMobile && styles.rightPaneMobile]}>
        <Text weight="semibold" style={styles.actionsTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.punchOutBtn} activeOpacity={0.85}>
          <LogOut size={18} color={ThemeColors.textWhite} />
          <Text weight="semibold" style={styles.punchOutText}>Punch Out</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
            <Coffee size={16} color={ThemeColors.amber} />
            <Text weight="medium" style={[styles.secondaryBtnText, { color: ThemeColors.amber }]}>
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
            <Zap size={16} color={ThemeColors.blue} />
            <Text weight="medium" style={[styles.secondaryBtnText, { color: ThemeColors.blue }]}>
              Break
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Timer size={13} color={ThemeColors.textMuted} />
          <Text style={styles.metaText}>Shift: 09:00 AM – 05:00 PM</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: 'hidden',
  },
  cardMobile: {
    flexDirection: 'column',
  },
  leftPane: {
    flex: 1.4,
    padding: ThemeSpacing.xxl,
    backgroundColor: ThemeColors.surfaceElevated,
  },
  leftPaneMobile: {
    flex: undefined,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: ThemeColors.emeraldDim,
    paddingVertical: 5,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.full,
    marginBottom: ThemeSpacing.xl,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ThemeColors.emerald,
  },
  statusText: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: ThemeColors.emerald,
    textTransform: 'uppercase',
  },
  elapsedTime: {
    fontSize: 44,
    letterSpacing: -1,
    color: ThemeColors.textPrimary,
    lineHeight: 48,
    marginBottom: ThemeSpacing.xs,
  },
  shiftLabel: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.xl,
  },
  progressTrack: {
    height: 6,
    backgroundColor: ThemeColors.border,
    borderRadius: ThemeRadius.full,
    overflow: 'hidden',
    marginBottom: ThemeSpacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ThemeColors.blue,
    borderRadius: ThemeRadius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: ThemeColors.border,
  },
  dividerH: {
    height: 1,
    backgroundColor: ThemeColors.border,
  },
  rightPane: {
    flex: 1,
    padding: ThemeSpacing.xxl,
    justifyContent: 'center',
    gap: ThemeSpacing.lg,
  },
  rightPaneMobile: {
    flex: undefined,
  },
  actionsTitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: ThemeSpacing.xs,
  },
  punchOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.red,
    paddingVertical: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
  },
  punchOutText: {
    fontSize: 15,
    color: ThemeColors.textWhite,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: ThemeSpacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surfaceElevated,
  },
  secondaryBtnText: {
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: ThemeSpacing.xs,
  },
  metaText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
});
