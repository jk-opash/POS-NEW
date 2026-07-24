import { CartPanel } from "@/components/pos/CartPanel";
import { CustomerReceiptModal } from "@/components/pos/CustomerReceiptModal";
import { DiscountModal } from "@/components/pos/DiscountModal";
import { EBillCheckoutModal } from "@/components/pos/EBillCheckoutModal";
import { EBillModal } from "@/components/pos/EBillModal";
import { EmployeeSelectionModal } from "@/components/pos/EmployeeSelectionModal";
import { FloatingCartBtn } from "@/components/pos/FloatingCartBtn";
import { KOTReceiptModal } from "@/components/pos/KOTReceiptModal";
import { MobileCartModal } from "@/components/pos/MobileCartModal";
import { ParkedSalesModal } from "@/components/pos/ParkedSalesModal";
import { POSCard } from "@/components/pos/POSCard";
import { POSHeader } from "@/components/pos/POSHeader";
import { SettlePaymentModal } from "@/components/pos/SettlePaymentModal";
import { SplitPaymentModal } from "@/components/pos/SplitPaymentModal";
import { VariantSelectorModal } from "@/components/pos/VariantSelectorModal";
import { SUBCATEGORY_ICONS } from "@/constants/menu";
import { useInvoices } from "@/context/InvoicesContext";
import { useKDS } from "@/context/KDSContext";
import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrdersContext";
import { usePOS } from "@/context/POSContext";
import * as Icons from "lucide-react-native";

import { Text } from "@/components/ui/Text";
import { useSettings } from "@/context/SettingsContext";
import { useTables } from "@/context/TablesContext";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { buildInvoiceFromOrder } from "@/utils/invoiceBuilder";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const formatDataForGrid = (data, numColumns) => {
  if (!data || data.length === 0) return [];
  const numberOfElementsLastRow = data.length % numColumns;
  if (numberOfElementsLastRow === 0) return data;
  
  const paddingNeeded = numColumns - numberOfElementsLastRow;
  const paddedData = [...data];
  for (let i = 0; i < paddingNeeded; i++) {
    paddedData.push({ id: `blank-${i}`, empty: true });
  }
  return paddedData;
};

