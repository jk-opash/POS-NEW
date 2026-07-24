import { SearchWithFilter } from "@/components/ui/SearchWithFilter";
import { Text } from "@/components/ui/Text";
import { useMenu } from "@/context/MenuContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Minus, Plus, Trash2, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function TableOrderMenuModal({
  visible,
  table,
  initialOrder,
  onClose,
  onPlaceOrder,
}) {
  const { menuItems } = useMenu();
  const { isDesktop, isTablet, isMiniTab } = useResponsive();

  // Combine F&B Menu Items and Products for display
  const combinedItems = useMemo(() => {
    return [...menuItems];
  }, [menuItems]);

  // Grid State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Cart State (array format: [{ cartItemId, productId, quantity, note, addons }])
  const [orderItems, setOrderItems] = useState([]);

  // Mobile Tab State
  const [activeTab, setActiveTab] = useState("Order"); // "Order" | "Cart"

  useEffect(() => {
    if (visible) {
      if (Array.isArray(initialOrder)) {
        setOrderItems(initialOrder);
      } else if (initialOrder && Object.keys(initialOrder).length > 0) {
        // Legacy conversion
        const converted = Object.entries(initialOrder).map(
          ([productId, quantity]) => ({
            cartItemId: Math.random().toString(),
            productId,
            quantity,
            note: "",
            addons: [],
          }),
        );
        setOrderItems(converted);
      } else {
        setOrderItems([]);
      }
      setSearchQuery("");
      setActiveCategory("All");
      setActiveTab("Order");
    }
  }, [visible, initialOrder]);

  if (!table) return null;

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(combinedItems.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [combinedItems]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return combinedItems.filter((p) => {
      if (p.status !== "Active") return false;

      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCat =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [combinedItems, searchQuery, activeCategory]);

  // Derived Cart Array
  const cart = useMemo(() => {
    return orderItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        ...item,
        product: combinedItems.find((p) => p.id === item.productId),
      }))
      .filter((c) => c.product);
  }, [orderItems, combinedItems]);

  // Cart Functions
  const addToCart = (product) => {
    setOrderItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && !i.note && i.addons.length === 0,
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          cartItemId: Math.random().toString(),
          productId: product.id,
          quantity: 1,
          note: "",
          addons: [],
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setOrderItems((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((i) => i.cartItemId !== cartItemId);
      }
      return prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i,
      );
    });
  };

  const updateNote = (cartItemId, note) => {
    setOrderItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, note } : i)),
    );
  };

  const toggleAddon = (cartItemId, addon) => {
    setOrderItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const addons = (i.addons || []).includes(addon)
            ? i.addons.filter((a) => a !== addon)
            : [...(i.addons || []), addon];
          return { ...i, addons };
        }
        return i;
      }),
    );
  };

  const clearCart = () => {
    setOrderItems([]);
  };

  // Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) =>
      sum + (item.product.pricing?.sellingPrice || 0) * item.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    if (onPlaceOrder) {
      onPlaceOrder(orderItems);
    }
    onClose();
  };

  const numColumns = isDesktop ? 3 : isTablet || isMiniTab ? 2 : 2;

  const renderProduct = ({ item }) => {
    const price = item.pricing?.sellingPrice || 0;
    const qtyInCart = orderItems
      .filter((i) => i.productId === item.id)
      .reduce((sum, i) => sum + i.quantity, 0);

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          qtyInCart > 0 && styles.productCardSelected,
        ]}
        onPress={() => addToCart(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productInfo}>
          <Text weight="bold" style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text weight="bold" style={styles.productPrice}>
            ₹{price.toFixed(2)}
          </Text>
        </View>
        {qtyInCart > 0 && (
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>{qtyInCart}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCartItem = ({ item }) => {
    const price = item.product.pricing?.sellingPrice || 0;
    const itemTotal = price * item.quantity;
    const itemAddons = item.addons || [];

    return (
      <View style={styles.cartItemContainer}>
        <View style={styles.cartItem}>
          <View style={styles.cartItemInfo}>
            <Text weight="bold" style={styles.cartItemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text style={styles.cartItemPrice}>₹{price.toFixed(2)}</Text>
          </View>
          <View style={styles.cartItemRight}>
            <View style={styles.cartItemControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  updateQuantity(item.cartItemId, item.quantity - 1)
                }
              >
                <Minus size={14} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
              <Text weight="bold" style={styles.qtyText}>
                {item.quantity}
              </Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  updateQuantity(item.cartItemId, item.quantity + 1)
                }
              >
                <Plus size={14} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text weight="bold" style={styles.cartItemTotalText}>
              ₹{itemTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Note Input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Add note (e.g. less spicy)..."
          placeholderTextColor={ThemeColors.textMuted}
          value={item.note || ""}
          onChangeText={(text) => updateNote(item.cartItemId, text)}
        />

        {/* Addon Chips */}
        {item.product.addons && item.product.addons.length > 0 && (
          <View style={styles.addonsContainer}>
            {item.product.addons.map((addon) => {
              const isSelected = itemAddons.includes(addon);
              return (
                <TouchableOpacity
                  key={addon}
                  style={[
                    styles.addonChip,
                    isSelected && styles.addonChipSelected,
                  ]}
                  onPress={() => toggleAddon(item.cartItemId, addon)}
                >
                  <Text
                    style={[
                      styles.addonChipText,
                      isSelected && styles.addonChipTextSelected,
                    ]}
                  >
                    {addon}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.headerTitle}>
                Order for {table.name}
              </Text>
              <Text style={styles.headerSubtitle}>
                Add items to table order
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View
            style={[
              styles.body,
              isDesktop || isTablet
                ? { flexDirection: "row" }
                : { flexDirection: "column" },
            ]}
          >
            {/* Segmented Control for Mobile/MiniTab */}
            {!(isDesktop || isTablet) && (
              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    activeTab === "Order" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setActiveTab("Order")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      activeTab === "Order" && styles.segmentTextActive,
                    ]}
                  >
                    Menu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    activeTab === "Cart" && styles.segmentBtnActive,
                  ]}
                  onPress={() => setActiveTab("Cart")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      activeTab === "Cart" && styles.segmentTextActive,
                    ]}
                  >
                    Cart ({totalItems})
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Left Panel: Product Grid */}
            {(isDesktop || isTablet || activeTab === "Order") && (
              <View
                style={[
                  styles.leftPanel,
                  isDesktop || isTablet
                    ? { flex: 2, borderRightWidth: 1 }
                    : { flex: 1 },
                ]}
              >
                {/* Products Grid Toolbar */}
                <View style={styles.gridToolbar}>
                  <SearchWithFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterOptions={categories.map((c) => ({
                      label: c,
                      value: c,
                    }))}
                    activeFilter={activeCategory}
                    onFilterChange={setActiveCategory}
                    placeholder="Search products..."
                  />
                </View>

                {/* Grid */}
                <FlatList
                  data={filteredProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderProduct}
                  key={numColumns}
                  numColumns={numColumns}
                  contentContainerStyle={styles.productList}
                  columnWrapperStyle={styles.columnWrapper}
                />
              </View>
            )}

            {/* Right Panel: Cart */}
            {(isDesktop || isTablet || activeTab === "Cart") && (
              <View style={[styles.rightPanel, { flex: 1 }]}>
                <View style={styles.cartHeader}>
                  <Text weight="bold" style={styles.cartTitle}>
                    Order Summary
                  </Text>
                  <TouchableOpacity onPress={clearCart}>
                    <Trash2 size={18} color={ThemeColors.red} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.product.id}
                  renderItem={renderCartItem}
                  contentContainerStyle={styles.cartList}
                  ListEmptyComponent={
                    <View style={styles.emptyCart}>
                      <Text style={styles.emptyCartText}>Cart is empty</Text>
                    </View>
                  }
                />

                <View style={styles.cartFooter}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>
                      ₹{totalAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax (5%)</Text>
                    <Text style={styles.totalValue}>
                      ₹{(totalAmount * 0.05).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.totalRow, styles.grandTotalRow]}>
                    <Text weight="bold" style={styles.grandTotalLabel}>
                      Total
                    </Text>
                    <Text weight="bold" style={styles.grandTotalValue}>
                      ₹{(totalAmount * 1.05).toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.placeOrderBtn,
                      cart.length === 0 && { opacity: 0.5 },
                    ]}
                    onPress={handlePlaceOrder}
                    disabled={cart.length === 0}
                  >
                    <Text weight="bold" style={styles.placeOrderBtnText}>
                      Send to Kitchen
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  modalContainer: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    width: "100%",
    maxWidth: 1200,
    height: "95%",
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  headerTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: ThemeSpacing.sm,
  },
  body: {
    flex: 1,
  },
  leftPanel: {
    flexDirection: "column",
    borderColor: ThemeColors.border,
  },
  rightPanel: {
    backgroundColor: ThemeColors.surface,
    flexDirection: "column",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.sm,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: ThemeSpacing.md,
    alignItems: "center",
    borderRadius: ThemeRadius.md,
  },
  segmentBtnActive: {
    backgroundColor: ThemeColors.emerald,
  },
  segmentText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  segmentTextActive: {
    color: ThemeColors.white,
    fontWeight: "bold",
  },
  gridToolbar: {
    padding: ThemeSpacing.lg,
    flexDirection: "row",
    zIndex: 1000,
    elevation: 1000,
  },
  productList: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
  },
  columnWrapper: {
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  productCardSelected: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  productInfo: {
    gap: ThemeSpacing.xs,
  },
  productName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  productCategory: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  productPrice: {
    fontSize: 14,
    color: ThemeColors.emerald,
    marginTop: ThemeSpacing.xs,
  },
  qtyBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: ThemeColors.emerald,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ThemeColors.surface,
  },
  qtyBadgeText: {
    color: ThemeColors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
  },
  cartTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  cartList: {
    padding: ThemeSpacing.md,
  },
  emptyCart: {
    padding: ThemeSpacing.xl,
    alignItems: "center",
  },
  emptyCartText: {
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
  cartItemContainer: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.md,
    marginBottom: ThemeSpacing.sm,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: ThemeSpacing.md,
  },
  cartItemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  cartItemRight: {
    alignItems: "flex-end",
    gap: ThemeSpacing.sm,
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    padding: 2,
  },
  qtyBtn: {
    padding: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.sm,
  },
  qtyText: {
    fontSize: 14,
    minWidth: 20,
    textAlign: "center",
  },
  cartItemTotalText: {
    fontSize: 14,
    color: ThemeColors.emerald,
  },
  noteInput: {
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    padding: ThemeSpacing.sm,
    color: ThemeColors.textPrimary,
    fontSize: 13,
    marginBottom: ThemeSpacing.sm,
  },
  addonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.xs,
  },
  addonChip: {
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 4,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  addonChipSelected: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  addonChipText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  addonChipTextSelected: {
    color: ThemeColors.emerald,
    fontWeight: "bold",
  },
  cartFooter: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  grandTotalRow: {
    marginTop: ThemeSpacing.sm,
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderColor: ThemeColors.border,
  },
  grandTotalLabel: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 18,
    color: ThemeColors.emerald,
  },
  placeOrderBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    marginTop: ThemeSpacing.lg,
  },
  placeOrderBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
