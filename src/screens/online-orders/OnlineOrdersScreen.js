import { OnlineOrderCard } from "@/components/online-orders/OnlineOrderCard";
import { OnlineOrderDetailPanel } from "@/components/online-orders/OnlineOrderDetailPanel";
import { OnlineOrderPaymentModal } from "@/components/online-orders/OnlineOrderPaymentModal";
import { SettlePaymentModal } from "@/components/pos/SettlePaymentModal";
import { Text } from "@/components/ui/Text";
import { useInvoices } from "@/context/InvoicesContext";
import { useKDS } from "@/context/KDSContext";
import { useTables } from "@/context/TablesContext";
import { usePOS } from "@/context/POSContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { buildInvoiceFromOrder } from "@/utils/invoiceBuilder";
import { useNavigation } from "expo-router";
import {
  AlertCircle,
  BadgeBell,
  Bell,
  Check,
  Clock,
  Menu,
  Truck,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDataForGrid = (data, numColumns) => {
  if (!data || data.length === 0) return [];
  const numberOfElementsLastRow = data.length % numColumns;
  if (numberOfElementsLastRow === 0) return data;

  const paddingNeeded = numColumns - numberOfElementsLastRow;
  const paddedData = [...data];
  for (let i = 0; i < paddingNeeded; i++) {
    paddedData.push({ id: `blank-${i}`, empty: true });
  }
  return paddedData;
};

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
    platform: "QR Order",
    orderId: "QR-12",
    customer: "Table 12",
    phone: "",
    items: [
      { name: "Cold Coffee", qty: 2, price: 120 },
      { name: "Margherita Pizza", qty: 1, price: 300 },
      { name: "French Fries", qty: 1, price: 110 },
    ],
    subtotal: 650,
    discount: 0,
    packagingCharge: 0,
    deliveryCharge: 0,
    gst: 32.5,
    total: 682.5,
    status: "New",
    orderedAt: new Date(Date.now() - 30000).toISOString(),
    deliveryAddress: "Dine-in",
    instructions: "No sugar in one coffee",
    estimatedDelivery: "15 min",
  },
];

export const PLATFORM_COLORS = {
  Swiggy: ThemeColors.swiggy || "#FC8019",
  Zomato: ThemeColors.zomato || "#E23744",
  Direct: ThemeColors.emerald || "#059669",
  "QR Order": ThemeColors.violet || "#8B5CF6",
};

const KANBAN_STAGES = ["New", "Accepted", "Preparing", "Ready", "Dispatched"];

export const STATUS_CONFIG = {
  New: { color: ThemeColors.blue, bg: ThemeColors.blueDim, icon: AlertCircle },
  Accepted: {
    color: ThemeColors.violet,
    bg: ThemeColors.violetDim,
    icon: BadgeBell,
    Check,
  },
  Preparing: {
    color: ThemeColors.amber,
    bg: ThemeColors.amberDim,
    icon: Clock,
  },
  Ready: {
    color: ThemeColors.emerald,
    bg: ThemeColors.emeraldDim,
    icon: Bell,
    Check,
  },
  Dispatched: {
    color: ThemeColors.teal,
    bg: ThemeColors.tealDim,
    icon: Truck,
  },
  Rejected: { color: ThemeColors.red, bg: ThemeColors.redDim, icon: X },
};

export const getTimeSince = (isoDate) => {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
};

