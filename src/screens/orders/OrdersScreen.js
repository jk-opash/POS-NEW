import { OrderCard } from "@/components/orders/OrderCard";
import { OrdersEmptyState } from "@/components/orders/OrdersEmptyState";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { PaymentModal } from "@/components/orders/PaymentModal";
import { TakeawayOrderModal } from "@/components/orders/TakeawayOrderModal";
import { useOrders } from "@/context/OrdersContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function OrdersScreen() {
  const { orders } = useOrders();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
  const [selectedDetailsOrder, setSelectedDetailsOrder] = useState(null);
  const [showTakeawayModal, setShowTakeawayModal] = useState(false);

  const navigation = useNavigation();
  const { width, isDesktop, isTablet, isMobile, isMiniTab , isWebDesktop } = useResponsive();

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeFilter === "All" ||
      (activeFilter === "Dine In" && o.type === "Dine In") ||
      (activeFilter === "Takeaway" && o.type === "Takeaway");

    return matchesTab;
  });

  // Responsive columns: desktop 4, tablet 3, mini tab 2, mobile 1
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;

  // Calculate explicit card width so last row items don't stretch
  // listContent padding: 16 on each side = 32
  // sidebar on desktop: 250px
  // gap between columns: ThemeSpacing.md (12) * (numColumns - 1)
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2; // 32
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numColumns > 1 ? Math.floor(availableWidth / numColumns) : undefined;

  return (
    <View style={styles.root}>
      {/* ── Top Header & Filter Tabs ──────────────────────────── */}
      <OrdersHeader
        isDesktop={isWebDesktop}
        dateString={dateString}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* ── Order Cards Grid ────────────────────── */}
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setShowTakeawayModal(true)}
      >
        <Plus size={28} color={ThemeColors.white} />
      </TouchableOpacity>

      <TakeawayOrderModal
        visible={showTakeawayModal}
        onClose={() => setShowTakeawayModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
    gap: ThemeSpacing.md,
  },
  columnWrapper: {
    gap: ThemeSpacing.md,
    alignItems: "stretch",
  },
  cardWrapperMulti: {
    flexShrink: 0,
    flexDirection: "column",
  },
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
