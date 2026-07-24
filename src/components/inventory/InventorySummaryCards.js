import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";
import {
  AlertTriangle,
  ClipboardList,
  Package,
  Settings2,
} from "lucide-react-native";
import { StyleSheet, View, ScrollView } from "react-native";

export function InventorySummaryCards({ metrics }) {
  const { isDesktop, isMobile } = useResponsive();

  if (!metrics) return null;

  const cards = [
    <SummaryCard
      key="total-stock"
      title="Total Stock Value"
      primary={`₹${(metrics.totalValue / 1000).toFixed(1)}K`}
      icon={<Package size={18} color={ThemeColors.blue} />}
      badge={{ label: "+5.2%", positive: true }}
    >
      <MetricRow label="Total Items" value={String(metrics.totalItems)} />
    </SummaryCard>,

    <SummaryCard
      key="low-stock"
      title="Low Stock Alerts"
      primary={String(metrics.lowStockCount)}
      icon={<AlertTriangle size={18} color={ThemeColors.amber} />}
      badge={{ label: "Needs Restock", positive: false }}
    >
      <MetricRow label="Needs Attention" value="Check Replenishment" />
    </SummaryCard>,

    <SummaryCard
      key="out-of-stock"
      title="Out of Stock"
      primary={String(metrics.outOfStockCount)}
      icon={<Settings2 size={18} color={ThemeColors.red} />}
    >
      <MetricRow
        label="Zero Quantity"
        value="Critical"
        highlight={false}
        arrow="down"
      />
    </SummaryCard>,

    <SummaryCard
      key="quarantine"
      title="Quarantine"
      primary={String(metrics.quarantineCount)}
      icon={<ClipboardList size={18} color={ThemeColors.purple} />}
    >
      <MetricRow label="Awaiting Inspection" value="Hold" />
    </SummaryCard>,
  ];

  const isScrollable = !isDesktop;
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
        contentContainerStyle={{ gap: ThemeSpacing.sm, paddingRight: ThemeSpacing.xl }}
        style={{ marginHorizontal: -ThemeSpacing.xl, paddingHorizontal: ThemeSpacing.xl, marginBottom: ThemeSpacing.md }}
      >
        {wrappedCards}
      </ScrollView>
    );
  }

  return (
    <View style={styles.cardsRow}>
      {wrappedCards}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
});
