import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  Clock,
  Menu,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Mock Online Orders Data ──────────────────────────────────────────────────
const MOCK_ONLINE_ORDERS = [
  {
    id: "OO-1001",
    platform: "Swiggy",
    orderId: "SWG-89234",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    items: [
      { name: "Butter Chicken", qty: 1, price: 350 },
      { name: "Garlic Naan", qty: 2, price: 80 },
      { name: "Jeera Rice", qty: 1, price: 140 },
    ],
    subtotal: 650,
    discount: 50,
    packagingCharge: 30,
    deliveryCharge: 40,
    gst: 31.5,
    total: 701.5,
    status: "New",
    orderedAt: new Date(Date.now() - 60000).toISOString(),
    deliveryAddress: "B-12, Satellite, Ahmedabad",
    instructions: "Extra spicy butter chicken, no onions in naan",
    estimatedDelivery: "30-35 min",
  },
  {
    id: "OO-1002",
    platform: "Zomato",
    orderId: "ZMT-44521",
    customer: "Priya Patel",
    phone: "+91 98765 43211",
    items: [
      { name: "Paneer Tikka", qty: 1, price: 280 },
      { name: "Dal Makhani", qty: 1, price: 260 },
      { name: "Butter Naan", qty: 3, price: 60 },
      { name: "Gulab Jamun", qty: 2, price: 100 },
    ],
    subtotal: 820,
    discount: 0,
    packagingCharge: 40,
    deliveryCharge: 30,
    gst: 41,
    total: 931,
    status: "New",
    orderedAt: new Date(Date.now() - 120000).toISOString(),
    deliveryAddress: "C-5, Vastrapur, Ahmedabad",
    instructions: "Less oil in dal makhani",
    estimatedDelivery: "25-30 min",
  },
  {
    id: "OO-1003",
    platform: "Swiggy",
    orderId: "SWG-89235",
    customer: "Amit Kumar",
    phone: "+91 98765 43212",
    items: [
      { name: "Chicken Biryani", qty: 2, price: 350 },
      { name: "Raita", qty: 2, price: 40 },
    ],
    subtotal: 780,
    discount: 100,
    packagingCharge: 30,
    deliveryCharge: 0,
    gst: 35.5,
    total: 745.5,
    status: "Accepted",
    orderedAt: new Date(Date.now() - 600000).toISOString(),
    deliveryAddress: "D-3, Navrangpura, Ahmedabad",
    instructions: "",
    estimatedDelivery: "20-25 min",
  },
  {
    id: "OO-1004",
    platform: "Direct",
    orderId: "DIR-001",
    customer: "Meena Shah",
    phone: "+91 98765 43213",
    items: [
      { name: "Veg Thali Special", qty: 2, price: 350 },
      { name: "Mango Lassi", qty: 2, price: 120 },
    ],
    subtotal: 940,
    discount: 0,
    packagingCharge: 0,
    deliveryCharge: 50,
    gst: 47,
    total: 1037,
    status: "Preparing",
    orderedAt: new Date(Date.now() - 900000).toISOString(),
    deliveryAddress: "E-1, Paldi, Ahmedabad",
    instructions: "Extra sweet gulab jamun",
    estimatedDelivery: "35-40 min",
  },
  {
    id: "OO-1005",
    platform: "Zomato",
    orderId: "ZMT-44522",
    customer: "Vijay Singh",
    phone: "+91 98765 43214",
    items: [
      { name: "Masala Dosa", qty: 3, price: 150 },
      { name: "Masala Chai", qty: 3, price: 50 },
    ],
    subtotal: 600,
    discount: 60,
    packagingCharge: 20,
    deliveryCharge: 25,
    gst: 27,
    total: 612,
    status: "Ready",
    orderedAt: new Date(Date.now() - 1200000).toISOString(),
    deliveryAddress: "F-7, SG Highway, Ahmedabad",
    instructions: "",
    estimatedDelivery: "10-15 min",
  },
];

