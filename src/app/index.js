import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { Text as UIText } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { setOrderType } from "@/store/slices/posSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation, useRouter } from "expo-router";
import {
  Activity,
  IndianRupee,
  Menu,
  ShoppingBag,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardScreen() {
  const { user } = useSelector((state) => state.auth);
  const { activeBranch, branches } = useSelector((state) => state.branch);

  const currentBranch = branches?.find((b) => b.id === activeBranch);
  const branchName = currentBranch?.name || "All Branches";

  const stats = [
    {
      id: 1,
      title: "Today's Sales",
      value: "₹0.00",
      icon: IndianRupee,
      color: ThemeColors.emerald || "#10B981",
      change: 18.5,
      changeLabel: "From Yesterday",
    },
    {
      id: 2,
      title: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      color: ThemeColors.primary || "#FF6B35",
      change: 0,
      changeLabel: "From Yesterday",
    },
    {
      id: 3,
      title: "Active Tables",
      value: "0",
      icon: Users,
      color: ThemeColors.accent || "#FACC15",
      change: 0,
      changeLabel: "Right Now",
    },
    {
      id: 4,
      title: "Live Activity",
      value: "0",
      icon: Activity,
      color: "#8B5CF6",
      change: 0,
      changeLabel: "Today",
    },
  ];

  const topSellingDishes = [
    {
      id: 1,
      name: "Margherita Pizza",
      orders: 42,
      price: "₹299",
      trend: "+12%",
    },
    {
      id: 2,
      name: "Chicken Tikka Masala",
      orders: 38,
      price: "₹349",
      trend: "+8%",
    },
    { id: 3, name: "Garlic Naan", orders: 35, price: "₹50", trend: "+5%" },
    {
      id: 4,
      name: "Paneer Butter Masala",
      orders: 30,
      price: "₹289",
      trend: "-2%",
    },
  ];

  const navigation = useNavigation();
  const { isWebDesktop } = useResponsive();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleQuickStart = (type) => {
    if (type === "Dine-In") {
      dispatch(setOrderType(type));
      router.push("/tables");
    } else {
      router.push("/pos");
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Header (matches TablesHeader) ── */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <UIText style={styles.pageTitle}>Dashboard</UIText>
          </View>
          <View style={styles.headerRight}>
            <HeaderQuickNav />
            <View style={styles.branchPill}>
              <Text style={styles.branchText}>{branchName}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable body ── */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => {
            const isPositive = stat.change >= 0;
            return (
              <View key={stat.id} style={styles.statCard}>
                {/* Decorative blob */}
                <View
                  style={[styles.statBlob, { backgroundColor: stat.color }]}
                />

                {/* Top row: icon pill + title */}
                <View style={styles.statTopRow}>
                  <View
                    style={[
                      styles.iconPill,
                      { backgroundColor: `${stat.color}20` },
                    ]}
                  >
                    <stat.icon size={16} color={stat.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.statTitle} numberOfLines={1}>
                    {stat.title}
                  </Text>
                </View>

                {/* Bottom row: value + trend badge */}
                <View style={styles.statBottomRow}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <View style={styles.statTrendCol}>
                    <View
                      style={[
                        styles.trendBadge,
                        {
                          backgroundColor: isPositive
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(239,68,68,0.15)",
                        },
                      ]}
                    >
                      {isPositive ? (
                        <TrendingUp
                          size={10}
                          color="#10B981"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <TrendingDown
                          size={10}
                          color="#EF4444"
                          strokeWidth={2.5}
                        />
                      )}
                      <Text
                        style={[
                          styles.trendText,
                          { color: isPositive ? "#10B981" : "#EF4444" },
                        ]}
                      >
                        {stat.change > 0 ? "+" : ""}
                        {stat.change}%
                      </Text>
                    </View>
                    <Text style={styles.trendLabel}>{stat.changeLabel}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#10B981" }]}
            activeOpacity={0.82}
            onPress={() => handleQuickStart("Dine-In")}
          >
            {/* decorative circle */}
            <View
              style={[
                styles.quickBtnBlob,
                { backgroundColor: "rgba(255,255,255,0.12)" },
              ]}
            />
            <View style={styles.quickBtnInner}>
              <View style={styles.quickBtnIconWrap}>
                <UtensilsCrossed size={28} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.quickBtnLabel}>Dine-In</Text>
              <Text style={styles.quickBtnMeta}>Table order</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickBtn,
              { backgroundColor: ThemeColors.primary || "#FF6B35" },
            ]}
            activeOpacity={0.82}
            onPress={() => handleQuickStart("Takeaway")}
          >
            <View
              style={[
                styles.quickBtnBlob,
                { backgroundColor: "rgba(255,255,255,0.12)" },
              ]}
            />
            <View style={styles.quickBtnInner}>
              <View style={styles.quickBtnIconWrap}>
                <ShoppingCart size={28} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.quickBtnLabel}>Takeaway</Text>
              <Text style={styles.quickBtnMeta}>Counter order</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Placeholder for Charts / Recent Activity */}
        <View style={styles.contentRow}>
          <View style={styles.sideCard}>
            <Text style={styles.cardTitle}>Top Selling Dishes</Text>
            <View style={styles.listContainer}>
              {topSellingDishes.map((dish, index) => (
                <View
                  key={dish.id}
                  style={[
                    styles.listItem,
                    index !== topSellingDishes.length - 1 &&
                      styles.listItemBorder,
                  ]}
                >
                  <View style={styles.listItemLeft}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      <Text style={styles.dishPrice}>{dish.price}</Text>
                    </View>
                  </View>
                  <View style={styles.listItemRight}>
                    <Text style={styles.dishOrders}>{dish.orders} Orders</Text>
                    <Text
                      style={[
                        styles.dishTrend,
                        {
                          color: dish.trend.startsWith("+")
                            ? "#10B981"
                            : "#EF4444",
                        },
                      ]}
                    >
                      {dish.trend}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.sideCard}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>No recent orders</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.surfaceElevated || "#1E1E1E",
  },
  // ── Header (TablesHeader style) ──────────────────────
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  branchPill: {
    backgroundColor: ThemeColors.surface || "#2A2A2A",
    paddingHorizontal: ThemeSpacing.lg || 20,
    paddingVertical: ThemeSpacing.sm || 8,
    borderRadius: ThemeRadius.full || 9999,
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
  },
  branchText: {
    fontSize: 14,
    fontWeight: "600",
    color: ThemeColors.primary || "#FF6B35",
  },
  // ── Scrollable body ──────────────────────────────────
  container: {
    padding: ThemeSpacing.xl || 24,
    gap: ThemeSpacing.xl || 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md || 16,
  },
  statCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: ThemeColors.surface || "#2A2A2A",
    padding: ThemeSpacing.lg || 20,
    borderRadius: ThemeRadius.lg || 16,
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    gap: 16,
  },
  // Decorative gradient blob (top-right corner)
  statBlob: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.08,
  },
  // Top row: icon + title inline
  statTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: ThemeColors.textPrimary || "#FFFFFF",
  },
  // Bottom row: value + trend
  statBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: ThemeColors.textPrimary || "#FFFFFF",
    letterSpacing: -0.5,
  },
  statTrendCol: {
    alignItems: "flex-end",
    gap: 3,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "700",
  },
  trendLabel: {
    fontSize: 9,
    color: ThemeColors.textMuted || "#666666",
  },
  // ── Quick Actions ─────────────────────────────────────
  quickActionsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md || 16,
  },
  quickBtn: {
    width: 200,
    minHeight: 100,
    borderRadius: ThemeRadius.lg || 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  quickBtnBlob: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: -24,
    right: -24,
  },
  quickBtnInner: {
    flex: 1,
    padding: ThemeSpacing.lg || 20,
    justifyContent: "center",
    gap: 4,
  },
  quickBtnIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickBtnLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
  quickBtnMeta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },

  contentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.lg || 20,
  },
  mainCard: {
    flex: 2,
    minWidth: 300,
    backgroundColor: ThemeColors.surface || "#2A2A2A",
    padding: ThemeSpacing.xl || 24,
    borderRadius: ThemeRadius.lg || 16,
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
  },
  sideCard: {
    flex: 1,
    minWidth: 250,
    backgroundColor: ThemeColors.surface || "#2A2A2A",
    padding: ThemeSpacing.xl || 24,
    borderRadius: ThemeRadius.lg || 16,
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColors.textPrimary || "#FFFFFF",
    marginBottom: ThemeSpacing.lg || 20,
  },
  placeholderBox: {
    height: 200,
    backgroundColor: ThemeColors.bg || "#121212",
    borderRadius: ThemeRadius.md || 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
    borderStyle: "dashed",
  },
  placeholderText: {
    color: ThemeColors.textMuted || "#666666",
    fontSize: 14,
  },
  // ── Lists (Top Selling) ───────────────────────────────
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md || 16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "#333333",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md || 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,107,53,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "bold",
    color: ThemeColors.primary || "#FF6B35",
  },
  dishName: {
    fontSize: 15,
    fontWeight: "600",
    color: ThemeColors.textPrimary || "#FFFFFF",
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 13,
    color: ThemeColors.textMuted || "#666666",
  },
  listItemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  dishOrders: {
    fontSize: 14,
    fontWeight: "bold",
    color: ThemeColors.textPrimary || "#FFFFFF",
  },
  dishTrend: {
    fontSize: 12,
    fontWeight: "600",
  },
});
