import { orderApi, invoiceApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ─── API #1: Create Order ──────────────────────────────────────────────────────
// Fired when: Table card is tapped (Dine-In) OR new Takeaway session is started
// What it does:
//   1. Creates an Order row in DB (status: Pending)
//   2. Backend automatically marks the Table as "Occupied" (via $transaction)
// Route: POST /api/order
export const createOrder = createAsyncThunk(
  "pos/createOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const res = await orderApi.create(orderPayload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #2: Save KOT ─────────────────────────────────────────────────────────
// Fired when: "Save KOT" or "Print KOT" button is pressed in CartPanel
// What it does:
//   1. Updates the Order in DB: appends new KOT number to kot_numbers[]
//      and moves current cart items into running_order (persisted history)
//   2. In Redux: moves cart -> runningOrder (locally locked)
//   3. KDS screen picks up the new ticket from kdsOrders[]
// Route: PUT /api/order/:id
export const saveKOT = createAsyncThunk(
  "pos/saveKOT",
  async ({ orderId, kotNumber, cartItems, runningOrder, totals }, { rejectWithValue }) => {
    try {
      // Sanitize: extract only the DB-safe fields from each cart item
      // Full Redux objects contain undefined/circular refs that break JSON serialization
      const sanitizeItem = (item) => ({
        id: item.id,
        kot_number: kotNumber,
        isLockedItem: true,
        quantity: item.quantity,
        status: item.status || "Accepted",
        note: item.note || null,
        product: item.product ? {
          id: item.product.id || item.product._id,
          name: item.product.name,
          category: item.product.category || item.product.category_name || null,
          price: item.product.pricing?.sellingPrice || item.product.price || item.product.base_price || 0,
        } : null,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          price: item.variant.price,
        } : null,
        addons: (item.addons || []).map(a => ({ id: a.id, name: a.name, price: a.price || 0 })),
      });

      const sanitizedCart = cartItems.map(sanitizeItem);
      const sanitizedRunning = (runningOrder || []).map(item =>
        item.kot_number ? item : sanitizeItem(item) // already sanitized items pass through
      );
      const newRunningOrder = [...sanitizedRunning, ...sanitizedCart];

      const res = await orderApi.update(orderId, {
        kot_numbers:      [kotNumber],
        running_order:    newRunningOrder,
        cart_items:       [],
        subtotal:         totals.subtotal || 0,
        tax_amount:       totals.taxAmount || 0,
        discount_amount:  totals.discountAmount || 0,
        total_amount:     totals.grandTotal || 0,
      });
      return { kotNumber, cartItems, updatedOrder: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #2: Fetch Active Orders ──────────────────────────────────────────────
// Fetches orders and parses them into kdsOrders tickets.
export const fetchActiveOrders = createAsyncThunk(
  "pos/fetchActiveOrders",
  async (branchId, { rejectWithValue }) => {
    try {
      // We fetch "Pending" because createOrder sets status: "Pending" initially
      const res = await orderApi.getPending(branchId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #2b: Fetch All Orders (History/Running) ──────────────────────────────
export const fetchAllOrders = createAsyncThunk(
  "pos/fetchAllOrders",
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await orderApi.getAll(branchId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── Remove Item from Running Order (KOT void) ───────────────────────────────
export const removeRunningOrderItem = createAsyncThunk(
  "pos/removeRunningOrderItem",
  async ({ orderId, itemId, currentRunningOrder, totals }, { rejectWithValue }) => {
    try {
      const newRunningOrder = currentRunningOrder.filter((item) => item.id !== itemId);
      
      const res = await orderApi.update(orderId, {
        running_order: newRunningOrder,
        subtotal: totals.subtotal || 0,
        tax_amount: totals.taxAmount || 0,
        discount_amount: totals.discountAmount || 0,
        total_amount: totals.grandTotal || 0,
      });
      return { itemId, updatedOrder: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── Decrease Quantity of a Running Order Item (KOT item qty -1) ─────────────
// Decrements the item's quantity by 1. Removes it entirely when qty reaches 0.
export const decreaseRunningOrderItemQty = createAsyncThunk(
  "pos/decreaseRunningOrderItemQty",
  async ({ orderId, itemId, currentRunningOrder, totals }, { rejectWithValue }) => {
    try {
      const newRunningOrder = currentRunningOrder.reduce((acc, item) => {
        if (item.id !== itemId) {
          acc.push(item);
        } else if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
        // quantity === 1 → drop it (removed)
        return acc;
      }, []);

      const res = await orderApi.update(orderId, {
        running_order: newRunningOrder,
        subtotal: totals.subtotal || 0,
        tax_amount: totals.taxAmount || 0,
        discount_amount: totals.discountAmount || 0,
        total_amount: totals.grandTotal || 0,
      });
      return { itemId, newRunningOrder, updatedOrder: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── Restore Order (Occupied Table) ───────────────────────────────────────────
// Fired when: User taps an OCCUPIED table on the Tables screen.
// Fetches the existing Pending order for that table and restores state in Redux.
export const restoreOrder = createAsyncThunk(
  "pos/restoreOrder",
  async ({ branchId, tableId }, { rejectWithValue }) => {
    try {
      const res = await orderApi.getPending(branchId);
      const orders = res.data.data || [];
      const existing = orders.find((o) => o.table_id === tableId);
      if (!existing) return rejectWithValue("No active order found for this table");
      return existing;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #3: Update KDS Status ──────────────────────────────────────────────────
// Persists KOT or Item status changes to the database and syncs state.
export const updateKDSOrderStatusAsync = createAsyncThunk(
  "pos/updateKDSOrderStatus",
  async ({ orderId, kotNumber, status }, { rejectWithValue }) => {
    try {
      await orderApi.updateKds(orderId, { kotNumber, status });
      return { id: kotNumber, status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateKDSItemStatusAsync = createAsyncThunk(
  "pos/updateKDSItemStatus",
  async ({ orderId, dbOrderId, itemId, status }, { rejectWithValue }) => {
    try {
      await orderApi.updateKds(dbOrderId, { itemId, status });
      return { orderId, itemId, status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateKDSMultipleItemsStatusAsync = createAsyncThunk(
  "pos/updateKDSMultipleItemsStatus",
  async ({ orderId, dbOrderId, itemIds, status }, { rejectWithValue }) => {
    try {
      await orderApi.updateKds(dbOrderId, { itemIds, status });
      return { orderId, itemIds, status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #4: Delete/Cancel Order ────────────────────────────────────────────────
// Deletes an order and frees the table
export const deleteOrderAsync = createAsyncThunk(
  "pos/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await orderApi.delete(orderId);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── API #5: Create Invoice (Settle Bill) ───────────────────────────────────────
// Generates the final invoice, marks the order Paid, and frees the table
export const createInvoiceAsync = createAsyncThunk(
  "pos/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const res = await invoiceApi.create(invoiceData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  activeTable: null,
  activeOrderId: null,       // DB Order UUID — set after createOrder resolves
  activeOrderNumber: null,   // e.g. "ORD-DG-01-T1-02012026-XXXXXXXXXX"
  orderType: "Dine-In",
  cart: [],
  runningOrder: [],
  customer: null,
  discount: null, // { type: 'percentage' | 'fixed', value: number, reason: string }
  parkedSales: [],
  taxRate: 0,
  totals: { subtotal: 0, taxAmount: 0, discountAmount: 0, grandTotal: 0 },
  // ── KDS State ─────────────────────────────────────────────────────────────
  // kdsOrders feeds the Kitchen Display System screen.
  // Each entry is one KOT ticket shown as an OrderTicket card on the KDS.
  kdsOrders: [],
  activeOrders: [],
  allOrders: [],
  isSaving: false,
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setActiveTable: (state, action) => {
      state.activeTable = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setTaxRate: (state, action) => {
      state.taxRate = action.payload || 0;
      posSlice.caseReducers.calculateTotals(state);
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearPOSData: (state) => {
      return initialState;
    },
    // Manually set the active order (e.g. when restoring a parked sale or resuming a table)
    setActiveOrder: (state, action) => {
      const order = action.payload;
      state.activeOrderId = order?.id || null;
      state.activeOrderNumber = order?.order_number || null;
      
      if (order) {
        state.runningOrder = (order.running_order || []).map(item => ({
          ...item,
          isLockedItem: true,
        }));
        state.cart = (order.cart_items || []);
        posSlice.caseReducers.calculateTotals(state);
      }
    },
    resetOrder: (state) => {
      state.activeOrderId = null;
      state.activeOrderNumber = null;
      state.cart = [];
      state.runningOrder = [];
      state.activeTable = null;
      state.customer = null;
    },
    addToCart: (state, action) => {
      const { product, quantity = 1, variant = null, addons = [], spiceLevel = null } = action.payload;
      const cartItemId = `${product.id}-${variant?.name || 'base'}-${addons.map(a => a.name).sort().join('-')}-${spiceLevel?.id || 'none'}`;
      
      const existing = state.cart.find(c => c.id === cartItemId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({
          id: cartItemId,
          product,
          variant,
          addons,
          spiceLevel,
          quantity,
          isLockedItem: false
        });
      }
      posSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.cart = state.cart.filter(c => c.id !== id);
      } else {
        const item = state.cart.find(c => c.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      posSlice.caseReducers.calculateTotals(state);
    },
    voidItem: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter(c => c.id !== id);
      posSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.cart = [];
      posSlice.caseReducers.calculateTotals(state);
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload; // { type, value, reason }
      posSlice.caseReducers.calculateTotals(state);
    },
    parkSale: (state, action) => {
      const { name } = action.payload;
      const parkedSale = {
        id: Date.now().toString(),
        name: name || `Parked Sale #${state.parkedSales.length + 1}`,
        time: new Date().toISOString(),
        cart: [...state.cart],
        runningOrder: [...state.runningOrder],
        activeTable: state.activeTable,
        orderType: state.orderType,
        customer: state.customer,
        discount: state.discount,
        totals: { ...state.totals },
      };
      state.parkedSales.push(parkedSale);
      
      // Clear current sale
      state.cart = [];
      state.runningOrder = [];
      state.activeTable = null;
      state.customer = null;
      state.discount = null;
      posSlice.caseReducers.calculateTotals(state);
    },
    resumeParkedSale: (state, action) => {
      const id = action.payload;
      const saleIndex = state.parkedSales.findIndex(s => s.id === id);
      if (saleIndex > -1) {
        const sale = state.parkedSales[saleIndex];
        state.cart = sale.cart || [];
        state.runningOrder = sale.runningOrder || [];
        state.activeTable = sale.activeTable || null;
        state.orderType = sale.orderType || "Dine-In";
        state.customer = sale.customer || null;
        state.discount = sale.discount || null;
        state.totals = sale.totals || { subtotal: 0, taxAmount: 0, discountAmount: 0, grandTotal: 0 };
        
        // Remove from parked
        state.parkedSales.splice(saleIndex, 1);
      }
    },
    deleteParkedSale: (state, action) => {
      const id = action.payload;
      state.parkedSales = state.parkedSales.filter(s => s.id !== id);
    },
    calculateTotals: (state) => {
      let subtotal = 0;
      let taxAmount = 0;
      
      const allItems = [...state.runningOrder, ...state.cart];
      
      allItems.forEach(item => {
        let itemPrice = Number(item.product.pricing?.sellingPrice || item.product.price || item.product.base_price || 0);
        if (item.variant) {
          itemPrice = Number(item.variant.price) || 0;
        }
        const addonsPrice = (item.addons || []).reduce((sum, a) => sum + Number(a.price || 0), 0);
        const totalItemPrice = (itemPrice + addonsPrice) * item.quantity;
        
        subtotal += totalItemPrice;
        
        // Calculate tax based on the dynamic taxRate (percentage)
        const currentTaxRate = state.taxRate || 0;
        taxAmount += totalItemPrice * (currentTaxRate / 100); 
      });

      // Calculate discount
      let discountAmount = 0;
      if (state.discount) {
        if (state.discount.type === 'percentage') {
          discountAmount = subtotal * (state.discount.value / 100);
        } else if (state.discount.type === 'fixed') {
          discountAmount = state.discount.value;
        }
      }

      state.totals = {
        subtotal,
        taxAmount,
        discountAmount,
        grandTotal: subtotal + taxAmount - discountAmount
      };
    }
  },
  extraReducers: (builder) => {
    // createOrder: store DB id
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.activeOrderId = action.payload.id;
      state.activeOrderNumber = action.payload.order_number;
      state.runningOrder = [];
      state.cart = [];
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      console.warn("[POS] createOrder failed:", action.payload);
    });

    // restoreOrder: rebuild Redux state from existing DB order when re-entering an Occupied table
    builder.addCase(restoreOrder.fulfilled, (state, action) => {
      const order = action.payload;
      state.activeOrderId = order.id;
      state.activeOrderNumber = order.order_number;
      // Restore running_order from DB as locked items so they appear in the POS cart panel
      state.runningOrder = (order.running_order || []).map(item => ({
        ...item,
        isLockedItem: true,
      }));
      state.cart = []; // Cart is always empty when restoring — new items go in fresh
      
      // Ensure we re-calculate the totals for the restored running order!
      posSlice.caseReducers.calculateTotals(state);
    });
    builder.addCase(restoreOrder.rejected, (state, action) => {
      console.warn("[POS] restoreOrder failed:", action.payload);
    });

    builder.addCase(removeRunningOrderItem.fulfilled, (state, action) => {
      const { itemId } = action.payload;
      state.runningOrder = state.runningOrder.filter(item => item.id !== itemId);
    });
    builder.addCase(removeRunningOrderItem.rejected, (state, action) => {
      console.warn("[POS] removeRunningOrderItem failed:", action.payload);
    });

    builder.addCase(decreaseRunningOrderItemQty.fulfilled, (state, action) => {
      const { newRunningOrder } = action.payload;
      // Replace runningOrder with the server-confirmed list (already has updated qty or item removed)
      state.runningOrder = newRunningOrder.map(item => ({ ...item, isLockedItem: true }));
    });
    builder.addCase(decreaseRunningOrderItemQty.rejected, (state, action) => {
      console.warn("[POS] decreaseRunningOrderItemQty failed:", action.payload);
    });

    // saveKOT: move cart -> runningOrder in Redux, add ticket to KDS board
    builder.addCase(saveKOT.fulfilled, (state, action) => {
      const { kotNumber, cartItems } = action.payload;

      // Lock cart items into runningOrder (they can no longer be edited)
      const locked = cartItems.map((item) => ({ ...item, isLockedItem: true, kot_number: kotNumber }));
      state.runningOrder = [...state.runningOrder, ...locked];
      state.cart = [];

      // Build the KDS ticket from the KOT items
      const kdsTicket = {
        id: kotNumber,
        dbOrderId: state.activeOrderId, // Added to connect to backend Order
        orderNumber: kotNumber,
        type: state.orderType,
        table: state.activeTable?.name || null,
        customer: state.customer?.name || null,
        station: "Kitchen",
        status: "Accepted",
        startTime: new Date().toISOString(),
        priority: "Normal",
        items: cartItems.map((ci) => ({
          id: ci.id,
          name: ci.product?.name || "Item",
          qty: ci.quantity,
          course: ci.product?.category || "Uncategorized",
          status: "Accepted",
          modifiers: (ci.addons || []).map((a) => a.name),
          note: ci.note || null,
        })),
      };
      state.kdsOrders.push(kdsTicket);

      posSlice.caseReducers.calculateTotals(state);
    });
    builder.addCase(saveKOT.rejected, (state, action) => {
      console.warn("[POS] saveKOT failed:", action.payload);
    });



    // fetchAllOrders (fetches full history)
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      const orders = Array.isArray(action.payload) ? action.payload : [];
      state.allOrders = orders;
    });

    // deleteOrderAsync
    builder.addCase(deleteOrderAsync.fulfilled, (state) => {
      // Free the table locally by clearing the active session
      state.activeOrderId = null;
      state.activeOrderNumber = null;
      state.cart = [];
      state.runningOrder = [];
      state.activeTable = null;
    });
    builder.addCase(deleteOrderAsync.rejected, (state, action) => {
      console.warn("[POS] deleteOrder failed:", action.payload);
    });

    // createInvoiceAsync
    builder.addCase(createInvoiceAsync.fulfilled, (state) => {
      // Bill is settled, free the local session
      state.activeOrderId = null;
      state.activeOrderNumber = null;
      state.cart = [];
      state.runningOrder = [];
      state.activeTable = null;
    });
    builder.addCase(createInvoiceAsync.rejected, (state, action) => {
      console.warn("[POS] createInvoice failed:", action.payload);
    });

    // fetchActiveOrders: Parse orders into kdsTickets
    builder.addCase(fetchActiveOrders.fulfilled, (state, action) => {
      const orders = action.payload || [];
      state.activeOrders = orders;
      const kdsTickets = [];
      
      orders.forEach(order => {
        if (!order.kot_numbers || !order.running_order) return;
        
        // Group running_order items by kot_number
        const itemsByKot = {};
        order.running_order.forEach(item => {
          if (item.kot_number) {
            if (!itemsByKot[item.kot_number]) itemsByKot[item.kot_number] = [];
            itemsByKot[item.kot_number].push(item);
          }
        });

        // Create a ticket for each KOT — derive ticket status from most-advanced item
        order.kot_numbers.forEach(kotNum => {
          const kotItems = itemsByKot[kotNum] || [];
          if (kotItems.length > 0) {
            // Derive top-level ticket status from items (most advanced status wins)
            const statusPriority = ["Accepted", "Preparing", "Done", "Served", "Completed", "Cancelled"];
            const statuses = kotItems.map(ci => ci.status || "Accepted");
            const ticketStatus = statuses.reduce((best, s) => 
              statusPriority.indexOf(s) > statusPriority.indexOf(best) ? s : best
            , "Accepted");

            kdsTickets.push({
              id: kotNum,
              dbOrderId: order.id,
              orderNumber: kotNum,
              type: order.order_type,
              table: order.table?.name || null,
              customer: order.customer_info?.name || order.customer?.name || null,
              station: "Kitchen",
              status: ticketStatus,   // ← restored from DB
              startTime: order.created_at,
              priority: "Normal",
              items: kotItems.map(ci => ({
                id: ci.id,
                name: ci.product?.name || "Item",
                qty: ci.quantity,
                course: ci.product?.category || "Uncategorized",
                status: ci.status || "Accepted",  // ← restored from DB
                modifiers: (ci.addons || []).map(a => a.name),
                note: ci.note || null
              }))
            });
          }
        });
      });

      state.kdsOrders = kdsTickets;
    });

    // Handle Async KDS Updates
    builder.addCase(updateKDSOrderStatusAsync.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      const order = state.kdsOrders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        // Also update every item in the ticket so Waiter screen filter works
        order.items.forEach(item => { item.status = status; });
      }
    });
    builder.addCase(updateKDSItemStatusAsync.fulfilled, (state, action) => {
      const { orderId, itemId, status } = action.payload;
      const order = state.kdsOrders.find((o) => o.id === orderId);
      if (order) {
        const item = order.items.find((i) => i.id === itemId);
        if (item) item.status = status;
      }
    });
    builder.addCase(updateKDSMultipleItemsStatusAsync.fulfilled, (state, action) => {
      const { orderId, itemIds, status } = action.payload;
      const order = state.kdsOrders.find((o) => o.id === orderId);
      if (order) {
        order.items.forEach((item) => {
          if (itemIds.includes(item.id)) {
            item.status = status;
          }
        });
      }
    });
  },
});

export const {
  setActiveTable, setOrderType, setTaxRate, clearPOSData, setActiveOrder,
  addToCart, updateQuantity, voidItem, clearCart, applyDiscount,
  parkSale, resumeParkedSale, deleteParkedSale, calculateTotals, resetOrder, setCustomer
} = posSlice.actions;
export default posSlice.reducer;
