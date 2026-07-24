import { OrderTicket } from "@/components/kds/OrderTicket";
import { Text } from "@/components/ui/Text";
import { useKDS } from "@/context/KDSContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function KDSScreen() {
  const { activeOrders, stations, updateOrderStatus, updateItemStatus } =
    useKDS();
  const [activeStation, setActiveStation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const { width, isDesktop, isTablet, isMiniTab, isWebDesktop } =
    useResponsive();

  const numCols = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.xl * 2;
  const totalGap = ThemeSpacing.lg * (numCols - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numCols > 1 ? Math.floor(availableWidth / numCols) : undefined;

  const filteredOrders = activeOrders.filter((order) => {
    if (activeStation !== "All" && order.station !== activeStation)
      return false;
    if (searchQuery && !order.orderNumber.includes(searchQuery)) return false;
    // Don't show completed or cancelled in active dashboard by default
    if (order.status === "Completed" || order.status === "Cancelled")
      return false;
    return true;
  });

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.headerSafe} edges={["top"]}>
        {/* Header */}
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
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Board */}
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
  searchRow: {
    paddingHorizontal: ThemeSpacing.xxl,
    paddingTop: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.sm,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: ThemeSpacing.sm,
    fontSize: 14,
    color: ThemeColors.textPrimary,
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
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 999,
  },
  filterTabs: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    paddingRight: ThemeSpacing.xxl,
  },
  filterChip: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  filterChipActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  filterText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  filterTextActive: {
    color: ThemeColors.white,
  },
  boardContent: {
    padding: ThemeSpacing.md,
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
  cardWrapperSingle: {
    marginBottom: ThemeSpacing.lg,
  },
  placeholderText: {
    textAlign: "center",
    color: ThemeColors.textMuted,
    marginTop: ThemeSpacing.xxxl,
  },
});
