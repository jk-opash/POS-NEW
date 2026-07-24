import { Text } from "@/components/ui/Text";
import { WaiterTicket } from "@/components/waiter/WaiterTicket";
import { useKDS } from "@/context/KDSContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function WaiterScreen() {
  const {
    activeOrders,
    stations,
    updateOrderStatus,
    updateItemStatus,
    markReadyItemsAsServed,
  } = useKDS();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const { width, isDesktop, isTablet, isMiniTab, isWebDesktop } =
    useResponsive();

  const numCols = isDesktop ? 5 : isTablet ? 3 : isMiniTab ? 2 : 1;
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.xl * 2;
  const totalGap = ThemeSpacing.lg * (numCols - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numCols > 1 ? Math.floor(availableWidth / numCols) : undefined;

  const filteredOrders = activeOrders.filter((order) => {
    // Only show orders that have at least one item ready to be served
    const hasServeableItem =
      order.items &&
      order.items.some(
        (i) =>
          i.status === "Done" ||
          i.status === "Completed" ||
          i.status === "Ready",
      );
    if (!hasServeableItem) return false;
    if (searchQuery && !order.orderNumber.includes(searchQuery)) return false;
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
            <Text style={styles.pageTitle}>Wait Staff</Text>
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
            style={
              numCols > 1
                ? [styles.cardWrapperMulti, { width: cardWidth }]
                : styles.cardWrapperSingle
            }
          >
            <WaiterTicket
              order={item}
              onServeAll={() => markReadyItemsAsServed(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholderText}>
            No orders done to serve right now.
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
  boardContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.lg,
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
