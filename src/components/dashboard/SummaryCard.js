import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";

// ─── Growth Badge ─────────────────────────────────────────────────────────────
function GrowthBadge({ label, positive }) {
  const bg = positive ? ThemeColors.emeraldDim : ThemeColors.redDim;
  const color = positive ? ThemeColors.emerald : ThemeColors.red;
  const icon = positive ? "↗" : "↘";
  return (
    <View style={styles.growthBadgeContainer}>
      <View style={[styles.growthBadge, { backgroundColor: bg }]}>
        <Text weight="bold" style={[styles.growthText, { color }]}>
          {label} {icon}
        </Text>
      </View>
      <Text weight="medium" style={styles.growthSubtext}>From Last Month</Text>
    </View>
  );
}

// ─── Metric Row ──────────────────────────────────────────────────────────────
export function MetricRow({ label, value, highlight, arrow }) {
  const arrowChar = arrow === "up" ? "↑" : arrow === "down" ? "↓" : null;
  const arrowColor = arrow === "up" ? ThemeColors.emerald : ThemeColors.red;
  return (
    <View style={styles.metricRow}>
      <Text weight="medium" style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        {arrowChar && (
          <Text weight="extrabold" style={[styles.metricArrow, { color: arrowColor }]}>
            {arrowChar}
          </Text>
        )}
        <Text
          weight="bold"
          style={[styles.metricValue, highlight && { color: ThemeColors.emerald }]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
export function SummaryCard({ icon, title, primary, badge, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <View style={styles.iconWrap}>{icon}</View>
            <Text weight="bold" style={styles.cardTitle}>{title}</Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <Text weight="bold" style={styles.primary}>{primary}</Text>
          {badge && (
            <GrowthBadge label={badge.label} positive={badge.positive} />
          )}
        </View>

        {children && (
          <>
            <View style={styles.divider} />
            {children}
          </>
        )}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    flex: 1,
    minWidth: 130,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  body: {
    padding: ThemeSpacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.lg,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  primary: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
  },
  growthBadgeContainer: {
    alignItems: "flex-end",
    gap: 2,
  },
  growthBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  growthText: {
    fontSize: 10,
  },
  growthSubtext: {
    fontSize: 9,
    color: ThemeColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metricArrow: {
    fontSize: 10,
  },
  metricValue: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
});