const PLATFORM_COLORS = {
  Swiggy: ThemeColors.swiggy,
  Zomato: ThemeColors.zomato,
  Direct: ThemeColors.emerald,
};

const STATUS_CONFIG = {
  New: { color: ThemeColors.blue, bg: ThemeColors.blueDim, icon: AlertCircle },
  Accepted: {
    color: ThemeColors.violet,
    bg: ThemeColors.violetDim,
    icon: BadgeCheck,
  },
  Preparing: {
    color: ThemeColors.amber,
    bg: ThemeColors.amberDim,
    icon: Clock,
  },
  Ready: {
    color: ThemeColors.emerald,
    bg: ThemeColors.emeraldDim,
    icon: Check,
  },
  Dispatched: {
    color: ThemeColors.teal,
    bg: ThemeColors.tealDim,
    icon: RefreshCw,
  },
  Rejected: { color: ThemeColors.red, bg: ThemeColors.redDim, icon: X },
};

export function OnlineOrdersScreen() {
  const navigation = useNavigation();
  const { isDesktop , isWebDesktop } = useResponsive();
  const [orders, setOrders] = useState(MOCK_ONLINE_ORDERS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filters = [
    "All",
    "New",
    "Accepted",
    "Preparing",
    "Ready",
    "Dispatched",
  ];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const newOrderCount = orders.filter((o) => o.status === "New").length;

  const handleAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Accepted" } : o)),
    );
  };

  const handleReject = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Rejected" } : o)),
    );
  };

  const handleMarkReady = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Ready" } : o)),
    );
  };

  const getTimeSince = (isoDate) => {
    const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuBtn}
              >
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Smartphone size={22} color={ThemeColors.accent} />
            <Text weight="bold" style={styles.pageTitle}>
              Online Orders
            </Text>
            {newOrderCount > 0 && (
              <View style={styles.newBadge}>
                <Text weight="bold" style={styles.newBadgeText}>
                  {newOrderCount} NEW
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => {
            const isActive = activeFilter === f;
            const count =
              f === "All"
                ? orders.length
                : orders.filter((o) => o.status === f).length;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  weight={isActive ? "semibold" : "regular"}
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {f} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.body}>
        {/* Order List */}
        <ScrollView
          style={styles.orderList}
          contentContainerStyle={styles.orderListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.New;
            const StatusIcon = statusCfg.icon;
            return (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.orderCard,
                  selectedOrder?.id === order.id && styles.orderCardSelected,
                ]}
                onPress={() => setSelectedOrder(order)}
                activeOpacity={0.8}
              >
                {/* Platform Badge */}
                <View style={styles.orderCardHeader}>
                  <View
                    style={[
                      styles.platformBadge,
                      {
                        backgroundColor:
                          PLATFORM_COLORS[order.platform] || ThemeColors.accent,
                      },
                    ]}
                  >
                    <Text weight="bold" style={styles.platformBadgeText}>
                      {order.platform}
                    </Text>
                  </View>
                  <Text style={styles.orderTime}>
                    {getTimeSince(order.orderedAt)}
                  </Text>
                </View>

                {/* Order ID & Customer */}
                <View style={styles.orderMeta}>
                  <Text weight="semibold" style={styles.orderId}>
                    #{order.orderId}
                  </Text>
                  <Text style={styles.customerName}>{order.customer}</Text>
                </View>

                {/* Items Preview */}
                <View style={styles.itemsPreview}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <Text
                      key={i}
                      style={styles.itemPreviewText}
                      numberOfLines={1}
                    >
                      {item.qty}x {item.name}
                    </Text>
                  ))}
                  {order.items.length > 3 && (
                    <Text style={styles.moreItems}>
                      +{order.items.length - 3} more items
                    </Text>
                  )}
                </View>

                {/* Footer */}
                <View style={styles.orderCardFooter}>
                  <Text weight="bold" style={styles.orderTotal}>
                    ₹{order.total.toFixed(0)}
                  </Text>
                  <View
                    style={[
                      styles.statusChip,
                      { backgroundColor: statusCfg.bg },
                    ]}
                  >
                    <StatusIcon size={12} color={statusCfg.color} />
                    <Text
                      weight="semibold"
                      style={[styles.statusText, { color: statusCfg.color }]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons for New orders */}
                {order.status === "New" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(order.id)}
                    >
                      <X size={14} color={ThemeColors.red} />
                      <Text weight="semibold" style={styles.rejectBtnText}>
                        Reject
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={() => handleAccept(order.id)}
                    >
                      <Check size={14} color={ThemeColors.white} />
                      <Text weight="semibold" style={styles.acceptBtnText}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {order.status === "Accepted" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn, { flex: 1 }]}
                      onPress={() =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id
                              ? { ...o, status: "Preparing" }
                              : o,
                          ),
                        )
                      }
                    >
                      <Text weight="semibold" style={styles.acceptBtnText}>
                        Start Preparing
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {order.status === "Preparing" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.readyBtn, { flex: 1 }]}
                      onPress={() => handleMarkReady(order.id)}
                    >
                      <Check size={14} color={ThemeColors.white} />
                      <Text weight="semibold" style={styles.acceptBtnText}>
                        Mark Ready
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          {filteredOrders.length === 0 && (
            <View style={styles.emptyState}>
              <Smartphone size={48} color={ThemeColors.textMuted} />
              <Text weight="semibold" style={styles.emptyText}>
                No {activeFilter === "All" ? "" : activeFilter.toLowerCase()}{" "}
                orders
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Order Detail Panel (Desktop) */}
        {isDesktop && selectedOrder && (
          <View style={styles.detailPanel}>
            <View style={styles.detailHeader}>
              <View>
                <Text weight="bold" style={styles.detailTitle}>
                  #{selectedOrder.orderId}
                </Text>
                <Text style={styles.detailSubtitle}>
                  {selectedOrder.customer} • {selectedOrder.phone}
                </Text>
              </View>
              <View
                style={[
                  styles.platformBadge,
                  {
                    backgroundColor:
                      PLATFORM_COLORS[selectedOrder.platform] ||
                      ThemeColors.accent,
                  },
                ]}
              >
                <Text weight="bold" style={styles.platformBadgeText}>
                  {selectedOrder.platform}
                </Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Items */}
              <Text weight="semibold" style={styles.sectionLabel}>
                ORDER ITEMS
              </Text>
              {selectedOrder.items.map((item, i) => (
                <View key={i} style={styles.detailItem}>
                  <Text style={styles.detailItemQty}>{item.qty}x</Text>
                  <Text weight="medium" style={styles.detailItemName}>
                    {item.name}
                  </Text>
                  <Text weight="semibold" style={styles.detailItemPrice}>
                    ₹{(item.price * item.qty).toFixed(0)}
                  </Text>
                </View>
              ))}

              {/* Bill Summary */}
              <View style={styles.billSummary}>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Subtotal</Text>
                  <Text style={styles.billValue}>
                    ₹{selectedOrder.subtotal}
                  </Text>
                </View>
                {selectedOrder.discount > 0 && (
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Discount</Text>
                    <Text
                      style={[styles.billValue, { color: ThemeColors.emerald }]}
                    >
                      -₹{selectedOrder.discount}
                    </Text>
                  </View>
                )}
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Packaging</Text>
                  <Text style={styles.billValue}>
                    ₹{selectedOrder.packagingCharge}
                  </Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>GST</Text>
                  <Text style={styles.billValue}>₹{selectedOrder.gst}</Text>
                </View>
                <View style={[styles.billRow, styles.billTotal]}>
                  <Text weight="bold" style={styles.billTotalLabel}>
                    Total
                  </Text>
                  <Text weight="bold" style={styles.billTotalValue}>
                    ₹{selectedOrder.total.toFixed(0)}
                  </Text>
                </View>
              </View>

              {/* Delivery Info */}
              <Text weight="semibold" style={styles.sectionLabel}>
                DELIVERY INFO
              </Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryText}>
                  📍 {selectedOrder.deliveryAddress}
                </Text>
                <Text style={styles.deliveryText}>
                  ⏱ Est. {selectedOrder.estimatedDelivery}
                </Text>
                {selectedOrder.instructions ? (
                  <Text style={styles.deliveryText}>
                    📝 {selectedOrder.instructions}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
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
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 22, color: ThemeColors.textPrimary },
  newBadge: {
    backgroundColor: ThemeColors.red,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  newBadgeText: { color: ThemeColors.white, fontSize: 11 },
  filterRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
  },
  filterTab: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  filterTabActive: {
    backgroundColor: ThemeColors.accent,
    borderColor: ThemeColors.accent,
  },
  filterTabText: { fontSize: 13, color: ThemeColors.textSecondary },
  filterTabTextActive: { color: ThemeColors.white },
  body: { flex: 1, flexDirection: "row" },
  orderList: { flex: 1 },
  orderListContent: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  orderCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.sm,
  },
  orderCardSelected: {
    borderColor: ThemeColors.accent,
    borderWidth: 2,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  platformBadgeText: { color: ThemeColors.white, fontSize: 11 },
  orderTime: { fontSize: 12, color: ThemeColors.textMuted },
  orderMeta: { gap: 2 },
  orderId: { fontSize: 15, color: ThemeColors.textPrimary },
  customerName: { fontSize: 13, color: ThemeColors.textSecondary },
  itemsPreview: { gap: 2 },
  itemPreviewText: { fontSize: 13, color: ThemeColors.textSecondary },
  moreItems: { fontSize: 12, color: ThemeColors.accent },
  orderCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  orderTotal: { fontSize: 18, color: ThemeColors.textPrimary },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12 },
  actionRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    marginTop: ThemeSpacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  acceptBtn: { backgroundColor: ThemeColors.emerald },
  readyBtn: { backgroundColor: ThemeColors.accent },
  rejectBtn: {
    backgroundColor: ThemeColors.redDim,
    borderWidth: 1,
    borderColor: ThemeColors.red,
  },
  acceptBtnText: { color: ThemeColors.white, fontSize: 13 },
  rejectBtnText: { color: ThemeColors.red, fontSize: 13 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: ThemeSpacing.md,
  },
  emptyText: { fontSize: 16, color: ThemeColors.textMuted },

  // Detail Panel
  detailPanel: {
    width: 380,
    backgroundColor: ThemeColors.surface,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
    padding: ThemeSpacing.xl,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  detailTitle: { fontSize: 20, color: ThemeColors.textPrimary },
  detailSubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    letterSpacing: 1,
    marginTop: ThemeSpacing.xl,
    marginBottom: ThemeSpacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  detailItemQty: {
    fontSize: 13,
    color: ThemeColors.accent,
    width: 30,
  },
  detailItemName: { flex: 1, fontSize: 14, color: ThemeColors.textPrimary },
  detailItemPrice: { fontSize: 14, color: ThemeColors.textPrimary },
  billSummary: {
    marginTop: ThemeSpacing.lg,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
    gap: 8,
  },
  billRow: { flexDirection: "row", justifyContent: "space-between" },
  billLabel: { fontSize: 13, color: ThemeColors.textSecondary },
  billValue: { fontSize: 13, color: ThemeColors.textPrimary },
  billTotal: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  billTotalLabel: { fontSize: 15, color: ThemeColors.textPrimary },
  billTotalValue: { fontSize: 15, color: ThemeColors.accent },
  deliveryInfo: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
    gap: 8,
  },
  deliveryText: { fontSize: 13, color: ThemeColors.textSecondary },
});
