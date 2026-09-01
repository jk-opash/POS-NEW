import { CommonHeader } from "@/components/common/CommonHeader";
import { OnlineOrderTicket } from "@/components/online-orders/OnlineOrderTicket";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import {
  fetchActiveOrders,
  updateKDSItemStatusAsync,
  updateKDSOrderStatusAsync,
} from "@/store/slices/posSlice";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function OnlineOrdersPage() {
  // ── Read KOT tickets from Redux (populated when "Save KOT" is pressed or on fetch) ──
  const dispatch = useDispatch();
  const activeOrders = useSelector((state) => state.pos.kdsOrders || []);
  const activeBranch = useSelector((state) => state.branch.activeBranch);

  useEffect(() => {
    const branchId = activeBranch?._id || activeBranch;
    if (branchId) {
      dispatch(fetchActiveOrders(branchId));
    }
  }, [activeBranch, dispatch]);

  // Update entire KOT ticket status (START PREP / BUMP TICKET)
  const updateOrderStatus = (id, action) => {
    const order = activeOrders.find((o) => o.id === id);
    if (order && order.dbOrderId) {
      dispatch(
        updateKDSOrderStatusAsync({
          orderId: order.dbOrderId,
          kotNumber: id,
          status: action,
        }),
      );
    }
  };

  // Update individual item status within a ticket
  const updateItemStatus = (orderId, itemId, action) => {
    const order = activeOrders.find((o) => o.id === orderId);
    if (order && order.dbOrderId) {
      dispatch(
        updateKDSItemStatusAsync({
          orderId,
          dbOrderId: order.dbOrderId,
          itemId,
          status: action,
        }),
      );
    }
  };

  const [activeStation, setActiveStation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const { width, isDesktop, isTablet, isMiniTab, isWebDesktop } =
    useResponsive();

  const numCols = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;

  const filteredOrders = activeOrders.filter((order) => {
    if (order.type !== "QR Order") return false;

    if (activeStation !== "All" && order.station !== activeStation)
      return false;
    if (searchQuery && !order.orderNumber.includes(searchQuery)) return false;
    if (
      order.status === "Completed" ||
      order.status === "Accepted" ||
      order.status === "Preparing" ||
      order.status === "Cancelled" ||
      order.status === "Served" ||
      order.status === "Done"
    )
      return false;
    return true;
  });

  return (
    <View style={styles.root}>
      <CommonHeader title="Online Orders" />
      <FlatList
        key={`cols-${numCols}`}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        numColumns={numCols}
        columnWrapperStyle={numCols > 1 ? styles.columnWrapper : null}
        contentContainerStyle={styles.boardContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: numCols > 1 ? `${100 / numCols}%` : "100%",
            }}
          >
            <OnlineOrderTicket
              order={item}
              onAction={(id, action) => updateOrderStatus(id, action)}
              onItemAction={updateItemStatus}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholderText}>
            No active orders for this station.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },

  boardContent: {
    padding: ThemeSpacing.md,
    paddingBottom: 40,
    flexGrow: 1,
    gap: ThemeSpacing.md,
  },
  columnWrapper: { gap: ThemeSpacing.md, alignItems: "stretch" },
  placeholderText: {
    textAlign: "center",
    color: ThemeColors.textMuted,
    marginTop: ThemeSpacing.xxxl,
  },
});
