import { invoiceApi, branchApi } from "@/api/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parsePaymentMethods = (pmRaw, totalAmount) => {
  let pmList = [];
  let paymentStr = "Full Payment";

  try {
    pmList = typeof pmRaw === "string" ? JSON.parse(pmRaw) : pmRaw || [];

    if (Array.isArray(pmList) && pmList.length > 0) {
      if (pmList.length === 1) {
        const amt = Number(pmList[0].amount);
        if (amt < Number(totalAmount) - 1) {
          paymentStr = "Part Payment";
        } else {
          paymentStr = `Full (${pmList[0].method})`;
        }
      } else {
        const hasPersonLabels = pmList.some(
          (p) => p.label && p.label.startsWith("Person")
        );
        if (hasPersonLabels) {
          const amounts = pmList.map((p) => Number(p.amount));
          const maxAmt = Math.max(...amounts);
          const minAmt = Math.min(...amounts);
          paymentStr = maxAmt - minAmt <= 1 ? "Split (Equal)" : "Split (Item wise)";
        } else {
          paymentStr = "Split (Custom)";
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse payment_methods:", e);
  }

  const amountPaid = Array.isArray(pmList)
    ? pmList.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    : Number(totalAmount);

  return {
    paymentStr,
    pmList: Array.isArray(pmList) ? pmList : [],
    amountPaid,
  };
};

export const mapInvoiceResponse = (inv, branchData, user, branchName, branchAddress) => {
  const combinedCart = inv.order?.running_order || [];
  const mappedItems = combinedCart.map((i) => {
    const price = Number(
      i.product?.price ||
        i.price ||
        i.product?.pricing?.sellingPrice ||
        i.product?.base_price ||
        0
    );
    return {
      name: i.product?.name || "Item",
      sku: i.product?.sku || "—",
      qty: i.quantity,
      unitPrice: price,
      total: price * (i.quantity || 1),
    };
  });

  const { paymentStr, pmList, amountPaid } = parsePaymentMethods(
    inv.payment_methods,
    inv.total_amount
  );

  return {
    id: inv.invoice_number,
    rawId: inv.id,
    status: "Paid",
    date: inv.issued_at,
    customer: inv.customer_info || { name: "Walk-in Customer" },
    orderType: inv.order?.order_type || "Dine-in",
    table: inv.order?.table?.name || null,
    subtotal: Number(inv.subtotal),
    tax: Number(inv.tax_amount),
    taxRate: branchData.tax_percentage || 5,
    discount: Number(inv.discount_amount),
    grandTotal: Number(inv.total_amount),
    amountPaid,
    outstandingBalance: Number(inv.total_amount) - amountPaid,
    items: mappedItems,
    platform: null,
    type: "Tax Invoice",
    orderNumber: inv.order?.order_number,
    kotNumbers: inv.order?.kot_numbers,
    billingType: "print",
    store: branchName,
    storeAddress: branchAddress,
    cashier: inv.cashier_name || user?.name || user?.email || "Admin",
    cashierRole:
      inv.cashier_role ||
      (typeof user?.role === "object" ? user?.role?.name : user?.role) ||
      "Cashier",
    paymentMethod: paymentStr,
    splitPayments: pmList,
  };
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * Fetches all invoices for a branch and transforms them using mapInvoiceResponse.
 * The user object is passed in so the selector isn't needed inside the thunk.
 */
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async ({ branchId, user }, { rejectWithValue }) => {
    try {
      const [invoiceRes, branchRes] = await Promise.all([
        invoiceApi.getByBranch(branchId),
        branchApi.getById(branchId).catch(() => ({
          data: { data: {} },
        })),
      ]);

      const branchData = branchRes.data?.data || {};
      const branchName = branchData.name || "";
      const branchAddress = branchData.address || "";

      const invoices = (invoiceRes.data?.data || []).map((inv) =>
        mapInvoiceResponse(inv, branchData, user, branchName, branchAddress)
      );

      return { invoices, branchData };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    items: [],
    branchData: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearInvoices: (state) => {
      state.items = [];
      state.branchData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.invoices;
        state.branchData = action.payload.branchData;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;
