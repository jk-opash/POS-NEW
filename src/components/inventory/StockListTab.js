import { Text } from "@/components/ui/Text";
import { useInventoryContext } from "@/context/InventoryContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Package, Search, Settings2, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { InventoryActionModal } from "./InventoryActionModal";
import { ProductInventoryModal } from "./ProductInventoryModal";

export function StockListTab() {
  const { inventory, deleteInventoryItem, logStockMovement } =
    useInventoryContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentProduct, setAdjustmentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isDesktop, isTablet, isMiniTab, width } = useResponsive();
  const numColumns = isDesktop
    ? 6
    : width > 1000
      ? 5
      : isTablet
        ? 4
        : isMiniTab
          ? 3
          : 2;

  // InventoryScreen has padding Horizontal on the scroll view, but not inside the tab.
  // Wait, InventoryScreen has paddingHorizontal: ThemeSpacing.lg for scrollContent
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2;
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth = Math.floor(availableWidth / numColumns);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getBadgeStyle = (status) => {
    switch (status) {
      case "Normal":
        return { bg: ThemeColors.emeraldDim, text: ThemeColors.emerald };
      case "Low":
        return { bg: ThemeColors.amberDim, text: ThemeColors.amber };
      case "Critical":
      case "Out of Stock":
        return { bg: ThemeColors.redDim, text: ThemeColors.red };
      default:
        return { bg: ThemeColors.borderSubtle, text: ThemeColors.textSecondary };
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteInventoryItem(item.id);
            logStockMovement({
              type: "DELETION",
              itemId: item.id,
              itemName: item.name,
              quantityChange: -item.inStock,
              reason: "Item deleted from inventory",
            });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>Stock List</Text>
        <View style={styles.searchContainer}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, SKU..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      {filteredInventory.length > 0 ? (
        <FlatList
          data={filteredInventory}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: ThemeSpacing.md }}
          contentContainerStyle={{ gap: ThemeSpacing.md }}
          renderItem={({ item }) => {
            const badge = getBadgeStyle(item.status);
            const isZero = item.inStock === 0;
            const isLow = item.inStock <= item.reorderLevel && !isZero;

            return (
              <TouchableOpacity
                style={[styles.card, { width: cardWidth }]}
                activeOpacity={0.8}
                onPress={() => setSelectedProduct(item)}
              >
                <View style={styles.imageContainer}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Package size={32} color={ThemeColors.textMuted} />
                    </View>
                  )}
                  <View
                    style={[styles.statusBadge, { backgroundColor: badge.bg }]}
                  >
                    <Text
                      weight="bold"
                      style={[styles.statusText, { color: badge.text }]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text weight="bold" style={styles.categoryBadgeText}>
                      {item.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text weight="bold" style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.priceWrap}>
                    <Text style={styles.sku} numberOfLines={1}>
                      {item.sku}
                    </Text>
                    <Text weight="extrabold" style={styles.price}>
                      ₹{item.price.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.footer}>
                    <View style={styles.stockInfo}>
                      <Text
                        style={{
                          color: ThemeColors.textSecondary,
                          fontSize: 13,
                        }}
                      >
                        {item.unit}
                      </Text>
                      <Text
                        weight="bold"
                        style={[
                          styles.stockValue,
                          isZero
                            ? { color: ThemeColors.red }
                            : isLow
                              ? { color: ThemeColors.amber }
                              : { color: ThemeColors.emerald },
                        ]}
                      >
                        {item.inStock}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: ThemeSpacing.sm }}>
                      <TouchableOpacity
                        style={styles.adjustBtn}
                        onPress={() => setAdjustmentProduct(item)}
                        activeOpacity={0.7}
                      >
                        <Settings2 size={16} color={ThemeColors.textMuted} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.adjustBtn,
                          {
                            backgroundColor: ThemeColors.redDim,
                          },
                        ]}
                        onPress={() => handleDelete(item)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={ThemeColors.red} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ color: ThemeColors.textMuted }}>
            No inventory items found.
          </Text>
        </View>
      )}

      {/* Modals */}
      <ProductInventoryModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <InventoryActionModal
        visible={!!adjustmentProduct}
        onClose={() => setAdjustmentProduct(null)}
        type="adjustments"
        initialProductId={adjustmentProduct?.sku || adjustmentProduct?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 140,
    backgroundColor: ThemeColors.bg,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: ThemeSpacing.sm,
    right: ThemeSpacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  statusText: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryBadge: {
    position: "absolute",
    bottom: ThemeSpacing.sm,
    left: ThemeSpacing.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  categoryBadgeText: {
    color: ThemeColors.white,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: ThemeSpacing.lg,
  },
  headerRow: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: ThemeSpacing.sm,
  },
  header: {
    alignItems: "flex-start",
    flex: 1,
  },
  name: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  sku: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.sm,
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  adjustBtn: {
    padding: 6,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    borderColor: ThemeColors.borderSubtle,
  },
  priceWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  stockWrap: {
    alignItems: "flex-end",
  },
  stockValue: {
    fontSize: 15,
  },
  stockLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
  emptyState: {
    padding: ThemeSpacing.xxl,
    alignItems: "center",
    width: "100%",
  },
});
