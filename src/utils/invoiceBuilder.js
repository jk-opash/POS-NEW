/**
 * Shared utility to build a structured invoice object from a completed POS order.
 * Used by SplitPaymentModal (Save & Print / Normal), EBillCheckoutModal (Save & eBill).
 *
 * @param {object} order       - The completed order object from SplitPaymentModal/EBillCheckoutModal
 * @param {object} posContext  - { activeTable, orderType, customer }
 * @param {string} billingType - "print" | "ebill" | "none"
 */
export function buildInvoiceFromOrder(order, posContext = {}, billingType = "none") {
  const { activeTable, orderType, customer: posCustomer, platform } = posContext;

  const customer = order.customer ||
    posCustomer || { name: "Walk-in", phone: "", email: "" };

  // Resolve unit price for a cart item (handles variants + addons)
  const resolveItemPrice = (item) => {
    let price = item.product?.pricing?.sellingPrice || item.product?.price || 0;
    if (item.variant?.price != null) price = item.variant.price;
    if (item.addons?.length) {
      item.addons.forEach((a) => { if (a?.price) price += a.price; });
    }
    return price;
  };

  const allItems = order.items || [];

  const invoiceItems = allItems.map((item) => {
    const unitPrice = resolveItemPrice(item);
    const qty = item.quantity || 1;
    // Per-item discount
    let lineDiscount = 0;
    if (item.discount?.type === "percentage") {
      lineDiscount = unitPrice * qty * (item.discount.value / 100);
    } else if (item.discount?.type === "fixed") {
      lineDiscount = item.discount.value;
    }
    const total = unitPrice * qty - lineDiscount;

    return {
      name: item.product?.name || "Unknown Item",
      sku: item.product?.sku || "—",
      qty,
      unitPrice,
      variant: item.variant?.name || null,
      addons: item.addons?.map((a) => a.name).filter(Boolean) || [],
      discount: lineDiscount,
      note: item.note || null,
      total,
    };
  });

  // Payment breakdown
  const splitPayments = order.paymentMethods || [];
  const paymentMethodStr = splitPayments.length
    ? splitPayments.map((p) => `${p.method} (₹${parseFloat(p.amount).toFixed(2)})`).join(" + ")
    : "Cash";

  return {
    type: "Sales Invoice",
    billingType,                    // "print" | "ebill" | "none"
    store: "Main Store",
    cashier: "Current User",
    table: activeTable ? activeTable.name : null,
    orderType: orderType || order.orderType || "Dine-In",
    platform: platform || order.platform || null,
    customer,
    ebillContact: order.ebillContact || null,
    paymentMethod: paymentMethodStr,
    splitPayments,
    status: "Paid",
    subtotal: order.totals?.subtotal || 0,
    discount: order.totals?.discountAmount || 0,
    tax: order.totals?.taxAmount || 0,
    grandTotal: order.totals?.grandTotal || 0,
    amountPaid: order.totals?.grandTotal || 0,
    outstandingBalance: 0,
    items: invoiceItems,
    notes: order.notes || "",
  };
}
