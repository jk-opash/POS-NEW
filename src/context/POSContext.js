import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import { showAlert } from "../utils/alert";
import { useTables } from "./TablesContext";

const POSContext = createContext();

export function POSProvider({ children }) {
  const { updateTableStatus } = useTables();
  const [tableSessions, setTableSessions] = useState({}); // Stores states per table
  const [takeawaySessions, setTakeawaySessions] = useState({}); // Stores multiple takeaway sessions
  const [activeTakeawayId, setActiveTakeawayId] = useState(null);
  const [cart, setCart] = useState([]); // { id: uniqueId, product, quantity, discount, notes, variant, addons: [] }
  const [runningOrder, setRunningOrder] = useState([]); // items already sent to KDS (KOT generated)
  const [kots, setKots] = useState([]); // [{ kotNumber, time, items, status }]
  const [customer, setCustomer] = useState(null);
  const [activeTable, setActiveTableInternal] = useState(null);
  const [orderType, setOrderType] = useState("Dine-In");
  const [draftSplitState, setDraftSplitState] = useState(null); // { splitMode, paymentMethods, numPeople, itemPeople, itemAssignments, grandTotal }
  const [globalDiscount, setGlobalDiscount] = useState({
    type: "none",
    value: 0,
  }); // type: 'percentage' | 'fixed' | 'none'
  const [taxRate, setTaxRate] = useState(5); // e.g., 5% GST
  const [compoundingTaxes, setCompoundingTaxes] = useState([]); // [{name, rate, compoundsOn}]
  const [parkedSales, setParkedSales] = useState([]); // Saved/parked tickets
  const [voidLog, setVoidLog] = useState([]); // Audit log for voids
  
  // Track sequential KOT number
  const [lastKOTNumber, setLastKOTNumber] = useState(0);

  const saveCurrentSession = useCallback(() => {
    if (activeTable) {
      setTableSessions((prev) => ({
        ...prev,
        [activeTable.id]: {
          cart,
          runningOrder,
          kots,
          customer,
          orderType,
          globalDiscount,
          draftSplitState,
        },
      }));
    } else if (activeTakeawayId) {
      setTakeawaySessions((prev) => ({
        ...prev,
        [activeTakeawayId]: {
          cart,
          runningOrder,
          kots,
          customer,
          orderType,
          globalDiscount,
          draftSplitState,
          createdAt: prev[activeTakeawayId]?.createdAt || new Date().toISOString(),
        },
      }));
    }
  }, [
    activeTable,
    activeTakeawayId,
    cart,
    runningOrder,
    kots,
    customer,
    orderType,
    globalDiscount,
    draftSplitState,
  ]);

  const createNewTakeaway = useCallback(() => {
    saveCurrentSession();
    setActiveTableInternal(null);
    setActiveTakeawayId(null);
    setCart([]);
    setRunningOrder([]);
    setKots([]);
    setCustomer(null);
    setOrderType("Takeaway");
    setGlobalDiscount({ type: "none", value: 0 });
    setDraftSplitState(null);
  }, [saveCurrentSession]);

  const setActiveTakeaway = useCallback((id) => {
    saveCurrentSession();
    setActiveTableInternal(null);
    setActiveTakeawayId(id);
    setTakeawaySessions((prev) => {
      const session = prev[id] || {
        cart: [],
        runningOrder: [],
        kots: [],
        customer: null,
        orderType: "Takeaway",
        globalDiscount: { type: "none", value: 0 },
        draftSplitState: null,
      };
      setCart(session.cart);
      setRunningOrder(session.runningOrder);
      setKots(session.kots);
      setCustomer(session.customer);
      setOrderType(session.orderType);
      setGlobalDiscount(session.globalDiscount);
      setDraftSplitState(session.draftSplitState);
      return prev;
    });
  }, [saveCurrentSession]);

  const setActiveTable = useCallback((newTable) => {
    saveCurrentSession();
    setActiveTakeawayId(null);

    if (newTable) {
      setTableSessions((prev) => {
        const session = prev[newTable.id] || {
          cart: [],
          runningOrder: [],
          kots: [],
          customer: null,
          orderType: "Dine-In",
          globalDiscount: { type: "none", value: 0 },
          draftSplitState: null,
        };
        setCart(session.cart);
        setRunningOrder(session.runningOrder);
        setKots(session.kots);
        setCustomer(session.customer);
        setOrderType(session.orderType);
        setGlobalDiscount(session.globalDiscount);
        setDraftSplitState(session.draftSplitState);
        return prev;
      });
    } else {
      setCart([]);
      setRunningOrder([]);
      setKots([]);
      setCustomer(null);
      setOrderType("Takeaway");
      setGlobalDiscount({ type: "none", value: 0 });
      setDraftSplitState(null);
    }
    setActiveTableInternal(newTable);
  }, [saveCurrentSession]);

  const addToCart = (product, variant = null, addons = [], quantity = 1, notes = "") => {
    if (product.inventory?.currentStock <= 0) {
      showAlert(
        "Low Stock Warning",
        `${product.name} is out of stock. Add anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add", onPress: () => performAddToCart(product, variant, addons, quantity, notes) },
        ],
      );
      return;
    }
    performAddToCart(product, variant, addons, quantity, notes);
  };

  const performAddToCart = (product, variant, addons, quantity, notes) => {
    // Check if it exists in runningOrder first
    const runningIdx = runningOrder.findIndex(
      (item) => 
        item.product.id === product.id && 
        item.variant?.id === variant?.id &&
        JSON.stringify(item.addons) === JSON.stringify(addons)
    );
    let existingId = null;
    if (runningIdx >= 0) {
      existingId = runningOrder[runningIdx].id;
    }

    setCart((prev) => {
      // Check if exact same item exists in cart
      const existingIdx = prev.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.variant?.id === variant?.id &&
          JSON.stringify(item.addons) === JSON.stringify(addons)
      );

      if (existingIdx >= 0) {
        const newCart = [...prev];
        newCart[existingIdx] = { 
          ...newCart[existingIdx], 
          quantity: newCart[existingIdx].quantity + quantity, 
          notes: notes || newCart[existingIdx].notes 
        };
        return newCart;
      }
      return [
        ...prev,
        {
          id: existingId || `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product,
          variant,
          addons,
          quantity,
          discount: { type: "none", value: 0 },
          notes,
          employee: null,
        },
      ];
    });
  };

  const generateKOT = () => {
    if (cart.length === 0) return null;
    
    const newKOTNumber = lastKOTNumber + 1;
    setLastKOTNumber(newKOTNumber);
    
    const newKOT = {
      id: `KOT-${Date.now()}`,
      kotNumber: newKOTNumber,
      time: new Date().toISOString(),
      items: [...cart],
      status: "Sent",
      table: activeTable,
      orderType
    };
    
    setKots(prev => [...prev, newKOT]);
    
    // Update table status if Dine-In
    if (activeTable) {
      updateTableStatus(activeTable.id, "Occupied");
    }
    
    // Move cart items to running order with KOT tags
    const taggedCart = cart.map(item => ({
      ...item,
      kotId: newKOT.id,
      kotNumber: newKOT.kotNumber
    }));
    
    setRunningOrder(prev => [...prev, ...taggedCart]);

    if (orderType === "Takeaway" && !activeTakeawayId) {
      const newId = customer?.name ? `Takeaway-${customer.name.replace(/\s+/g, '-')}` : `Takeaway-${Math.floor(Date.now() / 1000)}`;
      setActiveTakeawayId(newId);
      setTakeawaySessions(prev => ({
        ...prev,
        [newId]: {
          cart: [],
          runningOrder: [...runningOrder, ...taggedCart],
          kots: [...kots, newKOT],
          customer,
          orderType: "Takeaway",
          globalDiscount,
          draftSplitState,
          createdAt: new Date().toISOString()
        }
      }));
    }
    
    // Clear current cart (unplaced items)
    setCart([]);
    
    return newKOT;
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    const runningItem = runningOrder.find(i => i.id === cartItemId);
    const runningQty = runningItem ? runningItem.quantity : 0;
    
    if (newQuantity > runningQty) {
      // The extra goes to cart
      const cartQty = newQuantity - runningQty;
      
      setCart((prev) => {
        const existingIdx = prev.findIndex(i => i.id === cartItemId);
        if (existingIdx >= 0) {
          const newCart = [...prev];
          newCart[existingIdx] = { ...newCart[existingIdx], quantity: cartQty };
          return newCart;
        } else if (runningItem) {
          return [...prev, { ...runningItem, quantity: cartQty }];
        }
        // Fallback for purely cart items
        return prev.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item);
      });
    } else {
      // newQuantity <= runningQty. They are voiding sent items.
      setCart(prev => prev.filter(i => i.id !== cartItemId)); // Remove from cart entirely
      setRunningOrder(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const assignEmployeeToItem = (cartItemId, employee) => {
    setCart((prev) => prev.map((item) => item.id === cartItemId ? { ...item, employee } : item));
    setRunningOrder((prev) => prev.map((item) => item.id === cartItemId ? { ...item, employee } : item));
  };

  const updateCartItem = (cartItemId, updates) => {
    setCart((prev) => prev.map((item) => item.id === cartItemId ? { ...item, ...updates } : item));
    setRunningOrder((prev) => prev.map((item) => item.id === cartItemId ? { ...item, ...updates } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    setRunningOrder((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    if (activeTable) {
      updateTableStatus(activeTable.id, "Available");
      setTableSessions((prev) => {
        const next = { ...prev };
        delete next[activeTable.id];
        return next;
      });
    } else if (activeTakeawayId) {
      setTakeawaySessions((prev) => {
        const next = { ...prev };
        delete next[activeTakeawayId];
        return next;
      });
    }
    setCart([]);
    setRunningOrder([]);
    setKots([]);
    setCustomer(null);
    setActiveTableInternal(null);
    setActiveTakeawayId(null);
    setGlobalDiscount({ type: "none", value: 0 });
    setOrderType("Takeaway");
    setDraftSplitState(null);
  };


  // ── Void with Audit ────────────────────────────────────────────────
  const voidItem = useCallback(
    (cartItemId, reason = "No reason", cashierId = "EMP-UNKNOWN") => {
      let item = cart.find((i) => i.id === cartItemId);
      if (!item) {
        item = runningOrder.find((i) => i.id === cartItemId);
      }
      if (!item) return;
      setVoidLog((prev) => [
        {
          id: `VOID-${Date.now()}`,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          reason,
          cashierId,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      setCart((prev) => prev.filter((i) => i.id !== cartItemId));
      setRunningOrder((prev) => prev.filter((i) => i.id !== cartItemId));
    },
    [cart, runningOrder],
  );

  const voidEntireCart = useCallback(
    (reason = "No reason", cashierId = "EMP-UNKNOWN") => {
      const allItems = [...cart, ...runningOrder];
      allItems.forEach((item) => {
        setVoidLog((prev) => [
          {
            id: `VOID-${Date.now()}-${item.product.id}`,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            reason,
            cashierId,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      });
      clearCart();
    },
    [cart, runningOrder],
  );

  const totals = useMemo(() => {
    let subtotal = 0;

    const allItems = [...runningOrder, ...cart];

    // Calculate items
    allItems.forEach((item) => {
      let itemPrice = item.product.pricing?.sellingPrice || 0;
      
      // Add variant price if selected
      if (item.variant) {
        itemPrice = item.variant.price;
      }
      
      // Add addons price
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach(addon => {
          if (addon && addon.price) {
            itemPrice += addon.price;
          }
        });
      }

      if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
        const applicableTier = [...item.product.bulkPricing]
          .sort((a, b) => b.minQty - a.minQty)
          .find((tier) => item.quantity >= tier.minQty);
        if (applicableTier) {
          itemPrice = applicableTier.price;
        }
      }
      let itemTotal = itemPrice * item.quantity;

      // Apply item discount if any
      if (item.discount.type === "percentage") {
        itemTotal -= itemTotal * (item.discount.value / 100);
      } else if (item.discount.type === "fixed") {
        itemTotal -= item.discount.value;
      }

      subtotal += itemTotal;
    });

    // Apply global discount
    let discountAmount = 0;
    if (globalDiscount.type === "percentage") {
      discountAmount = subtotal * (globalDiscount.value / 100);
    } else if (globalDiscount.type === "fixed") {
      discountAmount = globalDiscount.value;
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // Support compounding taxes: Tax B can apply to (Total + Tax A)
    let taxAmount = 0;
    if (compoundingTaxes.length > 0) {
      let runningTotal = afterDiscount;
      compoundingTaxes.forEach((tax) => {
        const thisTax = runningTotal * (tax.rate / 100);
        taxAmount += thisTax;
        if (tax.compoundsOn) {
          runningTotal += thisTax; // Next tax compounds on this
        }
      });
    } else {
      taxAmount = afterDiscount * (taxRate / 100);
    }

    const grandTotal = afterDiscount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
    };
  }, [cart, runningOrder, globalDiscount, taxRate, compoundingTaxes]);

  const [openTabs, setOpenTabs] = useState([]);

  // ── Park / Save Ticket ─────────────────────────────────────────────
  const parkSale = useCallback(
    (ticketName) => {
      if (cart.length === 0 && runningOrder.length === 0) return;
      const ticket = {
        id: `PKD-${Date.now()}`,
        name: ticketName || `Ticket #${parkedSales.length + 1}`,
        cart: [...cart],
        runningOrder: [...runningOrder],
        kots: [...kots],
        customer,
        activeTable,
        setActiveTable,
        takeawaySessions,
        activeTakeawayId,
        createNewTakeaway,
        setActiveTakeaway,
        orderType,
        globalDiscount,
        totals,
        time: new Date().toISOString(),
      };
      setParkedSales((prev) => [...prev, ticket]);
      clearCart();
      return ticket;
    },
    [
      cart,
      runningOrder,
      kots,
      customer,
      activeTable,
      orderType,
      globalDiscount,
      totals,
      parkedSales.length,
    ],
  );

  const restoreParkedSale = useCallback(
    (ticketId) => {
      const ticket = parkedSales.find((t) => t.id === ticketId);
      if (!ticket) return;

      // 1. Save current state to the active table before restoring
      if (activeTable) {
        setTableSessions((prev) => ({
          ...prev,
          [activeTable.id]: {
            cart,
            runningOrder,
            kots,
            customer,
            orderType,
            globalDiscount,
            draftSplitState,
          },
        }));
      }

      // 2. Load the parked ticket into active state
      setCart(ticket.cart || []);
      setRunningOrder(ticket.runningOrder || []);
      setKots(ticket.kots || []);
      setCustomer(ticket.customer);
      setOrderType(ticket.orderType);
      setGlobalDiscount(ticket.globalDiscount || { type: "none", value: 0 });
      setActiveTableInternal(ticket.activeTable || null);

      // 3. Pre-fill the table session so it doesn't get lost if they switch tables
      if (ticket.activeTable) {
        setTableSessions((prev) => ({
          ...prev,
          [ticket.activeTable.id]: {
            cart: ticket.cart || [],
            runningOrder: ticket.runningOrder || [],
            kots: ticket.kots || [],
            customer: ticket.customer,
            orderType: ticket.orderType,
            globalDiscount: ticket.globalDiscount || { type: "none", value: 0 },
            draftSplitState: null,
          }
        }));
      }

      setParkedSales((prev) => prev.filter((t) => t.id !== ticketId));
    },
    [parkedSales, activeTable, cart, runningOrder, kots, customer, orderType, globalDiscount, draftSplitState],
  );

  const deleteParkedSale = useCallback((ticketId) => {
    setParkedSales((prev) => prev.filter((t) => t.id !== ticketId));
  }, []);

  const holdCart = (tabName) => {
    if (cart.length === 0) return;

    const newTab = {
      id: `TAB-${Date.now()}`,
      name:
        tabName ||
        (activeTable
          ? `Table ${activeTable.name}`
          : `Tab ${openTabs.length + 1}`),
      cart: [...cart],
      customer,
      activeTable,
      orderType,
      globalDiscount,
      totals,
      time: new Date().toISOString(),
    };

    setOpenTabs((prev) => [...prev, newTab]);
    clearCart();
  };

  const restoreTab = (tabId) => {
    const tab = openTabs.find((t) => t.id === tabId);
    if (!tab) return;

    setCart(tab.cart);
    setCustomer(tab.customer);
    setActiveTable(tab.activeTable);
    setOrderType(tab.orderType);
    setGlobalDiscount(tab.globalDiscount);

    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  const injectTableOrder = (tableId, orderObj) => {
    setTableSessions((prev) => {
      const session = prev[tableId] || {
        cart: [],
        runningOrder: [],
        kots: [],
        customer: null,
        orderType: "Dine-In",
        globalDiscount: { type: "none", value: 0 },
        draftSplitState: null,
      };

      const newKOTNumber = (session.kots.length || 0) + 1;
      const newKOT = {
        id: `KOT-${Date.now()}`,
        kotNumber: newKOTNumber,
        time: new Date().toISOString(),
        items: orderObj.items.map(i => ({
          ...i,
          product: { 
            id: i.id || `prod_${Date.now()}`, 
            name: i.name, 
            price: i.price,
            pricing: { sellingPrice: i.price } 
          },
          quantity: i.qty || 1,
        })),
        status: "Sent",
        table: { id: tableId, name: orderObj.customer },
        orderType: "Dine-In"
      };

      const taggedCart = newKOT.items.map(item => ({
        ...item,
        kotId: newKOT.id,
        kotNumber: newKOT.kotNumber,
        discount: { type: "none", value: 0 },
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));

      return {
        ...prev,
        [tableId]: {
          ...session,
          customer: { name: orderObj.customer, phone: orderObj.phone },
          runningOrder: [...session.runningOrder, ...taggedCart],
          kots: [...session.kots, newKOT],
        }
      };
    });
  };

  const value = {
    cart,
    runningOrder,
    kots,
    customer,
    activeTable,
    takeawaySessions,
    activeTakeawayId,
    orderType,
    globalDiscount,
    taxRate,
    compoundingTaxes,
    totals,
    openTabs,
    parkedSales,
    voidLog,
    draftSplitState,
    setDraftSplitState,
    setCustomer,
    setActiveTable,
    createNewTakeaway,
    setActiveTakeaway,
    setOrderType,
    setGlobalDiscount,
    setTaxRate,
    setCompoundingTaxes,
    addToCart,
    generateKOT,
    updateQuantity,
    assignEmployeeToItem,
    updateCartItem,
    removeFromCart,
    clearCart,
    holdCart,
    restoreTab,
    parkSale,
    restoreParkedSale,
    deleteParkedSale,
    voidItem,
    voidEntireCart,
    injectTableOrder,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
}
