import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemeSpacing, ThemeColors, ThemeRadius } from "@/theme/theme";
import { SummaryCard, MetricRow } from "@/components/dashboard/SummaryCard";
import { StoreRevenueChart } from "@/components/dashboard/StoreRevenueChart";
import { ReportAlertsPanel } from "@/components/reports/ReportWidgets";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { Store, TrendingUp, AlertTriangle, Building } from "lucide-react-native";

export function StoreReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const { stores } = dash;

  const totalRevenue = stores?.reduce((sum, store) => sum + store.revenue, 0) || 0;
  const totalProfit = stores?.reduce((sum, store) => sum + store.profit, 0) || 0;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View key="rev" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Building size={18} color={ThemeColors.blue} />}
          title="Total Network Revenue"
          primary={`₹${(totalRevenue / 1000).toFixed(1)}K`}
          badge={{ label: "8.4%", positive: true }}
        >
          <MetricRow 
            label="Total Stores" 
            value={stores?.length?.toString()} 
          />
          <MetricRow 
            label="Avg Per Store" 
            value={`₹${(Math.round(totalRevenue / (stores?.length || 1)) / 1000).toFixed(1)}K`} 
            highlight
          />
        </SummaryCard>
      </View>,
      
      <View key="prof" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<TrendingUp size={18} color={ThemeColors.emerald} />}
          title="Network Profitability"
          primary={`₹${(totalProfit / 1000).toFixed(1)}K`}
          badge={{ label: "5.2%", positive: true }}
        >
          <MetricRow 
            label="Highest" 
            value={`₹${(Math.max(...(stores?.map(s => s.profit) || [0])) / 1000).toFixed(1)}K`} 
            arrow="up"
          />
          <MetricRow 
            label="Lowest" 
            value={`₹${(Math.min(...(stores?.map(s => s.profit) || [0])) / 1000).toFixed(1)}K`} 
            arrow="down"
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

      <View style={styles.section}>
        <StoreRevenueChart data={stores} />
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Text weight="bold" style={styles.cardTitle}>Store Performance Comparison</Text>
          <Text style={styles.cardSubtitle}>Compare revenue, profit, and inventory levels</Text>
          
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.cell, { flex: 2 }]}>Branch Location</Text>
            <Text weight="bold" style={styles.cell}>Revenue (₹)</Text>
            <Text weight="bold" style={styles.cell}>Net Profit (₹)</Text>
            <Text weight="bold" style={styles.cell}>Orders</Text>
            <Text weight="bold" style={styles.cell}>Avg Ticket</Text>
            <Text weight="bold" style={styles.cell}>Inventory Score</Text>
            <Text weight="bold" style={styles.cell}>Status</Text>
          </View>
          
          {stores?.map((store, index) => {
            const isTop = store.profit === Math.max(...stores.map(s => s.profit));
            const isLow = store.profit === Math.min(...stores.map(s => s.profit));

            // Derive order data based on an estimated average ticket size
            const estOrders = Math.round(store.revenue / 223); // using global avg of ~223
            const estAvgTicket = Math.round(store.revenue / estOrders);

            return (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.cell, { flex: 2, flexDirection: "row", alignItems: "center", gap: 8 }]}>
                  <Store size={16} color={ThemeColors.textMuted} />
                  <Text numberOfLines={1}>{store.store}</Text>
                </View>
                <Text style={styles.cell}>₹{store.revenue.toLocaleString()}</Text>
                <Text style={styles.cell}>₹{store.profit.toLocaleString()}</Text>
                <Text style={styles.cell}>{estOrders}</Text>
                <Text style={styles.cell}>₹{estAvgTicket}</Text>
                <Text style={styles.cell}>{store.inventory}/100</Text>
                <View style={[styles.cell, { flexDirection: "row" }]}>
                  {isTop ? (
                    <View style={styles.badgeTop}>
                      <TrendingUp size={12} color={ThemeColors.emerald} />
                      <Text style={styles.badgeTextTop}>Top</Text>
                    </View>
                  ) : isLow ? (
                    <View style={styles.badgeLow}>
                      <AlertTriangle size={12} color={ThemeColors.amber} />
                      <Text style={styles.badgeTextLow}>Review</Text>
                    </View>
                  ) : (
                    <Text style={{ color: ThemeColors.textMuted, fontSize: 13 }}>Stable</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <ReportAlertsPanel 
          title="Network-Wide Alerts"
          alerts={dash.alerts}
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
  section: {
    width: "100%",
    marginBottom: ThemeSpacing.xl,
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.xl,
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
    alignItems: "center",
    paddingVertical: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  badgeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.emerald + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTextTop: {
    fontSize: 12,
    color: ThemeColors.emerald,
    fontWeight: "bold",
  },
  badgeLow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.amber + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTextLow: {
    fontSize: 12,
    color: ThemeColors.amber,
    fontWeight: "bold",
  }
});
