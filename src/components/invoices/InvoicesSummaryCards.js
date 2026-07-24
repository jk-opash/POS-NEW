import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { Receipt, FileText, Activity, TrendingUp, Hash } from "lucide-react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { Text } from "@/components/ui/Text";

export function InvoicesSummaryCards({ metrics }) {
  const { isMobile, isMiniTab } = useResponsive();

  if (!metrics) return null;

  const isScrollable = isMobile || isMiniTab;
  const cardWidth = isMobile ? 280 : 320;

  const cardStyle = [
    styles.card,
    isScrollable ? { width: cardWidth } : { flex: 1 },
  ];

  const content = (
    <>
      {/* --- Revenue Card --- */}
      <TouchableOpacity style={cardStyle} activeOpacity={0.9}>
        <View style={[styles.blob, { backgroundColor: ThemeColors.emerald + "15" }]} />
        <View style={[styles.blobSmall, { backgroundColor: ThemeColors.emerald + "15" }]} />
        
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, { backgroundColor: ThemeColors.emerald + "15" }]}>
            <Receipt size={22} color={ThemeColors.emerald} />
          </View>
          <Text weight="semibold" style={styles.cardTitle}>Total Revenue</Text>
        </View>

        <View style={styles.cardRight}>
          <Text weight="bold" style={styles.cardValue}>₹{metrics.totalRevenue.toFixed(2)}</Text>
          <View style={[styles.trendBadge, styles.trendUp]}>
            <TrendingUp size={14} color={ThemeColors.emerald} style={{ marginRight: 4 }} />
            <Text weight="bold" style={[styles.trendText, { color: ThemeColors.emerald }]}>+12.5%</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* --- Total Invoices Card --- */}
      <TouchableOpacity style={cardStyle} activeOpacity={0.9}>
        <View style={[styles.blob, { backgroundColor: ThemeColors.primary + "15" }]} />
        <View style={[styles.blobSmall, { backgroundColor: ThemeColors.primary + "15" }]} />
        
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, { backgroundColor: ThemeColors.primary + "15" }]}>
            <FileText size={22} color={ThemeColors.primary} />
          </View>
          <Text weight="semibold" style={styles.cardTitle}>Total Invoices</Text>
        </View>

        <View style={styles.cardRight}>
          <Text weight="bold" style={styles.cardValue}>{metrics.totalInvoices}</Text>
          <View style={[styles.trendBadge, { backgroundColor: ThemeColors.primary + "15" }]}>
            <Hash size={14} color={ThemeColors.primary} style={{ marginRight: 4 }} />
            <Text weight="bold" style={[styles.trendText, { color: ThemeColors.primary }]}>
              All time
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* --- Average Value Card --- */}
      <TouchableOpacity style={cardStyle} activeOpacity={0.9}>
        <View style={[styles.blob, { backgroundColor: ThemeColors.blue + "15" }]} />
        <View style={[styles.blobSmall, { backgroundColor: ThemeColors.blue + "15" }]} />
        
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, { backgroundColor: ThemeColors.blue + "15" }]}>
            <Activity size={22} color={ThemeColors.blue} />
          </View>
          <Text weight="semibold" style={styles.cardTitle}>Average Value</Text>
        </View>

        <View style={styles.cardRight}>
          <Text weight="bold" style={styles.cardValue}>₹{metrics.averageValue.toFixed(2)}</Text>
          <View style={[styles.trendBadge, { backgroundColor: ThemeColors.blue + "15" }]}>
            <Text weight="bold" style={[styles.trendText, { color: ThemeColors.blue }]}>
              Per Invoice
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  if (isScrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: ThemeSpacing.lg, paddingRight: ThemeSpacing.xl }}
        style={{ marginHorizontal: -ThemeSpacing.lg, paddingHorizontal: ThemeSpacing.lg, marginBottom: ThemeSpacing.xl }}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.cardsRow}>{content}</View>;
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.xl,
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    overflow: "hidden", // Keeps the blobs contained
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blob: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.4,
  },
  blobSmall: {
    position: "absolute",
    bottom: 20,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.3,
  },
  cardLeft: {
    flex: 1,
    gap: 16, // Space between icon and title
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 12, // Space between value and badge
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    letterSpacing: 0.2,
  },
  cardValue: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.5,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
  },
  trendUp: {
    backgroundColor: ThemeColors.emerald + "15",
  },
  trendDown: {
    backgroundColor: ThemeColors.red + "15",
  },
  trendNeutral: {
    backgroundColor: ThemeColors.amber + "15",
  },
  trendText: {
    fontSize: 12,
  },
});
