import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { CheckCircle2, Clock } from "lucide-react-native";

export function LiveSettlementStatus({ settled, unsettled, running }) {
  const total = settled + unsettled + running;
  
  return (
    <View style={styles.card}>
      <Text weight="semibold" style={styles.title}>Live Settlement Status</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <CheckCircle2 size={24} color={ThemeColors.emerald} style={styles.icon} />
          <Text style={styles.statValue}>{settled}</Text>
          <Text style={styles.statLabel}>Settled Bills</Text>
        </View>
        
        <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: ThemeColors.borderSubtle }]}>
          <Clock size={24} color={ThemeColors.amber} style={styles.icon} />
          <Text style={styles.statValue}>{unsettled}</Text>
          <Text style={styles.statLabel}>Unsettled Bills</Text>
        </View>
        
        <View style={styles.statBox}>
          <Clock size={24} color={ThemeColors.blue} style={styles.icon} />
          <Text style={styles.statValue}>{running}</Text>
          <Text style={styles.statLabel}>Running Tables</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(settled / total) * 100}%`, backgroundColor: ThemeColors.emerald }]} />
        <View style={[styles.progressBar, { width: `${(unsettled / total) * 100}%`, backgroundColor: ThemeColors.amber }]} />
        <View style={[styles.progressBar, { width: `${(running / total) * 100}%`, backgroundColor: ThemeColors.blue }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  progressContainer: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: ThemeColors.bg,
  },
  progressBar: {
    height: "100%",
  },
});
