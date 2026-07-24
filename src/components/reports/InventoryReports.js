import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemeSpacing, ThemeColors, ThemeRadius } from "@/theme/theme";
import { SummaryCard, MetricRow } from "@/components/dashboard/SummaryCard";
import { StockAlerts } from "@/components/dashboard/StockAlerts";
import { ReportAlertsPanel, ReportActivityFeed } from "@/components/reports/ReportWidgets";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { Package, RefreshCw } from "lucide-react-native";

export function InventoryReports({ dash }) {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const { inventory } = dash;

  const renderKPIs = () => {
    const isScrollable = isMobile || isTablet;
    const cardWidth = isMobile ? 280 : 320;

    const cards = [
      <View key="val" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<Package size={18} color={ThemeColors.blue} />}
          title="Inventory Valuation"
          primary={`₹${(inventory?.totalValue || 0).toLocaleString()}`}
          badge={{ label: "2.4%", positive: true }}
        >
          <MetricRow 
            label="Received" 
            value={`₹${(inventory?.stockReceived || 0).toLocaleString()}`} 
          />
          <MetricRow 
            label="Sold" 
            value={`₹${(inventory?.stockSold || 0).toLocaleString()}`} 
            highlight
          />
        </SummaryCard>
      </View>,
      
      <View key="move" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
        <SummaryCard 
          icon={<RefreshCw size={18} color={ThemeColors.amber} />}
          title="Stock Movement"
          primary={(inventory?.stockTransferred || 0).toString()}
          badge={{ label: "-1.2%", positive: false }}
        >
          <MetricRow 
            label="Low Stock Items" 
            value={inventory?.lowStockItems?.toString() || "0"} 
            arrow="down"
          />
          <MetricRow 
            label="Expiring Products" 
            value={inventory?.expiringProducts?.toString() || "0"} 
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
        <StockAlerts 
          activeTab={dash.stockTab} 
          onTabChange={dash.setStockTab} 
        />
      </View>

      <View style={styles.section}>
        <View style={styles.card}>
          <Text weight="bold" style={styles.cardTitle}>Dead & Slow Moving Stock</Text>
          <Text style={styles.cardSubtitle}>Items that have not moved in the last 30 days</Text>
          
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.cell, { flex: 2 }]}>Product Name</Text>
            <Text weight="bold" style={styles.cell}>SKU</Text>
            <Text weight="bold" style={styles.cell}>In Stock</Text>
            <Text weight="bold" style={styles.cell}>Last Sold</Text>
            <Text weight="bold" style={styles.cell}>Health</Text>
          </View>
          
          {dash.stockData?.slice(0, 5).map((item, index) => {
            const healthScore = Math.max(10, 100 - (item.stock || 0) * 0.5);
            const healthColor = healthScore > 50 ? ThemeColors.amber : ThemeColors.red;
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cell}>{item.sku || "N/A"}</Text>
                <Text style={styles.cell}>{item.current || item.stock || 0}</Text>
                <Text style={styles.cell}>{item.lastAvailable || item.lastSold || "N/A"}</Text>
                <View style={[styles.cell, { justifyContent: "center" }]}>
                  <View style={{ height: 6, width: "80%", backgroundColor: ThemeColors.border, borderRadius: 3, overflow: "hidden" }}>
                    <View style={{ height: "100%", width: `${healthScore}%`, backgroundColor: healthColor }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.row, isDesktop && styles.rowDesktop]}>
        <ReportActivityFeed 
          title="Recent Stock Activity"
          activities={dash.activities?.filter(a => a.type === 'inventory' || a.type === 'order')}
        />
        <ReportAlertsPanel 
          title="Urgent Stock Alerts"
          alerts={dash.alerts?.filter(a => a.message.toLowerCase().includes('stock') || a.message.toLowerCase().includes('inventory'))}
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
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  }
});
