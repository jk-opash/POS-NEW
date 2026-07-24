import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { AlertTriangle, TrendingUp, Truck } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export function SupplierStats({ stats }) {
  const { isMobile, isMiniTab } = useResponsive();
  const isScrollable = isMobile || isMiniTab;
  const cardWidth = isMobile ? 280 : 320;

  const cards = [
    <View key="total" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
      <SummaryCard
        icon={<Truck size={18} color={ThemeColors.emerald} />}
        title="Total Suppliers"
        primary={String(stats.total)}
        badge={{ label: "+2 New", positive: true }}
      >
        <MetricRow label="Active" value={String(stats.active)} highlight />
        <MetricRow
          label="Inactive"
          value={String(stats.total - stats.active)}
        />
      </SummaryCard>
    </View>,

    <View
      key="active"
      style={isScrollable ? { width: cardWidth } : { flex: 1 }}
    >
      <SummaryCard
        icon={<TrendingUp size={18} color={ThemeColors.blue} />}
        title="Active Vendors"
        primary={String(stats.active)}
        badge={{ label: "85% Activity", positive: true }}
      >
        <MetricRow label="Recent Orders" value="12" highlight />
        <MetricRow label="Pending Deliveries" value="4" />
      </SummaryCard>
    </View>,

    <View
      key="payable"
      style={isScrollable ? { width: cardWidth } : { flex: 1 }}
    >
      <SummaryCard
        icon={<AlertTriangle size={18} color={ThemeColors.amber} />}
        title="Outstanding Payable"
        primary={`₹${(stats.outstanding / 1000).toFixed(1)}K`}
        badge={{ label: "-5% (Good)", positive: true }}
      >
        <MetricRow label="Overdue" value="₹0.00" highlight />
        <MetricRow
          label="Next 7 Days"
          value={`₹${((stats.outstanding * 0.4) / 1000).toFixed(1)}K`}
        />
      </SummaryCard>
    </View>,
  ];

  if (isScrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: ThemeSpacing.sm,
          paddingRight: ThemeSpacing.lg,
        }}
        style={{
          marginHorizontal: -ThemeSpacing.lg,
          paddingHorizontal: ThemeSpacing.lg,
        }}
      >
        {cards}
      </ScrollView>
    );
  }

  return <View style={styles.statsContainer}>{cards}</View>;
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    flexWrap: "wrap",
    width: "100%",
  },
});
