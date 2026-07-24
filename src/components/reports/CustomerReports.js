import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemeSpacing, ThemeColors, ThemeRadius } from "@/theme/theme";
import { SummaryCard, MetricRow } from "@/components/dashboard/SummaryCard";
import { ReportActivityFeed } from "@/components/reports/ReportWidgets";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { Users, Star, Award, Heart } from "lucide-react-native";

export function CustomerReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const { customers } = dash;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View key="retention" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Heart size={18} color={ThemeColors.red} />}
          title="Customer Retention"
          primary={`${customers?.returningPercent || 0}%`}
          badge={{ label: "3.4%", positive: true }}
        >
          <MetricRow 
            label="New Today" 
            value={customers?.newToday?.toString()} 
          />
          <MetricRow 
            label="Avg LTV" 
            value={`₹${customers?.avgLifetimeValue?.toLocaleString()}`} 
            highlight
          />
        </SummaryCard>
      </View>,
      
      <View key="loyalty" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Star size={18} color={ThemeColors.amber} />}
          title="Loyalty Program"
          primary={(customers?.loyalty?.activeMembers || 0).toString()}
          badge={{ label: "12.1%", positive: true }}
        >
          <MetricRow 
            label="Points Issued" 
            value={customers?.loyalty?.pointsIssued?.toLocaleString()} 
            arrow="up"
          />
          <MetricRow 
            label="Points Redeemed" 
            value={customers?.loyalty?.pointsRedeemed?.toLocaleString()} 
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
            <Text weight="bold" style={styles.cardTitle}>Customer Segmentation</Text>
            <Text style={styles.cardSubtitle}>Distribution of customer base by activity</Text>
            
            <View style={styles.segmentRow}>
              <View style={styles.segmentIconWrap}>
                <Award size={24} color={ThemeColors.blue} />
              </View>
              <View style={styles.segmentInfo}>
                <Text weight="bold" style={styles.segmentName}>VIP Customers</Text>
                <Text style={styles.segmentDesc}>Top 10% spenders (Avg ₹12,000/mo)</Text>
              </View>
              <Text weight="bold" style={styles.segmentValue}>142</Text>
            </View>

            <View style={styles.segmentRow}>
              <View style={styles.segmentIconWrap}>
                <Users size={24} color={ThemeColors.emerald} />
              </View>
              <View style={styles.segmentInfo}>
                <Text weight="bold" style={styles.segmentName}>Regulars</Text>
                <Text style={styles.segmentDesc}>Visit 3+ times a month</Text>
              </View>
              <Text weight="bold" style={styles.segmentValue}>856</Text>
            </View>

            <View style={styles.segmentRow}>
              <View style={styles.segmentIconWrap}>
                <Star size={24} color={ThemeColors.amber} />
              </View>
              <View style={styles.segmentInfo}>
                <Text weight="bold" style={styles.segmentName}>New Customers</Text>
                <Text style={styles.segmentDesc}>First visit this month</Text>
              </View>
              <Text weight="bold" style={styles.segmentValue}>234</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>Loyalty Activity</Text>
            <Text style={styles.cardSubtitle}>Reward redemption breakdown</Text>
            
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Free Beverages</Text>
              <Text weight="bold" style={styles.taxValue}>45%</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Percentage Discount</Text>
              <Text weight="bold" style={styles.taxValue}>35%</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Free Dessert</Text>
              <Text weight="bold" style={styles.taxValue}>15%</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Merchandise</Text>
              <Text weight="bold" style={styles.taxValue}>5%</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <View style={{ flex: 1 }}>
          <View style={styles.card}>
            <Text weight="bold" style={styles.cardTitle}>New Customers (Last 7 Days)</Text>
            <View style={styles.chartContainer}>
              {customers?.weeklyNew?.map((val, i) => {
                const max = Math.max(...customers.weeklyNew, 1);
                const heightPct = (val / max) * 100;
                return (
                  <View key={i} style={styles.barColumn}>
                    <Text style={styles.barLabel}>{val}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${heightPct}%` }]} />
                    </View>
                    <Text style={styles.barDay}>Day {i+1}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ReportActivityFeed 
            title="Customer Activity Log"
            activities={dash.activities?.filter(a => a.type === 'customer' || a.type === 'loyalty')}
          />
        </View>
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
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  segmentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ThemeColors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.lg,
  },
  segmentInfo: {
    flex: 1,
  },
  segmentName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  segmentDesc: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  segmentValue: {
    fontSize: 18,
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
  },
  taxValue: {
    color: ThemeColors.blue,
    fontSize: 15,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 150,
    marginTop: ThemeSpacing.xl,
    paddingTop: ThemeSpacing.lg,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 24,
    backgroundColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    height: "70%",
    justifyContent: "flex-end",
    marginVertical: 4,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: ThemeColors.blue,
    borderRadius: ThemeRadius.sm,
  },
  barLabel: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
    fontWeight: "bold",
  },
  barDay: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  }
});
