import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Clock, User } from "lucide-react-native";

export function LogCard({ item }) {
  const getSeverityColor = (severity) => {
    if (severity === "critical") return ThemeColors.red;
    if (severity === "warning") return ThemeColors.amber;
    return ThemeColors.blue;
  };

  const severityColor = getSeverityColor(item.severity);

  return (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text weight="bold" style={styles.logAction}>
          {item.action}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: severityColor + "20" },
          ]}
        >
          <Text
            weight="bold"
            style={[styles.badgeText, { color: severityColor }]}
          >
            {item.severity.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.logDetails}>{item.details}</Text>

      <View style={styles.logFooter}>
        <View style={styles.footerRow}>
          <User size={14} color={ThemeColors.textSecondary} />
          <Text style={styles.footerText}>{item.actor_name || "System"}</Text>
        </View>
        <View style={styles.footerRow}>
          <Clock size={14} color={ThemeColors.textSecondary} />
          <Text style={styles.footerText}>
            {new Date(item.created_at).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logCard: {
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.sm,
  },
  logAction: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
  },
  badgeText: {
    fontSize: 10,
  },
  logDetails: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.md,
    lineHeight: 20,
  },
  logFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    paddingTop: ThemeSpacing.md,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginLeft: ThemeSpacing.sm,
  },
});
