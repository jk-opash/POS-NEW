import { OrderCard } from "@/components/orders/OrderCard";
import { OrdersEmptyState } from "@/components/orders/OrdersEmptyState";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { PaymentModal } from "@/components/orders/PaymentModal";
import { useResponsive } from "@/hooks/useResponsive";
import { fetchAllOrders } from "@/store/slices/posSlice";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.pos?.allOrders || []);
  const activeBranch = useSelector((state) => state.branch?.activeBranch);
  const userBranchId = useSelector((state) => state.auth?.user?.branch_id);
  const currentBranchId =
    activeBranch && activeBranch !== "br-1" ? activeBranch : userBranchId;

  useEffect(() => {
    if (currentBranchId) {
      dispatch(fetchAllOrders(currentBranchId));
    }
  }, [dispatch, currentBranchId]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
  const [selectedDetailsOrder, setSelectedDetailsOrder] = useState(null);
  const [showTakeawayModal, setShowTakeawayModal] = useState(false);

  const { width, isDesktop, isTablet, isMobile, isMiniTab, isWebDesktop } =
    useResponsive();

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedOrders = orders.map((o) => {
    const orderDate = new Date(o.created_at || new Date());

    // Map backend items to OrderCard format
    const mappedItems = (o.running_order || []).map((item) => ({
      name: item.product?.name || item.name || "Unknown Item",
      qty: item.quantity || item.qty || 1,
      price: Number(item.price || item.product?.price || 0),
    }));

    return {
      ...o,
      id: o.order_number || o.id,
      type: (o.order_type === "Dine-in" ? "Dine In" : o.order_type) || "Takeaway",
      table: o.table?.name || o.table_no,
      customer: { name: o.customer_info?.name || o.customer?.name },
      status: o.status || "Pending",
      date: orderDate.toLocaleDateString(),
      time: orderDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      total: Number(o.total_amount || 0),
      items: mappedItems,
    };
  });

  const filteredOrders = formattedOrders.filter((o) => {
    const matchesTab =
      activeFilter === "All" ||
      (activeFilter === "Dine In" && o.type === "Dine In") ||
      (activeFilter === "Takeaway" && o.type === "Takeaway");
    return matchesTab;
  });

  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2;
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numColumns > 1 ? Math.floor(availableWidth / numColumns) : undefined;

  return (
    <View style={styles.root}>
      <OrdersHeader
        isDesktop={isWebDesktop}
        dateString={dateString}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <FlatList
        key={`cols-${numColumns}`}
        data={filteredOrders}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<OrdersEmptyState />}
        renderItem={({ item }) => (
          <View
            style={
              numColumns > 1
                ? [styles.cardWrapperMulti, { width: cardWidth }]
                : styles.cardWrapperSingle
            }
          >
            <OrderCard
              order={item}
              onSeeDetails={(order) => setSelectedDetailsOrder(order)}
              onPayBills={(order) => setSelectedPaymentOrder(order)}
            />
          </View>
        )}
      />
      <PaymentModal
        visible={!!selectedPaymentOrder}
        order={selectedPaymentOrder}
        onClose={() => setSelectedPaymentOrder(null)}
      />
      <PaymentModal
        visible={!!selectedDetailsOrder}
        order={selectedDetailsOrder}
        onClose={() => setSelectedDetailsOrder(null)}
        viewMode="receipt"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
    gap: ThemeSpacing.md,
  },
  columnWrapper: { gap: ThemeSpacing.md, alignItems: "stretch" },
  cardWrapperMulti: { flexShrink: 0, flexDirection: "column" },
  cardWrapperSingle: {},
  fab: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ThemeColors.amber,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