export default function POSScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDesktop, isTablet, isMiniTab, isMobile, isLaptop } =
    useResponsive();
  const isWebDesktop = Platform.OS === "web" && (isDesktop || isLaptop);
  const isSmallScreen = isMobile || isMiniTab;

  const { menuItems } = useMenu();
  const {
    cart,
    customer,
    orderType,
    totals,
    addToCart,
    updateQuantity,
    assignEmployeeToItem,
    holdCart,
    parkedSales,
    activeTable,
    setActiveTable,
    parkSale,
    voidItem,
    voidEntireCart,
    setOrderType,
    runningOrder,
    generateKOT,
    updateCartItem,
    draftSplitState,
    clearCart,
  } = usePOS();

  const { tables, floors } = useTables();

  const {
    addOrderToKDS,
    cancelItemInKDS,
    updateItemQtyInKDS,
    completeTableOrdersInKDS,
    completeOrderInKDS,
    activeOrders,
  } = useKDS();
  const { addOrder } = useOrders();
  const { addInvoice } = useInvoices();

  const { settings } = useSettings();
  const { isRetail } = settings.business.verticalFlags;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showParkedSales, setShowParkedSales] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null); // stores productId for employee assignment
  const [variantSelectorItem, setVariantSelectorItem] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [kotReceipt, setKotReceipt] = useState(null); // Store KOT data for receipt printing
  const [checkoutAction, setCheckoutAction] = useState("none"); // "print", "email", or "none"
  const [showCustomerReceipt, setShowCustomerReceipt] = useState(false);
  const [showEBill, setShowEBill] = useState(false);
  const [showSettlePayment, setShowSettlePayment] = useState(false);
  const [showEBillCheckout, setShowEBillCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isBillOnly, setIsBillOnly] = useState(false);

  const handlePrintBill = () => {
    const combinedCart = [...runningOrder, ...cart];
    if (combinedCart.length === 0) {
      Alert.alert("Empty Order", "No items to print.");
      return;
    }
    const tempOrder = {
      id: `BILL-${Math.floor(Date.now() / 1000)}`,
      items: combinedCart,
      totals: totals,
      orderType: orderType,
      tableId: activeTable?.id,
      customer: customer,
      date: new Date().toISOString(),
    };
    setCompletedOrder(tempOrder);
    setIsBillOnly(true);
    setShowCustomerReceipt(true);
  };

  const handleSettleOrder = (order) => {
    addOrder(order);
    clearCart();

    if (activeTable) {
      completeTableOrdersInKDS(activeTable.name);
    } else {
      const runningIds = new Set(runningOrder.map((i) => i.id));
      activeOrders.forEach((o) => {
        const hasItem = o.items && o.items.some((i) => runningIds.has(i.id));
        if (hasItem) completeOrderInKDS(o.id);
      });
    }

    Alert.alert("Payment Successful", "Order has been completed successfully.");
    addInvoice(
      buildInvoiceFromOrder(
        order,
        { activeTable, orderType, customer },
        "none",
      ),
    );
    setShowSettlePayment(false);
    router.push("/invoices");
  };

  useEffect(() => {
    if (activeTable && activeTable.cart) {
      // Logic if we want to restore specifically
    }
  }, [activeTable]);

  const handleAddToCart = (product) => {
    if (
      (product.variants && product.variants.length > 0) ||
      (product.addonGroups && product.addonGroups.length > 0)
    ) {
      setVariantSelectorItem(product);
    } else {
      addToCart(product);
    }
  };

  const handleConfirmVariantAddon = (product, variant, addons) => {
    addToCart(product, variant, addons, 1);
  };

  const { isScannerConnected, simulateScan } = useBarcodeScanner((barcode) => {
    const matched = menuItems.find(
      (p) => p.sku === barcode || (p.barcode && p.barcode === barcode),
    );
    if (matched) {
      handleAddToCart(matched);
    } else {
      alert(`No product found for barcode: ${barcode}`);
    }
  });

  const categories = [
    ...new Set(menuItems.map((p) => p.category).filter(Boolean)),
  ];

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories.length]);
  const subCategories = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") {
      items = items.filter((p) => p.category === activeCategory);
    }
    const extracted = items
      .map((p) => p.subCategory || p.foodType)
      .filter(Boolean);
    return [...new Set(extracted)];
  }, [menuItems, activeCategory]);

  // Auto-select first subcategory when list changes
  useEffect(() => {
    if (
      subCategories.length > 0 &&
      !subCategories.includes(activeSubCategory)
    ) {
      setActiveSubCategory(subCategories[0]);
    }
  }, [subCategories]);

  const filteredProducts = useMemo(() => {
    return menuItems.filter((p) => {
      if (p.status !== "Active") return false;

      if (searchQuery) {
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (activeCategory !== "All" && p.category !== activeCategory) {
        return false;
      }
      if (
        activeSubCategory &&
        p.subCategory !== activeSubCategory &&
        p.foodType !== activeSubCategory
      ) {
        return false;
      }
      return true;
    });
  }, [menuItems, searchQuery, activeCategory, activeSubCategory]);

  const numColumns = isDesktop ? 4 : isTablet ? 4 : isMiniTab ? 3 : 2;

  const handleVoidItem = (productId) => {
    const runningItem = runningOrder.find((i) => i.id === productId);
    if (runningItem) {
      Alert.alert(
        "Remove Sent Item?",
        "This item has already been sent to the kitchen. Are you sure you want to remove it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              voidItem(productId, "Voided by user");
              cancelItemInKDS(productId);
            },
          },
        ],
      );
    } else {
      voidItem(productId, "Voided by user");
      cancelItemInKDS(productId);
    }
  };

  const handleUpdateQuantity = (cartItemId, qty) => {
    const runningItem = runningOrder.find((i) => i.id === cartItemId);

    if (runningItem && qty < runningItem.quantity) {
      Alert.alert(
        "Reduce Sent Item?",
        "This item has already been sent to the kitchen. Are you sure you want to reduce its quantity?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: "destructive",
            onPress: () => {
              updateQuantity(cartItemId, qty);
              if (qty <= 0) {
                cancelItemInKDS(cartItemId);
              } else {
                updateItemQtyInKDS(cartItemId, qty);
              }
            },
          },
        ],
      );
    } else {
      updateQuantity(cartItemId, qty);
      // We only reach here directly if they are increasing quantity or it's not a running item
      if (runningItem && qty <= 0) {
        cancelItemInKDS(cartItemId);
      }
    }
  };

  return (
    <View style={styles.root}>
      <POSHeader
        isDesktop={isWebDesktop}
        onMenuPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onFilterChange={(cat) => {
          setActiveCategory(cat);
          // subcategory auto-selects via useEffect when subCategories recalculates
        }}
        isRetail={isRetail}
        isScannerConnected={isScannerConnected}
        onSimulateScan={() => simulateScan("SKU001")}
      />

      <View
        style={[
          styles.container,
          { flexDirection: isLaptop ? "row" : "column" },
        ]}
      >
        {/* Left Panel: Products */}
        <View
          style={[
            styles.leftPanel,
            {
              flex: isLaptop ? 1.4 : 1,
              flexDirection: "row",
            },
          ]}
        >
          <View style={styles.subCategoryWrapper}>
            <FlatList
              data={subCategories}
              bounces={false}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.subCategoryScroll}
              renderItem={({ item: subCategory }) => (
                <TouchableOpacity
                  style={[
                    styles.subCategoryButton,
                    activeSubCategory === subCategory &&
                      styles.subCategoryButtonSelected,
                  ]}
                  onPress={() => setActiveSubCategory(subCategory)}
                >
                  {(() => {
                    const iconName =
                      SUBCATEGORY_ICONS[subCategory] || "Utensils";
                    const IconComp = Icons[iconName] || Icons.Utensils;
                    return (
                      <IconComp
                        size={20}
                        color={
                          activeSubCategory === subCategory
                            ? ThemeColors.white
                            : ThemeColors.textSecondary
                        }
                        style={{ marginRight: 8 }}
                      />
                    );
                  })()}
                  <Text
                    style={[
                      styles.subCategoryButtonText,
                      activeSubCategory === subCategory &&
                        styles.subCategoryButtonTextSelected,
                    ]}
                  >
                    {subCategory}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            data={formatDataForGrid(filteredProducts, numColumns)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.empty) {
                return <View style={{ flex: 1 }} />;
              }
              return (
                <POSCard
                  product={item}
                  inCart={cart.some((c) => c.product.id === item.id)}
                  onAddToCart={handleAddToCart}
                />
              );
            }}
            key={numColumns}
            numColumns={numColumns}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right Panel: Cart (Desktop/Tablet) */}
        {!isSmallScreen && (
          <CartPanel
            isSmallScreen={isSmallScreen}
            cart={cart}
            runningOrder={runningOrder}
            activeTable={activeTable}
            tables={tables}
            floors={floors}
            onSelectTable={setActiveTable}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            totals={totals}
            parkedSales={parkedSales}
            taxRate={usePOS().taxRate}
            onCloseCart={() => setIsCartVisible(false)}
            onVoidEntireCart={() => voidEntireCart("Voided cart")}
            onViewParkedSales={() => setShowParkedSales(true)}
            onUpdateQuantity={handleUpdateQuantity}
            onVoidItem={handleVoidItem}
            onAssignStaff={(id) => setSelectedServiceItem(id)}
            onUpdateCartItem={updateCartItem}
            onPrintBill={handlePrintBill}
            onDiscount={() => {
              if (isSmallScreen) setIsCartVisible(false);
              setShowDiscount(true);
            }}
            onParkSale={() => {
              if (cart.length === 0 && runningOrder.length === 0) {
                Alert.alert("Empty Cart", "Cannot park an empty sale.");
                return;
              }
              parkSale();
              Alert.alert(
                "Sale Parked",
                "The sale has been successfully parked.",
              );
            }}
            onSendToKitchen={(options = { print: false }) => {
              const kot = generateKOT();
              if (kot) {
                addOrderToKDS(kot);
                if (options.print) {
                  setKotReceipt(kot);
                } else {
                  Alert.alert(
                    "Sent to Kitchen",
                    "Order has been sent to KDS successfully.",
                    [{ text: "OK", onPress: () => router.push("/tables") }],
                  );
                }
              }
            }}
            onCheckout={(options) => {
              if (isSmallScreen) setIsCartVisible(false);
              const action = options?.action || "none";
              if (action === "ebill") {
                setShowEBillCheckout(true);
              } else if (action === "pay") {
                if (!draftSplitState) {
                  setCheckoutAction("pay");
                  setShowCheckout(true);
                  return;
                }
                const combinedCart = [...runningOrder, ...cart];
                const tempOrder = {
                  id: `ORD-${Date.now()}`,
                  items: combinedCart,
                  totals: totals,
                  orderType: orderType,
                  tableId: activeTable?.id,
                  customer: customer,
                  date: new Date().toISOString(),
                  status: "Completed",
                  paymentMethods: draftSplitState.paymentMethods,
                };
                setCompletedOrder(tempOrder);
                setShowSettlePayment(true);
              } else {
                setCheckoutAction(action);
                setShowCheckout(true);
              }
            }}
          />
        )}
      </View>

      {/* Floating Cart Button for Small Screens */}
      {isSmallScreen && !isCartVisible && (
        <FloatingCartBtn
          cartLength={cart.length}
          grandTotal={totals.grandTotal}
          onPress={() => setIsCartVisible(true)}
        />
      )}

      {/* Mobile Cart Modal */}
      {isSmallScreen && (
        <MobileCartModal
          visible={isCartVisible}
          isSmallScreen={isSmallScreen}
          cart={cart}
          runningOrder={runningOrder}
          activeTable={activeTable}
          tables={tables}
          floors={floors}
          onSelectTable={setActiveTable}
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          totals={totals}
          parkedSales={parkedSales}
          taxRate={usePOS().taxRate}
          onCloseCart={() => setIsCartVisible(false)}
          onVoidEntireCart={() => voidEntireCart("Voided cart")}
          onViewParkedSales={() => setShowParkedSales(true)}
          onUpdateQuantity={handleUpdateQuantity}
          onVoidItem={handleVoidItem}
          onAssignStaff={(id) => setSelectedServiceItem(id)}
          onUpdateCartItem={updateCartItem}
          onPrintBill={handlePrintBill}
          onDiscount={() => {
            if (isSmallScreen) setIsCartVisible(false);
            setShowDiscount(true);
          }}
          onParkSale={() => {
            if (cart.length === 0 && runningOrder.length === 0) {
              Alert.alert("Empty Cart", "Cannot park an empty sale.");
              return;
            }
            parkSale();
            if (isSmallScreen) setIsCartVisible(false);
            Alert.alert(
              "Sale Parked",
              "The sale has been successfully parked.",
            );
          }}
          onSendToKitchen={(options = { print: false }) => {
            const kot = generateKOT();
            if (kot) {
              addOrderToKDS(kot);
              if (options.print) {
                setKotReceipt(kot);
              } else {
                Alert.alert(
                  "Sent to Kitchen",
                  "Order has been sent to KDS successfully.",
                );
              }
            }
          }}
          onCheckout={(options) => {
            if (isSmallScreen) setIsCartVisible(false);
            const action = options?.action || "none";
            if (action === "ebill") {
              setShowEBillCheckout(true);
            } else if (action === "pay") {
              if (!draftSplitState) {
                setCheckoutAction("pay");
                setShowCheckout(true);
                return;
              }
              const combinedCart = [...runningOrder, ...cart];
              const tempOrder = {
                id: `ORD-${Date.now()}`,
                items: combinedCart,
                totals: totals,
                orderType: orderType,
                tableId: activeTable?.id,
                customer: customer,
                date: new Date().toISOString(),
                status: "Completed",
                paymentMethods: draftSplitState.paymentMethods,
              };
              setCompletedOrder(tempOrder);
              setShowSettlePayment(true);
            } else {
              setCheckoutAction(action);
              setShowCheckout(true);
            }
          }}
        />
      )}

      <DiscountModal
        visible={showDiscount}
        onClose={() => setShowDiscount(false)}
      />

      <ParkedSalesModal
        visible={showParkedSales}
        onClose={() => setShowParkedSales(false)}
      />

      {showCheckout && (
        <SplitPaymentModal
          visible={showCheckout}
          onClose={() => setShowCheckout(false)}
          checkoutAction={checkoutAction}
          onComplete={(order, action) => {
            if (action === "bill_only") {
              setCompletedOrder(order);
              setIsBillOnly(true);
              setShowCustomerReceipt(true);
              return;
            }
            if (action === "pay") {
              setCompletedOrder(order);
              setShowSettlePayment(true);
              return;
            }
            setCompletedOrder(order);
            addInvoice(
              buildInvoiceFromOrder(
                order,
                { activeTable, orderType, customer },
                action === "print" ? "print" : "none",
              ),
            );
            if (action === "print") {
              setShowCustomerReceipt(true);
            } else {
              router.push("/invoices");
            }
          }}
        />
      )}

      {showSettlePayment && (
        <SettlePaymentModal
          visible={showSettlePayment}
          order={completedOrder}
          onClose={() => setShowSettlePayment(false)}
          onSettle={handleSettleOrder}
        />
      )}

      {/* eBill Checkout Modal - combines payment + eBill contact in one flow */}
      {showEBillCheckout && (
        <EBillCheckoutModal
          visible={showEBillCheckout}
          onClose={() => {
            setShowEBillCheckout(false);
          }}
          onComplete={(order) => {
            setCompletedOrder(order);
            addInvoice(
              buildInvoiceFromOrder(
                order,
                { activeTable, orderType, customer },
                "ebill",
              ),
            );
          }}
        />
      )}

      {/* Variant Selector Modal */}
      <VariantSelectorModal
        visible={!!variantSelectorItem}
        product={variantSelectorItem}
        onClose={() => setVariantSelectorItem(null)}
        onConfirm={handleConfirmVariantAddon}
      />

      {/* KOT Receipt Modal */}
      <KOTReceiptModal
        visible={!!kotReceipt}
        kot={kotReceipt}
        onClose={() => {
          setKotReceipt(null);
          router.push("/tables");
        }}
      />

      {/* Customer Receipt Modal */}
      {showCustomerReceipt && (
        <CustomerReceiptModal
          visible={showCustomerReceipt}
          order={completedOrder}
          onClose={() => {
            setShowCustomerReceipt(false);
            setIsBillOnly(false);
          }}
        />
      )}

      {/* E-Bill Modal */}
      {showEBill && (
        <EBillModal
          visible={showEBill}
          order={completedOrder}
          onClose={() => {
            setShowEBill(false);
            router.push("/invoices");
          }}
        />
      )}

      <EmployeeSelectionModal
        visible={!!selectedServiceItem}
        onClose={() => setSelectedServiceItem(null)}
        selectedEmployeeId={
          selectedServiceItem
            ? cart.find((c) => c.product.id === selectedServiceItem)?.employee
                ?.id
            : null
        }
        onSelect={(emp) => {
          if (selectedServiceItem) {
            assignEmployeeToItem(selectedServiceItem, emp);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  container: {
    flex: 1,
  },
  leftPanel: {
    flex: 1,
  },
  productList: {
    paddingHorizontal: ThemeSpacing.md,
    paddingBottom: 100,
    paddingTop: ThemeSpacing.md,
    gap: ThemeSpacing.md,
  },
  columnWrapper: {
    gap: ThemeSpacing.md,
  },
  subCategoryWrapper: {
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  subCategoryScroll: {
    flexGrow: 1,
  },
  subCategoryButton: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    width: 140,
    flexDirection: "row",
    alignItems: "center",
  },
  subCategoryButtonSelected: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  subCategoryButtonText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
    flexShrink: 1,
  },
  subCategoryButtonTextSelected: {
    color: ThemeColors.surface,
  },
});
