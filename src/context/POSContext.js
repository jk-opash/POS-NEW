import { useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from "react-native";
import { showAlert } from "../utils/alert";
import { useTables } from "./TablesContext";
import {
  createNewTakeaway as createNewTakeawayAction,
  setActiveTakeaway as setActiveTakeawayAction,
  setActiveTable as setActiveTableAction,
  setCustomer as setCustomerAction,
  setOrderType as setOrderTypeAction,
  setDraftSplitState as setDraftSplitStateAction,
  setGlobalDiscount as setGlobalDiscountAction,
  setTaxRate as setTaxRateAction,
  setCompoundingTaxes as setCompoundingTaxesAction,
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  generateKOT as generateKOTAction,
  voidItem as voidItemAction,
  voidEntireCart as voidEntireCartAction,
  parkSale as parkSaleAction,
  restoreParkedSale as restoreParkedSaleAction,
  deleteParkedSale as deleteParkedSaleAction,
  holdCart as holdCartAction,
  restoreTab as restoreTabAction,
  injectTableOrder as injectTableOrderAction
} from "../store/slices/posSlice";

export function usePOS() {
  const { updateTableStatus } = useTables();
  const dispatch = useDispatch();

  const posState = useSelector(state => state.pos);

  const setCustomer = (cust) => dispatch(setCustomerAction(cust));
  const setOrderType = (type) => dispatch(setOrderTypeAction(type));
  const setDraftSplitState = (state) => dispatch(setDraftSplitStateAction(state));
  const setGlobalDiscount = (discount) => dispatch(setGlobalDiscountAction(discount));
  const setTaxRate = (rate) => dispatch(setTaxRateAction(rate));
  const setCompoundingTaxes = (taxes) => dispatch(setCompoundingTaxesAction(taxes));

  const createNewTakeaway = () => dispatch(createNewTakeawayAction());
  const setActiveTakeaway = (id) => dispatch(setActiveTakeawayAction(id));
  const setActiveTable = (table) => dispatch(setActiveTableAction(table));

  const addToCart = (product, variant = null, addons = [], quantity = 1, notes = "") => {
    if (product.inventory?.currentStock <= 0) {
      showAlert(
        "Low Stock Warning",
        `${product.name} is out of stock. Add anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add", onPress: () => dispatch(addToCartAction({ product, variant, addons, quantity, notes })) },
        ]
      );
      return;
    }
    dispatch(addToCartAction({ product, variant, addons, quantity, notes }));
  };

  const generateKOT = () => {
    if (posState.activeTable && posState.cart.length > 0) {
      updateTableStatus(posState.activeTable.id, "Occupied");
    }
    dispatch(generateKOTAction());
  };

  const updateQuantity = (cartItemId, newQuantity) => dispatch(updateQuantityAction({ cartItemId, newQuantity }));
  const assignEmployeeToItem = (cartItemId, employee) => dispatch(updateCartItemAction({ cartItemId, updates: { employee } }));
  const updateCartItem = (cartItemId, updates) => dispatch(updateCartItemAction({ cartItemId, updates }));
  const removeFromCart = (cartItemId) => dispatch(removeFromCartAction(cartItemId));
  
  const clearCart = () => {
    if (posState.activeTable) {
      updateTableStatus(posState.activeTable.id, "Available");
    }
    dispatch(clearCartAction());
  };

  const voidItem = (cartItemId, reason = "No reason", cashierId = "EMP-UNKNOWN") => dispatch(voidItemAction({ cartItemId, reason, cashierId }));
  const voidEntireCart = (reason = "No reason", cashierId = "EMP-UNKNOWN") => dispatch(voidEntireCartAction({ reason, cashierId }));
  
  const parkSale = (ticketName) => dispatch(parkSaleAction(ticketName));
  const restoreParkedSale = (ticketId) => dispatch(restoreParkedSaleAction(ticketId));
  const deleteParkedSale = (ticketId) => dispatch(deleteParkedSaleAction(ticketId));
  const holdCart = (tabName) => dispatch(holdCartAction(tabName));
  const restoreTab = (tabId) => dispatch(restoreTabAction(tabId));
  const injectTableOrder = (tableId, orderObj) => dispatch(injectTableOrderAction({ tableId, orderObj }));

  const totals = useMemo(() => {
    let subtotal = 0;
    const allItems = [...posState.runningOrder, ...posState.cart];

    allItems.forEach((item) => {
      let itemPrice = item.product.pricing?.sellingPrice || 0;
      if (item.variant) itemPrice = item.variant.price;
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach(addon => { if (addon && addon.price) itemPrice += addon.price; });
      }
      if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
        const applicableTier = [...item.product.bulkPricing].sort((a, b) => b.minQty - a.minQty).find(tier => item.quantity >= tier.minQty);
        if (applicableTier) itemPrice = applicableTier.price;
      }
      let itemTotal = itemPrice * item.quantity;
      if (item.discount.type === "percentage") {
        itemTotal -= itemTotal * (item.discount.value / 100);
      } else if (item.discount.type === "fixed") {
        itemTotal -= item.discount.value;
      }
      subtotal += itemTotal;
    });

    let discountAmount = 0;
    if (posState.globalDiscount.type === "percentage") {
      discountAmount = subtotal * (posState.globalDiscount.value / 100);
    } else if (posState.globalDiscount.type === "fixed") {
      discountAmount = posState.globalDiscount.value;
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);

    let taxAmount = 0;
    if (posState.compoundingTaxes.length > 0) {
      let runningTotal = afterDiscount;
      posState.compoundingTaxes.forEach((tax) => {
        const thisTax = runningTotal * (tax.rate / 100);
        taxAmount += thisTax;
        if (tax.compoundsOn) runningTotal += thisTax;
      });
    } else {
      taxAmount = afterDiscount * (posState.taxRate / 100);
    }
    const grandTotal = afterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, grandTotal };
  }, [posState.cart, posState.runningOrder, posState.globalDiscount, posState.taxRate, posState.compoundingTaxes]);

  return {
    ...posState,
    totals,
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
}
