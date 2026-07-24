import { Text } from "@/components/ui/Text";
import { useMenu } from "@/context/MenuContext";
import { useTables } from "@/context/TablesContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import {
  CheckCircle,
  ChevronRight,
  Coffee,
  Edit3,
  Minus,
  Plus,
  ShoppingBag,
  Utensils,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

export default function OrderScreen() {
  const { tableId } = useLocalSearchParams();
  const { tables, updateTableDetails } = useTables();
  const { menuItems } = useMenu();

  const [activeSegment, setActiveSegment] = useState("Menu"); // 'Menu' | 'Cart'
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cart state: { productId: { quantity, note, addons } }
  const [cart, setCart] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const table = tables?.find((t) => t.id === tableId) || {
    name: "Unknown Table",
  };

  // Organize menu
  const activeMenuItems = useMemo(() => {
    return menuItems.filter((p) => p.status === "Active");
  }, [menuItems]);

  const categoryNames = useMemo(() => {
    const cats = new Set(activeMenuItems.map((p) => p.category));
    return ["All", ...Array.from(cats).filter(Boolean)];
  }, [activeMenuItems]);

  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === "All") return activeMenuItems;
    return activeMenuItems.filter((p) => p.category === selectedCategory);
  }, [activeMenuItems, selectedCategory]);

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) => {
      const currentItem = prev[productId] || {
        quantity: 0,
        note: "",
        addons: [],
      };
      const nextQty = currentItem.quantity + delta;

      if (nextQty <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: { ...currentItem, quantity: nextQty } };
    });
  };

  const handleUpdateNote = (productId, text) => {
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], note: text },
    }));
  };

  const handleToggleAddon = (productId, addon) => {
    setCart((prev) => {
      const item = prev[productId];
      const newAddons = item.addons.includes(addon)
        ? item.addons.filter((a) => a !== addon)
        : [...item.addons, addon];
      return { ...prev, [productId]: { ...item, addons: newAddons } };
    });
  };

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length === 0) return;

    const newItems = Object.entries(cart).map(([productId, itemData]) => ({
      productId,
      quantity: itemData.quantity,
      note: itemData.note.trim(),
      addons: itemData.addons,
    }));

    const existingOrder = Array.isArray(table.order) ? [...table.order] : [];

    // Merge logic for POS
    newItems.forEach((newItem) => {
      const matchIndex = existingOrder.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.note === newItem.note &&
          JSON.stringify(item.addons.sort()) ===
            JSON.stringify(newItem.addons.sort()),
      );

      if (matchIndex >= 0) {
        existingOrder[matchIndex].quantity += newItem.quantity;
      } else {
        existingOrder.push(newItem);
      }
    });

    updateTableDetails(tableId, { order: existingOrder, status: "Occupied" });
    setCart({});
    setActiveSegment("Menu");
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3500);
  };

  // Cart Calculations
  const totalItems = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = Object.entries(cart).reduce(
    (sum, [productId, itemData]) => {
      const p = menuItems.find((p) => p.id === productId);
      return sum + (p?.pricing?.sellingPrice || 0) * itemData.quantity;
    },
    0,
  );

  // Render Category List
  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categoryNames.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              style={[
                styles.categoryPill,
                isActive && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                weight={isActive ? "bold" : "medium"}
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderProductItem = ({ item: product }) => {
    const qty = cart[product.id]?.quantity || 0;

    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Coffee size={32} color={ThemeColors.textMuted} />
            </View>
          )}
          {product.dietary === "Veg" && (
            <View
              style={[styles.dietBadge, { borderColor: ThemeColors.emerald }]}
            >
              <View
                style={[
                  styles.dietDot,
                  { backgroundColor: ThemeColors.emerald },
                ]}
              />
            </View>
          )}
          {product.dietary === "Non-Veg" && (
            <View style={[styles.dietBadge, { borderColor: ThemeColors.red }]}>
              <View
                style={[styles.dietDot, { backgroundColor: ThemeColors.red }]}
              />
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text weight="bold" style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          {product.description ? (
            <Text style={styles.productDesc} numberOfLines={2}>
              {product.description}
            </Text>
          ) : null}
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>
              ₹{(product.pricing?.sellingPrice || 0).toFixed(2)}
            </Text>

            {qty > 0 ? (
              <View style={styles.qtyControlsMinimal}>
                <TouchableOpacity
                  style={styles.qtyBtnMinimal}
                  onPress={() => handleUpdateQuantity(product.id, -1)}
                >
                  <Minus size={16} color={ThemeColors.white} />
                </TouchableOpacity>
                <Text weight="bold" style={styles.qtyTextMinimal}>
                  {qty}
                </Text>
                <TouchableOpacity
                  style={styles.qtyBtnMinimal}
                  onPress={() => handleUpdateQuantity(product.id, 1)}
                >
                  <Plus size={16} color={ThemeColors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addBtnMinimal}
                onPress={() => handleUpdateQuantity(product.id, 1)}
                activeOpacity={0.8}
              >
                <Plus size={18} color={ThemeColors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderCartItem = ({ item: [productId, itemData] }) => {
    const product = menuItems.find((p) => p.id === productId);
    if (!product) return null;

    return (
      <View style={styles.cartItemCard}>
        <View style={styles.cartItemTopRow}>
          <View style={styles.cartItemDetails}>
            <Text weight="bold" style={styles.cartItemName}>
              {product.name}
            </Text>
            <Text weight="black" style={styles.cartItemPrice}>
              ₹{(product.pricing?.sellingPrice || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.qtyControlsRich}>
            <TouchableOpacity
              style={styles.qtyBtnRich}
              onPress={() => handleUpdateQuantity(productId, -1)}
            >
              <Minus size={18} color={ThemeColors.emerald} />
            </TouchableOpacity>
            <Text weight="bold" style={styles.qtyTextRich}>
              {itemData.quantity}
            </Text>
            <TouchableOpacity
              style={styles.qtyBtnRich}
              onPress={() => handleUpdateQuantity(productId, 1)}
            >
              <Plus size={18} color={ThemeColors.emerald} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.customizationArea}>
          {/* Add-ons Inline */}
          {product.addons && product.addons.length > 0 && (
            <View style={styles.addonSection}>
              <Text weight="semibold" style={styles.customizationTitle}>
                Add-ons
              </Text>
              <View style={styles.addonList}>
                {product.addons.map((addon) => {
                  const isSelected = itemData.addons.includes(addon);
                  return (
                    <TouchableOpacity
                      key={addon}
                      style={[
                        styles.addonChip,
                        isSelected && styles.addonChipActive,
                      ]}
                      onPress={() => handleToggleAddon(productId, addon)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <CheckCircle size={14} color={ThemeColors.white} />
                      )}
                      <Text
                        weight={isSelected ? "bold" : "medium"}
                        style={[
                          styles.addonChipText,
                          isSelected && styles.addonChipTextActive,
                        ]}
                      >
                        {addon}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Notes Inline */}
          <View style={styles.noteSection}>
            <Text weight="semibold" style={styles.customizationTitle}>
              Special Instructions
            </Text>
            <View style={styles.noteInputContainer}>
              <Edit3
                size={16}
                color={ThemeColors.textMuted}
                style={{ marginTop: 6 }}
              />
              <TextInput
                style={styles.noteInput}
                placeholder="e.g. Allergy to nuts, no onions..."
                placeholderTextColor={ThemeColors.textMuted}
                multiline
                value={itemData.note}
                onChangeText={(text) => handleUpdateNote(productId, text)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Vibrant Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text weight="medium" style={styles.welcomeText}>
            Dine in • {table.name}
          </Text>
          <Text weight="black" style={styles.tableName}>
            Menu
          </Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} activeOpacity={0.8}>
          <Utensils size={24} color={ThemeColors.amber} />
        </TouchableOpacity>
      </View>

      {/* Modern Segmented Control */}
      <View style={styles.segmentWrapper}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeSegment === "Menu" && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveSegment("Menu")}
            activeOpacity={0.9}
          >
            <Text
              weight={activeSegment === "Menu" ? "bold" : "medium"}
              style={[
                styles.segmentText,
                activeSegment === "Menu" && styles.segmentTextActive,
              ]}
            >
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeSegment === "Cart" && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveSegment("Cart")}
            activeOpacity={0.9}
          >
            <Text
              weight={activeSegment === "Cart" ? "bold" : "medium"}
              style={[
                styles.segmentText,
                activeSegment === "Cart" && styles.segmentTextActive,
              ]}
            >
              Cart {totalItems > 0 ? `(${totalItems})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {activeSegment === "Menu" ? (
        <View style={{ flex: 1 }}>
          {renderCategories()}
          <FlatList
            data={filteredMenuItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scrollPadding}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? "tablet" : "mobile"} // Force re-render on orientation/size change
            columnWrapperStyle={
              isTablet
                ? { gap: ThemeSpacing.sm, marginBottom: ThemeSpacing.sm }
                : undefined
            }
            ItemSeparatorComponent={() =>
              !isTablet ? <View style={{ height: ThemeSpacing.sm }} /> : null
            }
            renderItem={renderProductItem}
          />
        </View>
      ) : (
        /* Rich Cart View with Inline Customization */
        <FlatList
          data={Object.entries(cart)}
          keyExtractor={([productId]) => productId}
          contentContainerStyle={styles.scrollPadding}
          ItemSeparatorComponent={() => (
            <View style={{ height: ThemeSpacing.md }} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyCart}>
              <View style={styles.emptyCartCircle}>
                <ShoppingBag size={42} color={ThemeColors.blue} />
              </View>
              <Text weight="bold" style={styles.emptyCartTitle}>
                Your cart is empty
              </Text>
              <Text style={styles.emptyCartSub}>
                Browse the menu to discover delicious items.
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => setActiveSegment("Menu")}
              >
                <Text weight="bold" style={styles.browseBtnText}>
                  Browse Menu
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={renderCartItem}
        />
      )}

      {/* Vibrant Floating Cart Footer */}
      {totalItems > 0 && !orderPlaced && (
        <View style={styles.cartFooterContainer}>
          <TouchableOpacity
            style={styles.placeOrderBtnFull}
            onPress={
              activeSegment === "Cart"
                ? handlePlaceOrder
                : () => setActiveSegment("Cart")
            }
            activeOpacity={0.9}
          >
            <View style={styles.footerLeft}>
              <View style={styles.footerBadge}>
                <Text weight="bold" style={styles.footerBadgeText}>
                  {totalItems}
                </Text>
              </View>
              <View>
                <Text weight="medium" style={styles.footerTotalLabel}>
                  Total
                </Text>
                <Text weight="black" style={styles.footerTotalPrice}>
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.footerRight}>
              <Text weight="bold" style={styles.placeOrderText}>
                {activeSegment === "Cart" ? "Place Order" : "View Cart"}
              </Text>
              <ChevronRight size={20} color={ThemeColors.white} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Overlay */}
      {orderPlaced && (
        <View style={styles.successOverlay}>
          <View style={styles.successCircle}>
            <CheckCircle size={56} color={ThemeColors.emerald} />
          </View>
          <Text weight="black" style={styles.successText}>
            Order Sent!
          </Text>
          <Text weight="medium" style={styles.successSubtext}>
            Sit back and relax, your food is on the way.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThemeColors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    paddingTop: Platform.OS === "android" ? 24 : 12,
    paddingBottom: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
  },
  headerTextContainer: { flex: 1 },
  welcomeText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 2,
  },
  tableName: { fontSize: 26, color: ThemeColors.primary, letterSpacing: -0.5 },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.amberDim,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ThemeColors.amberDim,
  },

  // Segment UI
  segmentWrapper: {
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: ThemeSpacing.md,
    paddingBottom: ThemeSpacing.sm,
    zIndex: 10,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: ThemeRadius.full,
  },
  segmentBtnActive: {
    backgroundColor: ThemeColors.white,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: { fontSize: 13, color: ThemeColors.textSecondary },
  segmentTextActive: { color: ThemeColors.emerald },

  // Categories
  categoriesContainer: {
    paddingVertical: ThemeSpacing.xs,
    backgroundColor: ThemeColors.bg,
  },
  categoriesScroll: {
    paddingHorizontal: ThemeSpacing.md,
    gap: ThemeSpacing.xs,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  categoryPillActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  categoryText: { fontSize: 13, color: ThemeColors.textSecondary },
  categoryTextActive: { color: ThemeColors.white },

  contentContainer: { flex: 1 },
  scrollPadding: { padding: ThemeSpacing.md, paddingBottom: 100 },

  // Grid
  productCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: ThemeColors.surfaceElevated,
    position: "relative",
  },
  productImage: { width: "100%", height: "100%" },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dietBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 14,
    height: 14,
    borderWidth: 1,
    backgroundColor: ThemeColors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  dietDot: { width: 6, height: 6, borderRadius: 3 },
  productInfo: { flex: 1, padding: 10, justifyContent: "center" },
  productName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  productDesc: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  productPrice: { fontSize: 15, color: ThemeColors.primary },

  // Minimal buttons -> Emerald
  addBtnMinimal: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ThemeColors.emerald,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyControlsMinimal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald,
    borderRadius: 16,
  },
  qtyBtnMinimal: {
    width: 28,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyTextMinimal: {
    color: ThemeColors.white,
    fontSize: 13,
    width: 20,
    textAlign: "center",
  },

  // Cart List
  cartItemCard: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cartItemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.sm,
  },
  cartItemDetails: { flex: 1, paddingRight: 12 },
  cartItemName: { fontSize: 15, color: ThemeColors.primary, marginBottom: 2 },
  cartItemPrice: { fontSize: 14, color: ThemeColors.emerald, marginBottom: 6 },

  qtyControlsRich: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emeraldDim,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.emeraldDim,
  },
  qtyBtnRich: { padding: 6, paddingHorizontal: 10 },
  qtyTextRich: {
    fontSize: 14,
    color: ThemeColors.emerald,
    width: 20,
    textAlign: "center",
  },

  // Inline Customization
  customizationArea: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    paddingTop: ThemeSpacing.sm,
  },
  customizationTitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginBottom: 6,
  },
  addonSection: { marginBottom: ThemeSpacing.sm },
  addonList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  addonChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.surfaceElevated,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    gap: 4,
  },
  addonChipActive: {
    backgroundColor: ThemeColors.blue,
    borderColor: ThemeColors.blue,
  },
  addonChipText: { fontSize: 12, color: ThemeColors.textSecondary },
  addonChipTextActive: { color: ThemeColors.white },
  noteSection: { marginTop: 4 },
  noteInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 2,
    gap: 8,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  noteInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    minHeight: 36,
    textAlignVertical: "center",
  },

  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyCartCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.blueDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyCartTitle: { fontSize: 18, color: ThemeColors.primary, marginBottom: 6 },
  emptyCartSub: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: ThemeColors.blue,
    borderRadius: ThemeRadius.full,
  },
  browseBtnText: { color: ThemeColors.white, fontSize: 14 },

  // Main Floating Footer
  cartFooterContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  placeOrderBtnFull: {
    flexDirection: "row",
    backgroundColor: ThemeColors.emerald,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: ThemeColors.emeraldChart,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  footerBadge: {
    backgroundColor: ThemeColors.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBadgeText: { color: ThemeColors.emerald, fontSize: 14 },
  footerTotalLabel: {
    fontSize: 11,
    color: ThemeColors.emeraldDim,
    opacity: 0.9,
  },
  footerTotalPrice: { fontSize: 16, color: ThemeColors.white },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  placeOrderText: { color: ThemeColors.white, fontSize: 15 },

  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ThemeColors.surface,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ThemeColors.emeraldDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successText: { fontSize: 28, color: ThemeColors.primary, marginBottom: 6 },
  successSubtext: { fontSize: 14, color: ThemeColors.textSecondary },
});
