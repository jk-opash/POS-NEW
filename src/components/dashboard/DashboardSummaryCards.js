import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { Banknote, ReceiptText, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export function DashboardSummaryCards({
  isLoading,
  summary,
  isMobile,
  isMiniTab,
}) {
  const cards = [
    <SummaryCard
      key="revenue"
      icon={<Banknote size={18} color={ThemeColors.blue} />}
      title="Today's Revenue"
      primary={`₹${(summary.revenue.today / 1000).toFixed(1)}K`}
      badge={{ label: `+${summary.revenue.growth}%`, positive: true }}
    >
      <MetricRow
        label="Yesterday"
        value={`₹${(summary.revenue.yesterday / 1000).toFixed(1)}K`}
        arrow="up"
      />
      <MetricRow
        label="Growth"
        value={`+${summary.revenue.growth}%`}
        highlight
      />
    </SummaryCard>,

    <SummaryCard
      key="orders"
      icon={<ReceiptText size={18} color={ThemeColors.emerald} />}
      title="Today's Orders"
      primary={String(summary.orders.total)}
      badge={{ label: "+12%", positive: true }}
    >
      <MetricRow
        label="Completed"
        value={String(summary.orders.completed)}
        highlight
      />
      <MetricRow label="Pending" value={String(summary.orders.pending)} />
    </SummaryCard>,

    <SummaryCard
      key="profit"
      icon={<TrendingUp size={18} color={ThemeColors.red} />}
      title="Total Profit"
      primary={`₹${(summary.profit.net / 1000).toFixed(1)}K`}
      badge={{
        label: `${summary.profit.margin}% Margin`,
        positive: true,
      }}
    >
      <MetricRow
        label="Gross Profit"
        value={`₹${(summary.profit.gross / 1000).toFixed(1)}K`}
        highlight
      />
      <MetricRow
        label="Net Profit"
        value={`₹${(summary.profit.net / 1000).toFixed(1)}K`}
      />
    </SummaryCard>,
  ];

  const isScrollable = isMobile || isMiniTab;
  const cardWidth = isMobile ? 280 : 320;

  const wrappedCards = cards.map((card, idx) => (
    <View key={idx} style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
      {card}
    </View>
  ));

  if (isScrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: ThemeSpacing.sm,
          paddingRight: ThemeSpacing.xl,
        }}
        style={{
          marginHorizontal: -ThemeSpacing.xl,
          paddingHorizontal: ThemeSpacing.xl,
        }}
      >
        {wrappedCards}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.cardsRow, { gap: ThemeSpacing.sm, width: "100%" }]}>
      {wrappedCards}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.sm,
  },
});
