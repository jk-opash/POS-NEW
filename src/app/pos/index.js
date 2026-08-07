import { CartPanel } from "@/components/pos/CartPanel";
import { CustomerReceiptModal } from "@/components/pos/CustomerReceiptModal";
import { DiscountModal } from "@/components/pos/DiscountModal";
import { EBillCheckoutModal } from "@/components/pos/EBillCheckoutModal";
import { EBillModal } from "@/components/pos/EBillModal";
import { FloatingCartBtn } from "@/components/pos/FloatingCartBtn";
import { KOTReceiptModal } from "@/components/pos/KOTReceiptModal";
import { MobileCartModal } from "@/components/pos/MobileCartModal";
import { ParkedSalesModal } from "@/components/pos/ParkedSalesModal";
import { POSCard } from "@/components/pos/POSCard";
import { POSHeader } from "@/components/pos/POSHeader";
import { SettlePaymentModal } from "@/components/pos/SettlePaymentModal";
import { SplitPaymentModal } from "@/components/pos/SplitPaymentModal";
import { TakeawayOrdersPanel } from "@/components/pos/TakeawayOrdersPanel";
import { VariantSelectorModal } from "@/components/pos/VariantSelectorModal";
import * as Icons from "lucide-react-native";

import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import {
  fetchBranchDetails,
  fetchZonesAndTables,
} from "@/store/slices/branchSlice";
import { fetchMenuData } from "@/store/slices/menuSlice";
import {
  addToCart,
  applyDiscount,
  clearCart,
  createInvoiceAsync,
  createOrder,
  decreaseRunningOrderItemQty,
  deleteOrderAsync,
  deleteParkedSale,
  fetchActiveOrders,
  parkSale,
  removeRunningOrderItem,
  resetOrder,
  restoreOrder,
  resumeParkedSale,
  saveKOT,
  setActiveTable,
  setCustomer,
  setOrderType,
  setTaxRate,
  updateKDSItemStatus,
  updateKDSOrderStatus,
  updateQuantity,
  voidItem,
} from "@/store/slices/posSlice";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
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
import { useDispatch, useSelector } from "react-redux";

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

  const activeBranch = useSelector((state) => state.branch?.activeBranch);
  const user = useSelector((state) => state.auth?.user);
  const branchId =
    activeBranch && activeBranch !== "br-1" ? activeBranch : user?.branch_id;
  const branches = useSelector((state) => state.branch?.branches || []);
  const currentBranch = branches.find((b) => b.id === branchId);
  const branchCode = currentBranch?.branch_code || "BR";

  const dispatch = useDispatch();
  const {
    items: menuItems,
    categories: categoriesList,
    isLoading: isLoadingMenu,
  } = useSelector((state) => state.menu);

  const posState = useSelector((state) => state.pos) || {};
  const {
    activeTable,
    activeOrderId,
    activeOrderNumber,
    cart = [],
    runningOrder = [],
    customer = null,
    orderType = "Dine-In",
    totals = { subtotal: 0, taxAmount: 0, discount: 0, grandTotal: 0 },
    kdsOrders = [],
  } = posState;

  // Real Redux Actions
  const handleAddToCartRedux = (
    product,
    variant = null,
    addons = [],
    quantity = 1,
    spiceLevel = null,
  ) => dispatch(addToCart({ product, variant, addons, quantity, spiceLevel }));
  const handleUpdateQuantityRedux = (id, quantity) =>
    dispatch(updateQuantity({ id, quantity }));
  const handleVoidItemRedux = (id) => dispatch(voidItem(id));
  const handleVoidLockedItemRedux = (item) => {
    Alert.alert(
      "Remove KOT Item",
      `Are you sure you want to remove ${item.product?.name} from the active KOT?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(
              removeRunningOrderItem({
                orderId: posState.activeOrderId,
                itemId: item.id,
                currentRunningOrder: runningOrder,
                totals: totals,
              }),
            );
          },
        },
      ],
    );
  };

  const handleSetCustomer = (customerData) => {
    dispatch(setCustomer(customerData));
  };

  const handleDecreaseLockedItemRedux = (item) => {
    dispatch(
      decreaseRunningOrderItemQty({
        orderId: posState.activeOrderId,
        itemId: item.id,
        currentRunningOrder: runningOrder,
        totals: totals,
      }),
    );
  };
  const handleClearCartRedux = () => dispatch(clearCart());

  // Pending API Hooks
  const assignEmployeeToItem = () => {};
  const holdCart = () => {};
  const handleParkSale = () => {
    // Generate a quick name for the sale, e.g. Table name or Customer name
    let name = "Walk-in";
    if (activeTable) {
      name = `${activeTable.name}`;
    } else if (customer) {
      name = customer.name;
    }
    dispatch(parkSale({ name }));
  };
  const voidEntireCart = async () => {
    if (posState.activeOrderId) {
      try {
        await dispatch(deleteOrderAsync(posState.activeOrderId)).unwrap();
        showAlert(
          "Order Cancelled",
          "The order has been cancelled and the table is now available.",
        );
      } catch (err) {
        showAlert("Error", "Failed to cancel order: " + err);
        return;
      }
    } else {
      handleClearCartRedux();
    }
  };
  const generateKOT = () => null;
  const updateCartItem = () => {};
  const createNewTakeaway = () => {
    if (cart.length > 0 || runningOrder.length > 0) {
      Alert.alert(
        "Start New Takeaway?",
        "You have items in your current order. Starting a new takeaway will clear the current cart. Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Start Fresh",
            style: "destructive",
            onPress: () => {
              dispatch(resetOrder());
              dispatch(setOrderType("Takeaway"));
            },
          },
        ],
      );
    } else {
      dispatch(resetOrder());
      dispatch(setOrderType("Takeaway"));
    }
  };
  const addOrder = () => {};
  const completeTableOrdersInKDS = () => {};
  const cancelItemInKDS = () => {};
  const updateItemQtyInKDS = () => {};
  const completeOrderInKDS = () => {};
  const activeOrders = kdsOrders;

  // ── KDS Action Handlers ───────────────────────────────────────────────
  // Update a full KOT ticket status (START PREP / BUMP TICKET buttons)
  const updateOrderStatus = (id, status) => {
    dispatch(updateKDSOrderStatus({ id, status }));
  };
  // Update a single item status within a KOT ticket
  const updateItemStatus = (orderId, itemId, status) => {
    dispatch(updateKDSItemStatus({ orderId, itemId, status }));
  };

  const takeawaySessions = {};

  const tables = useSelector((state) => state.branch?.tables) || [];
  const floors = useSelector((state) => state.branch?.floors) || [];

  const handleSetActiveTable = (table) => {
    dispatch(setActiveTable(table));
    dispatch(setOrderType("Dine-In"));

    if (table.status === "Occupied") {
      dispatch(restoreOrder({ branchId, tableId: table.id }));
    } else {
      // It's an available table. Do not create the DB order yet. Just clear Redux state.
      dispatch(resetOrder());
    }
  };
  const handleSetOrderType = (type) => dispatch(setOrderType(type));

  useEffect(() => {
    if (!branchId) return;
    dispatch(fetchMenuData(branchId));
    dispatch(fetchZonesAndTables(branchId));
    dispatch(fetchActiveOrders(branchId));

    dispatch(fetchBranchDetails(branchId)).then((action) => {
      const branchData = action.payload;
      if (branchData && branchData.tax_percentage !== undefined) {
        dispatch(setTaxRate(Number(branchData.tax_percentage)));
      }
    });
  }, [branchId, dispatch]);

  // Fallback states to prevent crashes since Redux slices were removed
  const { settings = { business: { verticalFlags: { isRetail: false } } } } =
    {};
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
  const [isTakeawayPanelOpen, setIsTakeawayPanelOpen] = useState(false);
  const [draftSplitState, setDraftSplitState] = useState(null);

  const handlePrintBill = () => {
    const combinedCart = [...runningOrder, ...cart];
    if (combinedCart.length === 0) {
      showAlert("Empty Order", "No items to print.");
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

  const handleSettleOrder = async (order) => {
    // If there's no active order in DB, just clear locally
    if (!posState.activeOrderId) {
      addOrder(order);
      handleClearCartRedux();
      dispatch(resetOrder());
      dispatch(setOrderType("Takeaway"));
      showAlert("Payment Successful", "Order has been completed successfully.");
      setShowSettlePayment(false);
      return;
    }

    try {
      const invoiceData = {
        invoice_number: `INV-${Date.now()}`,
        order_id: posState.activeOrderId,
        branch_id: branchId,
        subtotal: order.totals.subtotal,
        tax_amount: order.totals.taxAmount,
        discount_amount: order.totals.discountAmount,
        total_amount: order.totals.grandTotal,
        payment_methods: order.paymentMethods || {},
        customer_info: order.customer || {},
      };

      await dispatch(createInvoiceAsync(invoiceData)).unwrap();

      if (activeTable) {
        completeTableOrdersInKDS(activeTable.name);
      } else {
        const runningIds = new Set(runningOrder.map((i) => i.id));
        activeOrders.forEach((o) => {
          const hasItem = o.items && o.items.some((i) => runningIds.has(i.id));
          if (hasItem) completeOrderInKDS(o.id);
        });
      }

      showAlert("Payment Successful", "Order has been settled successfully.");
      setShowSettlePayment(false);
    } catch (err) {
      showAlert("Error", "Failed to settle order: " + err);
    }
  };

  useEffect(() => {
    if (activeTable && activeTable.cart) {
      // Logic if we want to restore specifically
    }
  }, [activeTable]);

  const handleAddToCart = (product) => {
    if (
      (product.variants && product.variants.length > 0) ||
      (product.addon_categories && product.addon_categories.length > 0) ||
      product.spice_level_enabled
    ) {
      setVariantSelectorItem(product);
    } else {
      handleAddToCartRedux(product);
    }
  };

  const handleConfirmVariantAddon = (product, variant, addons, spiceLevel) => {
    handleAddToCartRedux(product, variant, addons, 1, spiceLevel);
  };

  const categories = [
    "All",
    ...new Set(
      categoriesList.length > 0
        ? categoriesList.map((c) => c.name || c.category || c)
        : menuItems.map((p) => p.category).filter(Boolean),
    ),
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
      showAlert(
        "Remove Sent Item?",
        "This item has already been sent to the kitchen. Are you sure you want to remove it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              handleVoidItemRedux(productId);
              cancelItemInKDS(productId);
            },
          },
        ],
      );
    } else {
      handleVoidItemRedux(productId);
      cancelItemInKDS(productId);
    }
  };

  const handleUpdateQuantity = (cartItemId, qty) => {
    const runningItem = runningOrder.find((i) => i.id === cartItemId);

    if (runningItem && qty < runningItem.quantity) {
      showAlert(
        "Reduce Sent Item?",
        "This item has already been sent to the kitchen. Are you sure you want to reduce its quantity?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: "destructive",
            onPress: () => {
              handleUpdateQuantityRedux(cartItemId, qty);
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
      handleUpdateQuantityRedux(cartItemId, qty);
      // We only reach here directly if they are increasing quantity or it's not a running item
      if (runningItem && qty <= 0) {
        cancelItemInKDS(cartItemId);
      }
    }
  };
  const handleSendToKitchen = async (
    options = { print: false },
    isMobile = false,
  ) => {
    // For takeaway, if customer info is required, we can check it here
    if (orderType === "Takeaway" && settings.requireCustomerForTakeaway) {
      if (!customer?.name || !customer?.phone) {
        showAlert(
          "Customer Required",
          "Please enter customer name and phone number for takeaway orders before generating KOT.",
        );
        return;
      }
    }

    if (cart.length === 0) {
      showAlert(
        "Empty Cart",
        "Add items to the cart before sending to kitchen.",
      );
      return;
    }

    if (!activeOrderId && !activeTable && orderType !== "Takeaway") {
      showAlert(
        "No Active Order",
        "Please select a table or start a takeaway first.",
      );
      return;
    }

    let finalOrderId = activeOrderId;
    let finalOrderNumber = activeOrderNumber;

    if (!finalOrderId && (activeTable || orderType === "Takeaway")) {
      // ── Create the order JUST IN TIME ────────────────────────────────
      const now = new Date();
      const date = [
        String(now.getDate()).padStart(2, "0"),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getFullYear()),
      ].join("");
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const safeTable = activeTable
        ? (activeTable.name || "T").replace(/\s/g, "")
        : "TAKEAWAY";
      finalOrderNumber = `ORD-${branchCode}-${safeTable}-${date}-${random}`;

      try {
        const orderResult = await dispatch(
          createOrder({
            branch_id: branchId,
            order_number: finalOrderNumber,
            order_type: orderType,
            table_id: activeTable ? activeTable.id : null,
            status: "Pending",
            payment_status: "Pending",
            customer_info: customer || null,
            subtotal: 0,
            tax_amount: 0,
            discount_amount: 0,
            total_amount: 0,
          }),
        ).unwrap();

        finalOrderId = orderResult.id;
      } catch (err) {
        showAlert("Error", "Failed to create order. Please try again.");
        return;
      }
    }

    // ── Flowchart: "Save KOT" button ───────────────────────────────────
    // "POS→DB: Update Order (Generate KOT-101, move cart to running_order)"
    // "POS→K: Print KOT-101"
    const now = new Date();
    const dateStr = [
      String(now.getDate()).padStart(2, "0"),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getFullYear()),
    ].join("");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    // KOT number links back to the Order for traceability
    const kotNumber = `KOT-${finalOrderNumber || finalOrderId.slice(0, 6)}-${dateStr}-${rand}`;

    dispatch(
      saveKOT({
        orderId: finalOrderId,
        kotNumber,
        cartItems: cart,
        runningOrder,
        totals,
      }),
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchActiveOrders(branchId));
        if (options.print) {
          setKotReceipt({ kotNumber, items: cart });
        } else {
          if (isMobile) setIsCartVisible(false);
          showAlert(
            "Sent to Kitchen ✓",
            `KOT ${kotNumber} has been sent to the kitchen display.`,
            [
              {
                text: "OK",
                // onPress: () => !isMobile && router.push("/tables"),
              },
            ],
          );
        }
      }
    });
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
        onTakeawayOrdersPress={() => setIsTakeawayPanelOpen(true)}
        activeTakeawaysCount={Object.keys(takeawaySessions || {}).length}
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
                    const iconName = [][subCategory] || "Utensils";
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
            onSelectTable={handleSetActiveTable}
            orderType={orderType}
            onOrderTypeChange={handleSetOrderType}
            onNewTakeaway={createNewTakeaway}
            totals={totals}
            parkedSales={posState.parkedSales}
            taxRate={posState.taxRate}
            onCloseCart={() => setIsCartVisible(false)}
            onVoidEntireCart={() => voidEntireCart("Voided cart")}
            onViewParkedSales={() => setShowParkedSales(true)}
            onUpdateQuantity={handleUpdateQuantity}
            onVoidItem={handleVoidItem}
            onVoidLockedItem={handleVoidLockedItemRedux}
            onDecreaseLockedItem={handleDecreaseLockedItemRedux}
            onSetCustomer={handleSetCustomer}
            onAssignStaff={(id) => setSelectedServiceItem(id)}
            onUpdateCartItem={updateCartItem}
            onPrintBill={handlePrintBill}
            onDiscount={() => {
              if (isSmallScreen) setIsCartVisible(false);
              setShowDiscount(true);
            }}
            onParkSale={() => {
              if (cart.length === 0 && runningOrder.length === 0) {
                showAlert("Empty Cart", "Cannot park an empty sale.");
                return;
              }
              handleParkSale();
              showAlert(
                "Sale Parked",
                "The sale has been successfully parked.",
              );
            }}
            onSendToKitchen={(options) => handleSendToKitchen(options, false)}
            onCheckout={(options) => {
              if (isSmallScreen) setIsCartVisible(false);
              const action = options?.action || "none";
              if (action === "ebill") {
                setShowEBillCheckout(true);
              } else if (action === "pay") {
                setCheckoutAction("pay");
                setShowCheckout(true);
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
          cartLength={cart.reduce((sum, item) => sum + item.quantity, 0)}
          grandTotal={posState.totals?.grandTotal || 0}
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
          onSelectTable={handleSetActiveTable}
          orderType={orderType}
          onOrderTypeChange={handleSetOrderType}
          onNewTakeaway={createNewTakeaway}
          totals={totals}
          onVoidLockedItem={handleVoidLockedItemRedux}
          onDecreaseLockedItem={handleDecreaseLockedItemRedux}
          onSetCustomer={handleSetCustomer}
          parkedSales={parkSale}
          taxRate={posState.taxRate || 0}
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
              showAlert("Empty Cart", "Cannot park an empty sale.");
              return;
            }
            parkSale();
            if (isSmallScreen) setIsCartVisible(false);
            showAlert("Sale Parked", "The sale has been successfully parked.");
          }}
          onSendToKitchen={(options) => handleSendToKitchen(options, true)}
          onCheckout={(options) => {
            if (isSmallScreen) setIsCartVisible(false);
            const action = options?.action || "none";
            if (action === "ebill") {
              setShowEBillCheckout(true);
            } else if (action === "pay") {
              setCheckoutAction("pay");
              setShowCheckout(true);
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
        discount={posState.discount}
        onApply={(discountPayload) => dispatch(applyDiscount(discountPayload))}
      />

      <ParkedSalesModal
        visible={showParkedSales}
        onClose={() => setShowParkedSales(false)}
        parkedSales={posState.parkedSales}
        onRestore={(id) => {
          dispatch(resumeParkedSale(id));
          showAlert("Sale Restored", "The parked sale has been loaded.");
        }}
        onDelete={(id) => dispatch(deleteParkedSale(id))}
      />

      {showCheckout && (
        <SplitPaymentModal
          visible={showCheckout}
          onClose={() => setShowCheckout(false)}
          checkoutAction={checkoutAction}
          draftSplitState={draftSplitState}
          setDraftSplitState={setDraftSplitState}
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
            // addInvoice(
            //   buildInvoiceFromOrder(
            //     order,
            //     { activeTable, orderType, customer },
            //     action === "print" ? "print" : "none",
            //   ),
            // );
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
            // addInvoice(
            //   buildInvoiceFromOrder(
            //     order,
            //     { activeTable, orderType, customer },
            //     "ebill",
            //   ),
            // );
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

      <TakeawayOrdersPanel
        visible={isTakeawayPanelOpen}
        onClose={() => setIsTakeawayPanelOpen(false)}
        branchId={branchId}
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
