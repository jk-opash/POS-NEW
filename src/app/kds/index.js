import { OrderTicket } from "@/components/kds/OrderTicket";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { fetchActiveOrders, updateKDSOrderStatusAsync, updateKDSItemStatusAsync } from "@/store/slices/posSlice";
import { useNavigation } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { useDispatch, useSelector } from "react-redux";

export default function KDSPage() {
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
    const order = activeOrders.find(o => o.id === id);
    if (order && order.dbOrderId) {
      dispatch(updateKDSOrderStatusAsync({ orderId: order.dbOrderId, kotNumber: id, status: action }));
    }
  };

  // Update individual item status within a ticket
  const updateItemStatus = (orderId, itemId, action) => {
    const order = activeOrders.find(o => o.id === orderId);
    if (order && order.dbOrderId) {
      dispatch(updateKDSItemStatusAsync({ orderId, dbOrderId: order.dbOrderId, itemId, status: action }));
    }
  };

  const [activeStation, setActiveStation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const { width, isDesktop, isTablet, isMiniTab, isWebDesktop } =
    useResponsive();

  const numCols = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;

  const filteredOrders = activeOrders.filter((order) => {
    if (activeStation !== "All" && order.station !== activeStation)
      return false;
    if (searchQuery && !order.orderNumber.includes(searchQuery)) return false;
    if (order.status === "Completed" || order.status === "Cancelled" || order.status === "Served" || order.status === "Done")
      return false;
    return true;
  });

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.headerSafe} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Kitchen Display</Text>
          </View>
          <View style={styles.headerRight}>
            <HeaderQuickNav />
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
            <OrderTicket
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
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 26, color: ThemeColors.textPrimary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
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
