import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemeSpacing, ThemeColors, ThemeRadius } from "@/theme/theme";
import { SummaryCard, MetricRow } from "@/components/dashboard/SummaryCard";
import { ReportAlertsPanel, ReportActivityFeed } from "@/components/reports/ReportWidgets";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { Users, Briefcase } from "lucide-react-native";

export function EmployeeReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const { employees, summary } = dash;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View key="attendance" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Users size={18} color={ThemeColors.blue} />}
          title="Attendance Overview"
          primary={`${(employees?.attendance?.present / employees?.attendance?.total * 100).toFixed(1)}%`}
          badge={{ label: "1.2%", positive: true }}
        >
          <MetricRow 
            label="Present / Absent" 
            value={`${employees?.attendance?.present} / ${employees?.attendance?.absent}`} 
          />
          <MetricRow 
            label="Late Arrivals" 
            value={employees?.attendance?.lateArrivals?.toString()} 
            arrow="down"
          />
        </SummaryCard>
      </View>,
      
      <View key="perf" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Briefcase size={18} color={ThemeColors.emerald} />}
          title="Avg Transactions/Emp"
          primary={Math.round(summary.orders.completed / (employees?.attendance?.present || 1)).toString()}
          badge={{ label: "4.5%", positive: true }}
        >
          <MetricRow 
            label="Total Staff" 
            value={employees?.attendance?.total?.toString()} 
          />
          <MetricRow 
            label="Active Shift" 
            value={employees?.attendance?.present?.toString()} 
            highlight
          />
        </SummaryCard>
      </View>
    ];

    if (isScrollable) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: ThemeSpacing.sm, paddingRight: ThemeSpacing.lg }}
          style={{
            marginHorizontal: -ThemeSpacing.lg,
            paddingHorizontal: ThemeSpacing.lg,
            marginBottom: ThemeSpacing.md,
          }}
        >
          {cards}
        </ScrollView>
      );
    }
    
    return (
      <View style={styles.kpiGrid}>
        {cards}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {renderKPIs()}

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <View style={{ flex: 2 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>Top Performing Staff</Text>
            <Text style={styles.cardSubtitle}>Based on sales volume and transactions</Text>
            
            <View style={styles.tableHeader}>
              <Text weight="bold" style={[styles.cell, { flex: 2 }]}>Employee Name</Text>
              <Text weight="bold" style={styles.cell}>Sales (₹)</Text>
              <Text weight="bold" style={styles.cell}>Transactions</Text>
              <Text weight="bold" style={styles.cell}>Avg Sale</Text>
            </View>
            
            {employees?.topPerformers?.map((emp, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{emp.name}</Text>
                <Text style={styles.cell}>₹{emp.sales.toLocaleString()}</Text>
                <Text style={styles.cell}>{emp.transactions}</Text>
                <Text style={styles.cell}>₹{emp.avgSale}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>Shift Performance</Text>
            <Text style={styles.cardSubtitle}>Revenue by shift</Text>
            
            {employees?.shiftPerformance?.map((shift, index) => (
              <View key={index} style={styles.taxRow}>
                <View>
                  <Text style={styles.taxLabel}>{shift.shift}</Text>
                  <Text style={{ fontSize: 12, color: ThemeColors.textMuted }}>{shift.transactions} transactions</Text>
                </View>
                <Text weight="bold" style={styles.taxValue}>₹{shift.revenue.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <ReportActivityFeed 
          title="Recent Staff Actions"
          activities={dash.activities}
        />
        <ReportAlertsPanel 
          title="Staff Alerts"
          alerts={dash.alerts?.filter(a => a.message.toLowerCase().includes('employee') || a.message.toLowerCase().includes('shift'))}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: ThemeSpacing.xl,
    paddingBottom: 100,
  },
  kpiGrid: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: ThemeSpacing.md,
  },
  row: {
    flexDirection: "column",
    gap: ThemeSpacing.xl,
    marginBottom: ThemeSpacing.xl,
  },
  rowDesktop: {
    flexDirection: "row",
  },
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.lg,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    marginBottom: ThemeSpacing.sm,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  taxLabel: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  taxValue: {
    color: ThemeColors.emerald,
    fontSize: 15,
  }
});
