import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { Text as UIText } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { setOrderType, fetchAllOrders } from "@/store/slices/posSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
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
import { useEffect, useMemo, useCallback } from "react";

export default function DashboardScreen() {
  const { user } = useSelector((state) => state.auth);
  const { activeBranch, branches, tables = [] } = useSelector((state) => state.branch);
  const { allOrders = [] } = useSelector((state) => state.pos);

  const currentBranch = branches?.find((b) => b.id === activeBranch);
  const branchName = currentBranch?.name || "All Branches";
  const currentBranchId = currentBranch?.id || user?.branch_id;

  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const { isWebDesktop } = useResponsive();

  useFocusEffect(
    useCallback(() => {
      if (currentBranchId) {
        dispatch(fetchAllOrders(currentBranchId));
      }
    }, [dispatch, currentBranchId])
  );

  const { stats, topSellingDishes, recentOrders, runningOrders } = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // Filter today's orders
    const todayOrders = allOrders.filter(o => 
      o.created_at?.startsWith(todayStr) || o.createdAt?.startsWith(todayStr)
    );
    
    // Calculate stats
    const todaysSales = todayOrders
      .filter(o => o.status === "Paid")
      .reduce((sum, o) => sum + (Number(o.total_amount) || Number(o.grand_total) || 0), 0);
      
    const totalOrdersCount = todayOrders.length;
    const activeTablesCount = tables.filter(t => t.status === "Occupied").length;
    const liveActivityCount = todayOrders.filter(o => o.status === "Pending").length;

    // Calculate top selling dishes
    const itemCounts = {};
    todayOrders.forEach(order => {
      let items = [];
      try {
        items = typeof order.running_order === "string" 
          ? JSON.parse(order.running_order) 
          : (order.running_order || []);
      } catch (e) {}

      items.forEach(item => {
        const name = item.product?.name || item.name;
        if (!name) return;
        if (!itemCounts[name]) {
          itemCounts[name] = { 
            name, 
            orders: 0, 
            price: item.variant?.price || item.product?.price || item.product?.pricing?.sellingPrice || item.price || 0 
          };
        }
        itemCounts[name].orders += item.quantity || 1;
      });
    });

    const topSelling = Object.values(itemCounts)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 4)
      .map((dish, i) => ({
        id: i + 1,
        name: dish.name,
        orders: dish.orders,
        price: `₹${Number(dish.price).toFixed(2)}`,
        trend: "+0%", // Needs yesterday's data to calculate accurately
      }));

    return {
      stats: [
        {
          id: 1,
          title: "Today's Sales",
          value: `₹${todaysSales.toFixed(2)}`,
          icon: IndianRupee,
          color: ThemeColors.emerald || "#10B981",
          change: 0,
          changeLabel: "From Yesterday",
        },
        {
          id: 2,
          title: "Total Orders",
          value: totalOrdersCount.toString(),
          icon: ShoppingBag,
          color: ThemeColors.primary || "#FF6B35",
          change: 0,
          changeLabel: "From Yesterday",
        },
        {
          id: 3,
          title: "Active Tables",
          value: activeTablesCount.toString(),
          icon: Users,
          color: ThemeColors.accent || "#FACC15",
          change: 0,
          changeLabel: "Right Now",
        },
        {
          id: 4,
          title: "Live Activity",
          value: liveActivityCount.toString(),
          icon: Activity,
          color: "#8B5CF6",
          change: 0,
          changeLabel: "Today",
        },
      ],
      topSellingDishes: topSelling,
      recentOrders: todayOrders.slice(0, 4),
      runningOrders: todayOrders.filter(o => o.status === "Pending")
    };
  }, [allOrders, tables]);

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
            {recentOrders.length > 0 ? (
              <View style={styles.listContainer}>
                {recentOrders.map((order, index) => (
                  <View
                    key={order.id}
                    style={[
                      styles.listItem,
                      index !== recentOrders.length - 1 && styles.listItemBorder,
                    ]}
                  >
                    <View style={styles.listItemLeft}>
                      <View style={[styles.rankBadge, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                        <Text style={[styles.rankText, { color: '#10B981', fontSize: 11 }]}>{order.order_type?.toLowerCase() === 'dine-in' ? 'DI' : 'TA'}</Text>
                      </View>
                      <View>
                        <Text style={styles.dishName}>{order.order_number}</Text>
                        <Text style={styles.dishPrice}>{new Date(order.created_at || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </View>
                    </View>
                    <View style={styles.listItemRight}>
                      <Text style={styles.dishOrders}>₹{Number(order.total_amount || order.grand_total || 0).toFixed(2)}</Text>
                      <Text
                        style={[
                          styles.dishTrend,
                          {
                            color: order.status === "Paid" ? "#10B981" : "#FF6B35",
                          },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>No recent orders</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Table-wise KOT Cards ── */}
        <View style={styles.contentRow}>
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Running KOTs</Text>
            {runningOrders.length > 0 ? (
              <View style={styles.kotGrid}>
                {runningOrders.map((order) => {
                  let items = [];
                  try {
                    items = typeof order.running_order === "string" 
                      ? JSON.parse(order.running_order) 
                      : (order.running_order || []);
                  } catch (e) {}

                  const tableName = order.table?.name 
                    ? `Table ${order.table.name}` 
                    : (order.order_type?.toLowerCase() === 'dine-in' ? 'Dine-In' : 'Takeaway');
                  const time = new Date(order.created_at || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <View key={order.id} style={styles.kotCard}>
                      <View style={styles.kotHeader}>
                        <Text style={styles.kotTableName}>{tableName}</Text>
                        <Text style={styles.kotTime}>{time}</Text>
                      </View>
                      <View style={styles.kotBody}>
                        {items.length > 0 ? items.map((item, idx) => (
                          <View key={idx} style={styles.kotItemRow}>
                            <View style={styles.kotItemQtyBadge}>
                              <Text style={styles.kotItemQtyText}>{item.quantity}x</Text>
                            </View>
                            <View style={styles.kotItemDetails}>
                              <Text style={styles.kotItemName}>{item.product?.name || item.name}</Text>
                              {item.variant?.name && (
                                <Text style={styles.kotItemVariant}>{item.variant.name}</Text>
                              )}
                            </View>
                            {/* Simple status dot indicator */}
                            <View style={[
                              styles.kotItemStatusDot,
                              { backgroundColor: item.status === 'Pending' ? '#EF4444' : item.status === 'Served' ? '#10B981' : '#F59E0B' }
                            ]} />
                          </View>
                        )) : (
                          <Text style={styles.kotItemVariant}>No items found</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>No running orders</Text>
              </View>
            )}
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
  // ── KOT Grid Styles ───────────────────────────────
  kotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  kotCard: {
    width: 280, // Fixed width for masonry/grid look
    backgroundColor: ThemeColors.surface || "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeColors.border || "#333333",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  kotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,107,53,0.1)', // Primary tint for header
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,107,53,0.2)',
  },
  kotTableName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemeColors.primary || "#FF6B35",
  },
  kotTime: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.textPrimary || "#FFFFFF",
  },
  kotBody: {
    padding: 12,
    gap: 8,
  },
  kotItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border || "#333333",
  },
  kotItemQtyBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  kotItemQtyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: ThemeColors.textPrimary || "#FFFFFF",
  },
  kotItemDetails: {
    flex: 1,
  },
  kotItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: ThemeColors.textPrimary || "#FFFFFF",
  },
  kotItemVariant: {
    fontSize: 11,
    color: ThemeColors.textMuted || "#666666",
    marginTop: 2,
  },
  kotItemStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 'auto', // Pushes to the right end
  },
});
