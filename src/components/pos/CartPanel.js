import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  PauseCircle,
  Percent,
  Printer,
  Utensils,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { CartItem } from "./CartItem";
import { ItemNoteModal } from "./ItemNoteModal";

export function CartPanel({
  isSmallScreen,
  cart,
  runningOrder = [],
  activeTable,
  tables = [],
  floors = [],
  onSelectTable,
  orderType,
  onOrderTypeChange,
  totals,
  parkedSales,
  taxRate,
  onCloseCart,
  onVoidEntireCart,
  onViewParkedSales,
  onUpdateQuantity,
  onVoidItem,
  onAssignStaff,
  onDiscount,
  onParkSale,
  onSendToKitchen,
  onCheckout,
  onUpdateCartItem,
  onPrintBill,
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedItemForNote, setSelectedItemForNote] = useState(null);
  const [taxDetailsVisible, setTaxDetailsVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");

  const [expandedSections, setExpandedSections] = useState({
    "header-cart": true,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleOpenNoteModal = (item) => {
    setSelectedItemForNote(item);
    setNoteModalVisible(true);
  };

  const toggleModifier = (mod) => {
    setSelectedModifiers((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod],
    );
  };

  const rowsData = useMemo(() => {
    const kotsMap = new Map();
    const cartMap = new Map();

    if (runningOrder.length > 0) {
      runningOrder.forEach((item) => {
        const kotNum = item.kotNumber || "Sent";
        if (!kotsMap.has(kotNum)) {
          kotsMap.set(kotNum, new Map());
        }
        kotsMap.get(kotNum).set(item.id, { ...item, isLockedItem: false });
      });
    }

    if (cart.length > 0) {
      cart.forEach((item) => {
        if (cartMap.has(item.id)) {
          const existing = cartMap.get(item.id);
          existing.quantity += item.quantity;
        } else {
          cartMap.set(item.id, { ...item, isLockedItem: false });
        }
      });
    }

    const rows = [];

    Array.from(kotsMap.keys())
      .sort((a, b) => {
        if (a === "Sent") return 1;
        if (b === "Sent") return -1;
        return a - b;
      })
      .forEach((kotNum) => {
        const items = Array.from(kotsMap.get(kotNum).values());
        const sectionId = `header-${kotNum}`;
        rows.push({
          type: "header",
          title: kotNum === "Sent" ? "Sent Items" : `KOT #${kotNum}`,
          id: sectionId,
        });

        if (expandedSections[sectionId]) {
          items.forEach((item) => {
            rows.push({
              type: "item",
              item: item,
              id: `item-${kotNum}-${item.id}`,
            });
          });
        }
      });

    if (cartMap.size > 0) {
      const items = Array.from(cartMap.values());
      const sectionId = "header-cart";
      rows.push({ type: "header", title: "Current Cart", id: sectionId });

      if (expandedSections[sectionId]) {
        items.forEach((item) => {
          rows.push({
            type: "item",
            item: item,
            id: `item-cart-${item.id}`,
          });
        });
      }
    }

    return rows;
  }, [runningOrder, cart, expandedSections]);

  const renderCartItem = ({ item, index }) => {
    if (item.type === "header") {
      const isExpanded = expandedSections[item.id];
      const AnimatedTouchableOpacity =
        Animated.createAnimatedComponent(TouchableOpacity);
      return (
        <AnimatedTouchableOpacity
          activeOpacity={0.7}
          layout={LinearTransition}
          onPress={() => toggleSection(item.id)}
          style={{
            width: "100%",
            paddingVertical: ThemeSpacing.sm,
            paddingHorizontal: ThemeSpacing.md,
            backgroundColor: ThemeColors.surface,
            borderTopWidth: 1,
            borderTopColor: ThemeColors.borderSubtle,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: ThemeColors.textSecondary,
            }}
          >
            {item.title}
          </Text>
          {isExpanded ? (
            <ChevronUp size={20} color={ThemeColors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={ThemeColors.textSecondary} />
          )}
        </AnimatedTouchableOpacity>
      );
    }

    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        layout={LinearTransition}
      >
        <CartItem
          item={item.item}
          isLocked={item.item.isLockedItem}
          onUpdateQuantity={onUpdateQuantity}
          onVoidItem={onVoidItem}
          onAssignStaff={onAssignStaff}
          onPress={handleOpenNoteModal}
          index={index}
        />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.rightPanel, isSmallScreen && styles.rightPanelMobile]}>
      {isSmallScreen && (
        <View style={styles.mobileCartHeader}>
          <Text weight="bold" style={styles.mobileCartTitle}>
            Your Cart
          </Text>
          <TouchableOpacity onPress={onCloseCart} style={styles.closeCartBtn}>
            <Text style={styles.closeCartBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart Header */}
      <View style={styles.cartHeader}>
        <View
          style={{
            flexDirection: "row",
            gap: ThemeSpacing.sm,
            alignItems: "center",
          }}
        >
          <View style={styles.orderTypeContainer}>
            <TouchableOpacity
              style={[
                styles.orderTypeBtn,
                orderType === "Takeaway" && styles.orderTypeBtnActive,
              ]}
              onPress={() => onOrderTypeChange?.("Takeaway")}
            >
              <Text
                weight="bold"
                style={[
                  styles.orderTypeText,
                  orderType === "Takeaway" && styles.orderTypeTextActive,
                ]}
              >
                Takeaway
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.orderTypeBtn,
                orderType === "Dine-In" && styles.orderTypeBtnActive,
              ]}
              onPress={() => onOrderTypeChange?.("Dine-In")}
            >
              <Text
                weight="bold"
                style={[
                  styles.orderTypeText,
                  orderType === "Dine-In" && styles.orderTypeTextActive,
                ]}
              >
                Dine-In
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.viewTabsBtnInline}
            onPress={onViewParkedSales}
          >
            <Text style={styles.viewTabsText}>
              Parked ({parkedSales?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          {orderType === "Dine-In" && (
            <View style={styles.tableHeaderSection}>
              {/* {activeTable ? (
                <View style={styles.selectedTableDisplay}>
                  <Text weight="bold" style={styles.selectedTableText}>
                    Table {activeTable.name}
                  </Text>
                  <Text style={styles.selectedTableFloorText}>
                    {floors.find((f) => f.id === activeTable.floorId)?.name ||
                      "Main Floor"}
                  </Text>
                </View>
              ) : null} */}
              <View style={{ flex: 1 }}>
                <Dropdown
                  options={tables.map((t) => ({
                    label: `Table ${t.name} (${floors.find((f) => f.id === t.floorId)?.name || "Main"})`,
                    value: t.id,
                  }))}
                  value={activeTable?.id}
                  onChange={(tableId) => {
                    const table = tables.find((t) => t.id === tableId);
                    if (onSelectTable) onSelectTable(table);
                  }}
                  placeholder="Select Table..."
                />
              </View>
            </View>
          )}
        </View>

        {cart.length > 0 && (
          <TouchableOpacity onPress={onVoidEntireCart} style={styles.clearBtn}>
            <Text weight="semibold" style={styles.clearBtnText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      {cart.length === 0 && runningOrder.length === 0 ? (
        <View style={styles.emptyCart}>
          <Utensils
            size={50}
            color={ThemeColors.borderMuted}
            strokeWidth={1}
            style={{ opacity: 0.6 }}
          />
          <Text style={styles.emptyCartText}>No Item Selected</Text>
          <Text style={styles.emptyCartSub}>
            Please Select Item from Left Menu Item
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          contentContainerStyle={styles.cartList}
          showsVerticalScrollIndicator={false}
          data={rowsData}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          itemLayoutAnimation={LinearTransition}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: ThemeColors.border,
                width: "100%",
              }}
            />
          )}
        />
      )}

      {/* Cart Totals & Actions */}
      <View style={styles.totalsContainer}>
        <View style={styles.modifierRow}>
          <View style={{ flexDirection: "row", gap: ThemeSpacing.md }}>
            {["BOGO Offer", "Sales Return"].map((mod) => {
              const isActive = selectedModifiers.includes(mod);
              return (
                <TouchableOpacity
                  key={mod}
                  style={styles.modifierBtn}
                  onPress={() => toggleModifier(mod)}
                >
                  <View
                    style={[
                      styles.modifierCheckbox,
                      isActive && {
                        backgroundColor: ThemeColors.accent,
                        borderColor: ThemeColors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    {isActive && (
                      <Check
                        size={12}
                        color={ThemeColors.white}
                        strokeWidth={4}
                      />
                    )}
                  </View>
                  <Text
                    weight="semibold"
                    style={[
                      styles.modifierBtnText,
                      isActive && { color: ThemeColors.textPrimary },
                    ]}
                  >
                    {mod}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Modifiers (BOGO, Split, Sales Return) */}
        </View>

        <View style={styles.divider} />

        {/* Payment Methods */}
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: ThemeSpacing.sm,
          }}
        >
          <View style={styles.paymentMethodsRow}>
            {["Cash", "Card", "Due", "Part"].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodBtn,
                  selectedPaymentMethod === method &&
                    styles.paymentMethodBtnActive,
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Text
                  weight="semibold"
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === method &&
                      styles.paymentMethodTextActive,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View> */}

        <View style={{ flexDirection: "row", gap: ThemeSpacing.sm }}>
          <View style={{ flex: 1, gap: ThemeSpacing.sm }}>
            <View style={{ flexDirection: "row", gap: ThemeSpacing.sm }}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: ThemeColors.violetDim,
                    borderColor: ThemeColors.violetDim,
                  },
                ]}
                onPress={() => {
                  if (cart.length === 0 && runningOrder.length === 0) {
                    Alert.alert(
                      "Checkout",
                      "Please add items or select an active table to checkout.",
                    );
                  } else {
                    onCheckout?.({
                      paymentMethod: selectedPaymentMethod,
                      modifiers: selectedModifiers,
                      customer: {
                        name: customerName,
                        contact: customerContact,
                      },
                      action: "print",
                    });
                  }
                }}
              >
                <Printer size={16} color={ThemeColors.violet} />
                <Text
                  weight="semibold"
                  style={[styles.actionBtnText, { color: ThemeColors.violet }]}
                >
                  Print Bill
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: ThemeColors.amberDim,
                    borderColor: ThemeColors.amberDim,
                  },
                ]}
                onPress={onDiscount}
              >
                <Percent size={16} color={ThemeColors.amber} />
                <Text
                  weight="semibold"
                  style={[styles.actionBtnText, { color: ThemeColors.amber }]}
                >
                  Discount
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: ThemeSpacing.sm }}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: ThemeColors.blueDim,
                    borderColor: ThemeColors.blueDim,
                  },
                ]}
                onPress={() => {
                  if (cart.length === 0 && runningOrder.length === 0) {
                    Alert.alert(
                      "Hold Order",
                      "Please add items to hold this order.",
                    );
                  } else {
                    onParkSale();
                  }
                }}
              >
                <PauseCircle size={16} color={ThemeColors.blue} />
                <Text
                  weight="semibold"
                  style={[styles.actionBtnText, { color: ThemeColors.blue }]}
                >
                  Hold
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: ThemeColors.emeraldDim,
                    borderColor: ThemeColors.emeraldDim,
                  },
                ]}
                onPress={() => {
                  if (cart.length === 0) {
                    Alert.alert(
                      "Create KOT",
                      "Please add new items to send to the Kitchen.",
                    );
                  } else {
                    onSendToKitchen?.({ print: false });
                  }
                }}
              >
                <Utensils size={16} color={ThemeColors.emerald} />
                <Text
                  weight="semibold"
                  style={[styles.actionBtnText, { color: ThemeColors.emerald }]}
                >
                  KOT
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, gap: ThemeSpacing.sm }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: ThemeSpacing.xl,
                minWidth: "45%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text weight="bold" style={styles.grandTotalLabel}>
                  Total
                </Text>
                <TouchableOpacity
                  onPress={() => setTaxDetailsVisible(true)}
                  style={{ padding: 4 }}
                >
                  <Info size={16} color={ThemeColors.blue} />
                </TouchableOpacity>
              </View>
              <Text weight="bold" style={styles.grandTotalValue}>
                ₹{totals.grandTotal.toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: ThemeSpacing.sm }}>
              <TouchableOpacity
                style={[styles.payBtn, { flex: 1 }]}
                onPress={() => {
                  if (cart.length === 0 && runningOrder.length === 0) {
                    Alert.alert(
                      "Checkout",
                      "Please add items or select an active table to checkout.",
                    );
                  } else {
                    onCheckout?.({
                      paymentMethod: selectedPaymentMethod,
                      modifiers: selectedModifiers,
                      customer: {
                        name: customerName,
                        contact: customerContact,
                      },
                      action: "pay",
                    });
                  }
                }}
              >
                <Text weight="semibold" style={styles.payBtnText}>
                  Save & Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payBtn,
                  {
                    flex: 1,
                    backgroundColor: ThemeColors.accent,
                    shadowColor: ThemeColors.accent,
                  },
                ]}
                onPress={() => {
                  if (cart.length === 0 && runningOrder.length === 0) {
                    Alert.alert(
                      "Checkout",
                      "Please add items or select an active table to checkout.",
                    );
                  } else {
                    onCheckout?.({
                      paymentMethod: selectedPaymentMethod,
                      modifiers: selectedModifiers,
                      customer: {
                        name: customerName,
                        contact: customerContact,
                      },
                      action: "ebill",
                    });
                  }
                }}
              >
                <Text weight="semibold" style={styles.payBtnText}>
                  Save & eBill
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ItemNoteModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        item={selectedItemForNote}
        onSaveNote={(itemId, note) => {
          if (onUpdateCartItem) {
            onUpdateCartItem(itemId, { note });
          }
        }}
      />

      <Modal visible={taxDetailsVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setTaxDetailsVisible(false)}>
          <View style={styles.tooltipOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.tooltipContent}>
                <Text weight="bold" style={styles.tooltipTitle}>
                  Tax Breakdown
                </Text>

                <View style={styles.tooltipRow}>
                  <Text style={styles.tooltipLabel}>Subtotal</Text>
                  <Text style={styles.tooltipValue}>
                    ₹{totals.subtotal.toFixed(2)}
                  </Text>
                </View>

                {totals.discountAmount > 0 && (
                  <View style={styles.tooltipRow}>
                    <Text
                      style={[
                        styles.tooltipLabel,
                        { color: ThemeColors.emerald },
                      ]}
                    >
                      Discount
                    </Text>
                    <Text
                      style={[
                        styles.tooltipValue,
                        { color: ThemeColors.emerald },
                      ]}
                    >
                      -₹{totals.discountAmount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View style={styles.tooltipDivider} />

                <View style={styles.tooltipRow}>
                  <Text style={styles.tooltipLabel}>
                    SGST ({(taxRate / 2).toFixed(1)}%)
                  </Text>
                  <Text style={styles.tooltipValue}>
                    ₹{(totals.taxAmount / 2).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.tooltipRow}>
                  <Text style={styles.tooltipLabel}>
                    CGST ({(taxRate / 2).toFixed(1)}%)
                  </Text>
                  <Text style={styles.tooltipValue}>
                    ₹{(totals.taxAmount / 2).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.tooltipDivider} />

                <View style={styles.tooltipRow}>
                  <Text weight="bold" style={styles.tooltipLabel}>
                    Total Tax
                  </Text>
                  <Text weight="bold" style={styles.tooltipValue}>
                    ₹{totals.taxAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rightPanel: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    flexDirection: "column",
  },
  rightPanelMobile: {
    flex: 1,
    borderLeftWidth: 0,
    minWidth: "100%",
  },
  mobileCartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  mobileCartTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  closeCartBtn: {
    padding: 8,
  },
  closeCartBtnText: {
    fontSize: 16,
    color: ThemeColors.emerald,
  },
  cartHeader: {
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    gap: ThemeSpacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  tableHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  selectedTableDisplay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.emerald + "10",
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.emerald + "30",
  },
  selectedTableText: {
    fontSize: 16,
    color: ThemeColors.emerald,
  },
  selectedTableFloorText: {
    fontSize: 14,
    color: ThemeColors.emerald,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  customerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.blueDim,
    alignItems: "center",
    justifyContent: "center",
  },
  customerInfoWrap: {
    flex: 1,
  },
  pointsBadgeSmall: {
    backgroundColor: ThemeColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ThemeRadius.sm,
  },
  pointsBadgeSmallText: {
    fontSize: 12,
    color: ThemeColors.amber,
    fontWeight: "bold",
  },
  customerName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    fontWeight: "bold",
  },
  customerSub: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  customerNotesPreview: {
    fontSize: 12,
    color: ThemeColors.emerald,
    marginTop: 2,
    fontStyle: "italic",
  },
  orderTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: ThemeSpacing.sm,
  },
  orderTypeContainer: {
    flexDirection: "row",
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: ThemeRadius.md,
    padding: 2,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  orderTypeBtn: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.md - 2,
  },
  orderTypeBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderTypeText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: "600",
  },
  orderTypeTextActive: {
    color: ThemeColors.textPrimary,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: ThemeColors.red,
    fontSize: 13,
    fontWeight: "600",
  },
  viewTabsBtnInline: {
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  viewTabsText: {
    fontSize: 13,
    color: ThemeColors.blue,
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
  },
  emptyCartText: {
    fontSize: 18,
    color: ThemeColors.textSecondary,
    fontWeight: "bold",
  },
  emptyCartSub: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
  cartList: {
    flexGrow: 1,
  },
  totalsContainer: {
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  modifierRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    justifyContent: "space-between",
  },
  modifierBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  modifierCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    borderRadius: 4,
  },
  modifierBtnText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  totalRow: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  divider: {
    height: 1,
    backgroundColor: ThemeColors.bg,
    marginVertical: ThemeSpacing.xs,
  },
  grandTotalLabel: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 22,
    color: ThemeColors.emerald,
  },
  paymentMethodsRow: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: ThemeRadius.md,
    padding: 2,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  paymentMethodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: ThemeRadius.md - 2,
  },
  paymentMethodBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentMethodText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  paymentMethodTextActive: {
    color: ThemeColors.textPrimary,
  },
  actionButtonsContainer: {
    gap: ThemeSpacing.sm,
  },
  actionRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: ThemeColors.surface,
    paddingVertical: 12,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  checkoutButtonsContainer: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 12,
    borderRadius: ThemeRadius.lg,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnDisabled: {
    backgroundColor: ThemeColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  payBtnText: {
    fontSize: 16,
    color: ThemeColors.white,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: ThemeSpacing.lg,
    paddingBottom: 220, // Position it roughly above the Total row
  },
  tooltipContent: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: 250,
  },
  tooltipTitle: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  tooltipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tooltipLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  tooltipValue: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: 8,
  },
});
