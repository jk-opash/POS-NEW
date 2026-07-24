import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { AlertCircle, Clock, CheckCircle2, Info } from "lucide-react-native";

export function ReportAlertsPanel({ title, alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text weight="bold" style={styles.cardTitle}>{title || "Active Alerts"}</Text>
      
      <View style={styles.list}>
        {alerts.map((alert, index) => {
          const isCritical = alert.type === 'critical';
          const isWarning = alert.type === 'warning';
          const Icon = isCritical ? AlertCircle : isWarning ? AlertCircle : Info;
          const color = isCritical ? ThemeColors.red : isWarning ? ThemeColors.amber : ThemeColors.blue;
          const bg = isCritical ? ThemeColors.redDim : isWarning ? ThemeColors.amber + "20" : ThemeColors.blue + "20";

          return (
            <View key={alert.id || index} style={styles.alertItem}>
              <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                <Icon size={18} color={color} />
              </View>
              <View style={styles.alertContent}>
                <Text weight="medium" style={styles.alertMsg}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              {alert.action && (
                <View style={styles.actionBtn}>
                  <Text weight="bold" style={[styles.actionText, { color }]}>{alert.action}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function ReportActivityFeed({ title, activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text weight="bold" style={styles.cardTitle}>{title || "Recent Activity"}</Text>
      
      <View style={styles.list}>
        {activities.map((act, index) => (
          <View key={act.id || index} style={styles.activityItem}>
            <View style={styles.activityDot} />
            {index !== activities.length - 1 && <View style={styles.activityLine} />}
            
            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <Text weight="medium" style={styles.activityEvent}>{act.event}</Text>
                <View style={styles.timeWrap}>
                  <Clock size={12} color={ThemeColors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.activityTime}>{act.time}</Text>
                </View>
              </View>
              <Text style={styles.activityDetail}>{act.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.xl,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xl,
  },
  list: {
    flexDirection: "column",
    gap: ThemeSpacing.lg,
  },
  // Alerts Styles
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertMsg: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  alertTime: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.background,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    marginLeft: ThemeSpacing.sm,
  },
  actionText: {
    fontSize: 12,
  },
  // Activity Styles
  activityItem: {
    flexDirection: "row",
    position: "relative",
    minHeight: 50,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ThemeColors.blue,
    marginTop: 6,
    marginRight: ThemeSpacing.md,
    zIndex: 2,
  },
  activityLine: {
    position: "absolute",
    left: 4.5,
    top: 16,
    bottom: -16,
    width: 1,
    backgroundColor: ThemeColors.border,
    zIndex: 1,
  },
  activityContent: {
    flex: 1,
    paddingBottom: ThemeSpacing.md,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  activityEvent: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  activityDetail: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
});