export function OnlineOrdersScreen() {
  const navigation = useNavigation();
  const { addOnlineOrderToKDS, activeOrders } = useKDS();
  const { tables, updateTableStatus } = useTables();
  const { injectTableOrder } = usePOS();
  const { addInvoice } = useInvoices();
  const { isDesktop, isWebDesktop, isTablet, isMiniTab } = useResponsive();
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;
  const [orders, setOrders] = useState(MOCK_ONLINE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Checkout Modals State
  const [dispatchingOrder, setDispatchingOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const slideAnim = useRef(new Animated.Value(450)).current;

  useEffect(() => {
    if (selectedOrder) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(450);
    }
  }, [selectedOrder]);

  const handleClosePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 450,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSelectedOrder(null);
    });
  };

  // Sync with KDS orders
  useEffect(() => {
    setOrders((prev) => {
      let changed = false;
      const newOrders = prev.map((o) => {
        const kdsTicket = activeOrders.find((k) => k.id === `KDS-${o.id}`);
        if (kdsTicket) {
          if (
            kdsTicket.status === "Completed" &&
            (o.status === "Accepted" || o.status === "Preparing")
          ) {
            changed = true;
            return { ...o, status: "Ready" };
          }
          if (kdsTicket.status === "Preparing" && o.status === "Accepted") {
            changed = true;
            return { ...o, status: "Preparing" };
          }
        }
        return o;
      });
      return changed ? newOrders : prev;
    });
  }, [activeOrders]);

  const newOrderCount = orders.filter((o) => o.status === "New").length;

  const handleUpdateStatus = (orderId, newStatus) => {
    if (newStatus === "Dispatched") {
      const orderToDispatch = orders.find((o) => o.id === orderId);
      if (orderToDispatch) {
        setDispatchingOrder(orderToDispatch);
        setShowPayment(true);
      }
      return;
    }

    const orderToUpdate = orders.find((o) => o.id === orderId);

    setOrders((prev) => {
      if (newStatus === "Accepted" && orderToUpdate?.platform === "QR Order") {
        return prev.filter((o) => o.id !== orderId);
      }
      return prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    });

    if (newStatus === "Accepted") {
      if (orderToUpdate) {
        addOnlineOrderToKDS({ ...orderToUpdate, status: newStatus });
        
        if (orderToUpdate.platform === "QR Order") {
          const tableNameStr = orderToUpdate.customer.replace(/table /i, "").trim();
          const matchedTable = tables.find(t => 
            t.name.toLowerCase() === tableNameStr.toLowerCase() || 
            t.name.toLowerCase() === orderToUpdate.customer.toLowerCase() ||
            t.id === tableNameStr || 
            t.id === `T${tableNameStr}`
          );
          if (matchedTable) {
            updateTableStatus(matchedTable.id, "Occupied");
            if (injectTableOrder) {
              injectTableOrder(matchedTable.id, orderToUpdate);
            }
          }
        }
      }
    }
  };

  // ── Render Components ────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* ── Header ──────────────────────────── */}
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
            <Text style={styles.pageTitle}>Online Orders</Text>
            {newOrderCount > 0 && (
              <View style={styles.newBadge}>
                <Text weight="bold" style={styles.newBadgeText}>
                  {newOrderCount} New
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <OnlineOrderPaymentModal
        visible={showPayment}
        order={dispatchingOrder}
        onClose={() => {
          setShowPayment(false);
          setDispatchingOrder(null);
        }}
        onComplete={(completedOrder) => {
          setShowPayment(false);
          // Update status to Dispatched
          setOrders((prev) =>
            prev.map((o) =>
              o.id === completedOrder.id
                ? {
                    ...o,
                    status: "Dispatched",
                    paymentMethods: completedOrder.paymentMethods,
                  }
                : o,
            ),
          );
          setDispatchingOrder(completedOrder);
          setShowReceipt(true);
        }}
      />

      <SettlePaymentModal
        visible={showReceipt}
        order={
          dispatchingOrder
            ? {
                id: dispatchingOrder.id,
                date: dispatchingOrder.orderedAt,
                items: dispatchingOrder.items.map((item) => ({
                  product: { name: item.name },
                  quantity: item.qty,
                  price: item.price,
                })),
                totals: {
                  subtotal: dispatchingOrder.total,
                  discountAmount: 0,
                  taxAmount: 0,
                  grandTotal: dispatchingOrder.total,
                },
                paymentMethods: dispatchingOrder.paymentMethods || [
                  { method: "Prepaid", amount: dispatchingOrder.total },
                ],
              }
            : null
        }
        onClose={() => {
          setShowReceipt(false);
          setDispatchingOrder(null);
        }}
        onSettle={() => {
          if (dispatchingOrder) {
            const formattedOrder = {
              id: dispatchingOrder.id,
              date: dispatchingOrder.orderedAt,
              items: dispatchingOrder.items.map((item) => ({
                product: { name: item.name },
                quantity: item.qty,
                price: item.price,
              })),
              totals: {
                subtotal: dispatchingOrder.total,
                discountAmount: 0,
                taxAmount: 0,
                grandTotal: dispatchingOrder.total,
              },
              paymentMethods: dispatchingOrder.paymentMethods || [
                { method: "Prepaid", amount: dispatchingOrder.total },
              ],
            };
            const invoice = buildInvoiceFromOrder(
              formattedOrder,
              {
                orderType: "Online Delivery",
                platform: dispatchingOrder.platform,
                customer: {
                  name: dispatchingOrder.customer,
                  phone: dispatchingOrder.phone,
                },
              },
              "print",
            );
            addInvoice(invoice);
          }
          setShowReceipt(false);
          setDispatchingOrder(null);
        }}
      />

      <View style={styles.body}>
        <FlatList
          data={formatDataForGrid(orders, numColumns)}
          keyExtractor={(item) => item.id}
          key={numColumns}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.rowGap : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.empty) {
              return (
                <View style={{ flex: 1, backgroundColor: "transparent" }} />
              );
            }
            return (
              <OnlineOrderCard
                order={item}
                isSelected={selectedOrder?.id === item.id}
                onSelect={setSelectedOrder}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          }}
        />
      </View>

      {/* Details Modal / Sidebar */}
      <Modal
        visible={!!selectedOrder}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePanel}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleClosePanel}
          />
          <Animated.View
            style={[
              { height: "100%", width: "100%", maxWidth: 420 },
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <OnlineOrderDetailPanel
              selectedOrder={selectedOrder}
              onClose={handleClosePanel}
              onUpdateStatus={handleUpdateStatus}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
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
  newBadge: {
    backgroundColor: ThemeColors.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
  },
  newBadgeText: {
    color: ThemeColors.white,
    fontSize: 12,
  },
  notifBtn: { position: "relative", padding: 4 },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },

  body: {
    flex: 1,
  },
  listContent: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  rowGap: {
    gap: ThemeSpacing.md,
  },
  // ── Order Card Styling ───────────────────────────────────────────────────
  orderCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    marginBottom: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderCardSelected: {
    borderColor: ThemeColors.primary,
    shadowOpacity: 0.1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  platformIconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPlatform: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  cardTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cardTime: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
  },
  statusBadgeText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orderItemsList: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  customerRow: {
    marginBottom: ThemeSpacing.xs,
  },
  cardCustomer: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  orderItemQtyBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: ThemeColors.borderSubtle,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItemQtyText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  orderItemName: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.bg + "50",
  },
  cardTotalLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginBottom: 2,
  },
  cardTotal: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  cardActions: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  rejectBtnSmall: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.roseDim,
  },
  rejectBtnSmallText: { color: ThemeColors.rose, fontSize: 14 },
  acceptBtnSmall: {
    backgroundColor: ThemeColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
  },
  acceptBtnSmallText: { color: ThemeColors.white, fontSize: 14 },
  btnPrimarySmall: {
    backgroundColor: ThemeColors.violet,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
  },
  btnReadySmall: {
    backgroundColor: ThemeColors.amber,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
  },
  btnDispatchSmall: {
    backgroundColor: ThemeColors.teal,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: ThemeRadius.full,
  },
  // ── Detail Modal / Receipt Styling ───────────────────────────────────────
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  receiptContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: ThemeColors.white,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    backgroundColor: "#FAFAFA",
  },
  receiptCloseBtn: {
    padding: 4,
  },
  receiptTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  receiptScroll: {
    paddingBottom: 100,
  },
  receiptTopInfo: {
    alignItems: "center",
    padding: ThemeSpacing.xxl,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  receiptPlatformBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    marginBottom: ThemeSpacing.md,
  },
  receiptPlatformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  receiptOrderId: {
    fontSize: 28,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  receiptOrderTime: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  receiptSection: {
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptCustomerName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  receiptCustomerPhone: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  receiptSectionTitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    letterSpacing: 1.2,
    marginBottom: ThemeSpacing.lg,
  },
  receiptItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.md,
  },
  receiptItemLeft: {
    flexDirection: "row",
    flex: 1,
    paddingRight: ThemeSpacing.md,
  },
  receiptItemQty: {
    fontSize: 14,
    color: ThemeColors.primary,
    width: 30,
  },
  receiptItemName: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    flex: 1,
  },
  receiptItemPrice: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  receiptTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  receiptTotalLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  receiptTotalValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  receiptDivider: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    borderStyle: "dashed",
    marginVertical: ThemeSpacing.md,
  },
  receiptGrandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiptGrandTotalLabel: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  receiptGrandTotalValue: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  instructionBox: {
    backgroundColor: ThemeColors.amber + "15",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: ThemeColors.amber,
  },
  instructionLabel: {
    fontSize: 12,
    color: ThemeColors.amber,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  receiptDeliveryAddress: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    lineHeight: 20,
  },
  receiptFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.white,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
});
