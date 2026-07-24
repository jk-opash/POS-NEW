import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { Activity, Building2, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export function BranchMetrics({ totalBranches, activeBranches, totalRevenue }) {
  const { isMobile, isMiniTab } = useResponsive();
  const isScrollable = isMobile || isMiniTab;
  const cardWidth = isMobile ? 280 : 320;

  const cards = [
    <View key="total" style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
      <SummaryCard
        icon={<Building2 size={18} color={ThemeColors.blue} />}
        title="Total Branches"
        primary={String(totalBranches)}
        badge={{ label: "+1 New", positive: true }}
      >
        <MetricRow
          label="Active Locations"
          value={String(activeBranches)}
          highlight
        />
        <MetricRow
          label="Inactive"
          value={String(totalBranches - activeBranches)}
        />
      </SummaryCard>
    </View>,

    <View
      key="active"
      style={isScrollable ? { width: cardWidth } : { flex: 1 }}
    >
      <SummaryCard
        icon={<Activity size={18} color={ThemeColors.emerald} />}
        title="Active Branches"
        primary={String(activeBranches)}
        badge={{ label: "98% Uptime", positive: true }}
      >
        <MetricRow label="System Status" value="Healthy" highlight />
        <MetricRow label="Sync" value="Up to date" />
      </SummaryCard>
    </View>,

    <View
      key="revenue"
      style={isScrollable ? { width: cardWidth } : { flex: 1 }}
    >
      <SummaryCard
        icon={<TrendingUp size={18} color={ThemeColors.emerald} />}
        title="Total Revenue"
        primary={`₹${(totalRevenue / 1000).toFixed(1)}K`}
        badge={{ label: "+12.5%", positive: true }}
      >
        <MetricRow
          label="This Week"
          value={`₹${((totalRevenue * 0.2) / 1000).toFixed(1)}K`}
          arrow="up"
        />
        <MetricRow label="Target" value="On Track" highlight />
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
