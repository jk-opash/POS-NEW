import { Text } from "@/components/ui/Text";
import { useKDS } from "@/context/KDSContext";
import { useOrders } from "@/context/OrdersContext";
import { usePOS } from "@/context/POSContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Minus, Plus, User, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function SplitPaymentModal({
  visible,
  onClose,
  checkoutAction,
  onComplete,
}) {
  const {
    cart,
    runningOrder,
    totals,
    clearCart,
    activeTable,
    draftSplitState,
    setDraftSplitState,
    orderType,
    customer,
    setCustomer,
  } = usePOS();
  const { addOrder } = useOrders();
  const { completeTableOrdersInKDS, completeOrderInKDS, activeOrders } =
    useKDS();

  const [splitMode, setSplitMode] = useState(
    draftSplitState?.splitMode || "custom",
  ); // "custom", "equal", "item"
  const [customerName, setCustomerName] = useState(customer?.name || "");
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || "");

  const [numPeople, setNumPeople] = useState(draftSplitState?.numPeople || 2);
  const [itemPeople, setItemPeople] = useState(
    draftSplitState?.itemPeople || [
      { id: 1, name: "P1" },
      { id: 2, name: "P2" },
    ],
  );
  const [itemAssignments, setItemAssignments] = useState(
    draftSplitState?.itemAssignments || {},
  );
  const [paymentMethods, setPaymentMethods] = useState(
    draftSplitState?.paymentMethods || [
      { method: "Cash", amount: totals.grandTotal.toString() },
    ],
  );

  const handleSetEqualSplit = (num) => {
    if (num < 1) return;
    setNumPeople(num);
    const amount = Math.floor((totals.grandTotal / num) * 100) / 100;
    let newMethods = Array(num)
      .fill(0)
      .map((_, idx) => ({
        method: "Cash",
        amount: amount.toFixed(2),
        label: `Person ${idx + 1}`,
      }));
    const sum = amount * num;
    const diff = totals.grandTotal - sum;
    if (Math.abs(diff) > 0.001) {
      newMethods[newMethods.length - 1].amount = (amount + diff).toFixed(2);
    }
    setPaymentMethods(newMethods);
  };

  const handleSetItemSplit = (assignments, people) => {
    let newMethods = people.map((p) => {
      let personSubtotal = 0;
      [...runningOrder, ...cart].forEach((item) => {
        const rawAssigned = assignments[item.id];
        const assignedPeople = Array.isArray(rawAssigned)
          ? rawAssigned
          : rawAssigned
            ? [rawAssigned]
            : [];
        if (assignedPeople.includes(p.id)) {
          let price =
            item.product.pricing?.sellingPrice || item.product.price || 0;
          if (item.variant) price = item.variant.price;
          if (item.addons)
            item.addons.forEach((a) => {
              if (a && a.price) price += a.price;
            });
          personSubtotal += (price * item.quantity) / assignedPeople.length;
        }
      });
      const ratio = totals.subtotal > 0 ? personSubtotal / totals.subtotal : 0;
      const personTotal =
        personSubtotal +
        totals.taxAmount * ratio -
        totals.discountAmount * ratio;
      return { method: "Cash", amount: personTotal.toFixed(2), label: p.name };
    });
    setPaymentMethods(newMethods);
  };

  useEffect(() => {
    if (splitMode === "equal") {
      handleSetEqualSplit(numPeople);
    } else if (splitMode === "item") {
      handleSetItemSplit(itemAssignments, itemPeople);
    } else if (splitMode === "custom") {
      if (
        !draftSplitState ||
        draftSplitState.splitMode !== "custom" ||
        Math.abs(draftSplitState.grandTotal - totals.grandTotal) > 0.01
      ) {
        setPaymentMethods([
          { method: "Cash", amount: totals.grandTotal.toString() },
        ]);
      }
    }
  }, [splitMode, totals.grandTotal]);

  const handleAddMethod = () => {
    setPaymentMethods([...paymentMethods, { method: "Card", amount: "" }]);
  };

  const handleUpdateAmount = (index, value) => {
    const newMethods = [...paymentMethods];
    newMethods[index].amount = value;
    setPaymentMethods(newMethods);
  };

  const handleUpdateMethod = (index, method) => {
    const newMethods = [...paymentMethods];
    newMethods[index].method = method;
    setPaymentMethods(newMethods);
  };

  const handleRemoveMethod = (index) => {
    const newMethods = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(newMethods);
  };

  const totalPaid = paymentMethods.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0,
  );
  const remaining = totals.grandTotal - totalPaid;

  const handlePrintInvoice = () => {
    if (Math.abs(remaining) > 0.01) {
      Alert.alert(
        "Invalid Amount",
        "Total split amounts must equal the grand total.",
      );
      return;
    }

    const finalCustomer =
      orderType === "Takeaway"
        ? { name: customerName, phone: customerPhone }
        : customer;
    if (orderType === "Takeaway" && (customerName || customerPhone)) {
      setCustomer(finalCustomer);
    }

    const order = {
      id: `BILL-${Date.now()}`,
      items: [...runningOrder, ...cart],
      totals,
      paymentMethods,
      status: "Bill",
      date: new Date().toISOString(),
      customer: finalCustomer,
    };

    setDraftSplitState({
      splitMode,
      paymentMethods,
      numPeople,
      itemPeople,
      itemAssignments,
      grandTotal: totals.grandTotal,
    });

    onClose();
    if (onComplete) {
      onComplete(order, checkoutAction === "pay" ? "pay" : "bill_only");
    }
  };

  const methods = ["Cash", "Card", "UPI"];
  const allItems = [...runningOrder, ...cart];

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              Create Bill
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modeTabs}>
            {["custom", "equal", "item"].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeTab,
                  splitMode === mode && styles.modeTabActive,
                ]}
                onPress={() => setSplitMode(mode)}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    splitMode === mode && styles.modeTabTextActive,
                  ]}
                >
                  {mode === "custom"
                    ? "Custom Amount"
                    : mode === "equal"
                      ? "Split Equally"
                      : "Split by Item"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.content}>
            {orderType === "Takeaway" && (
              <View style={styles.customerFields}>
                <Text weight="bold" style={styles.customerTitle}>
                  Customer Details (Takeaway)
                </Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter name"
                      value={customerName}
                      onChangeText={setCustomerName}
                      placeholderTextColor={ThemeColors.textTertiary}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mobile No.</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter mobile"
                      value={customerPhone}
                      onChangeText={setCustomerPhone}
                      keyboardType="phone-pad"
                      placeholderTextColor={ThemeColors.textTertiary}
                    />
                  </View>
                </View>
              </View>
            )}

            {splitMode === "equal" && (
              <View style={styles.equalSplitControls}>
                <Text style={styles.equalSplitLabel}>Number of People:</Text>
                <View style={styles.equalSplitStepper}>
                  <TouchableOpacity
                    onPress={() => {
                      const newNum = Math.max(1, numPeople - 1);
                      handleSetEqualSplit(newNum);
                    }}
                    style={styles.stepperBtn}
                  >
                    <Minus size={16} color={ThemeColors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{numPeople}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newNum = numPeople + 1;
                      handleSetEqualSplit(newNum);
                    }}
                    style={styles.stepperBtn}
                  >
                    <Plus size={16} color={ThemeColors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {splitMode === "item" && (
              <View style={styles.itemSplitContainer}>
                <View style={styles.itemPeopleControls}>
                  <Text style={styles.equalSplitLabel}>People:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {itemPeople.map((p) => (
                      <View key={p.id} style={styles.personBadge}>
                        <Text style={styles.personBadgeText}>{p.name}</Text>
                        {itemPeople.length > 2 && (
                          <TouchableOpacity
                            onPress={() => {
                              const newPeople = itemPeople.filter(
                                (x) => x.id !== p.id,
                              );
                              setItemPeople(newPeople);
                              const newAssignments = { ...itemAssignments };
                              Object.keys(newAssignments).forEach((k) => {
                                const current = Array.isArray(newAssignments[k])
                                  ? newAssignments[k]
                                  : newAssignments[k]
                                    ? [newAssignments[k]]
                                    : [];
                                newAssignments[k] = current.filter(
                                  (id) => id !== p.id,
                                );
                                if (newAssignments[k].length === 0)
                                  delete newAssignments[k];
                              });
                              setItemAssignments(newAssignments);
                              handleSetItemSplit(newAssignments, newPeople);
                            }}
                            style={{ marginLeft: 4 }}
                          >
                            <X size={12} color={ThemeColors.white} />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    <TouchableOpacity
                      onPress={() => {
                        const newId =
                          Math.max(...itemPeople.map((p) => p.id)) + 1;
                        const newPeople = [
                          ...itemPeople,
                          { id: newId, name: `P${newId}` },
                        ];
                        setItemPeople(newPeople);
                        handleSetItemSplit(itemAssignments, newPeople);
                      }}
                      style={styles.addPersonBtn}
                    >
                      <Plus size={14} color={ThemeColors.primary} />
                      <Text style={styles.addPersonBtnText}>Add</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                <ScrollView style={styles.itemList}>
                  {allItems.map((item) => {
                    let price =
                      item.product.pricing?.sellingPrice ||
                      item.product.price ||
                      0;
                    if (item.variant) price = item.variant.price;
                    if (item.addons)
                      item.addons.forEach((a) => {
                        if (a && a.price) price += a.price;
                      });
                    const itemTotal = price * item.quantity;

                    return (
                      <View key={item.id} style={styles.itemRow}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={styles.itemName}>
                            {item.product.name} (x{item.quantity})
                          </Text>
                          <Text style={styles.itemPrice}>
                            ₹{itemTotal.toFixed(2)}
                          </Text>
                        </View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.itemAssignorsScroll}
                        >
                          <View style={styles.itemAssignors}>
                            {itemPeople.map((p) => {
                              const rawAssigned = itemAssignments[item.id];
                              const currentAssigned = Array.isArray(rawAssigned)
                                ? rawAssigned
                                : rawAssigned
                                  ? [rawAssigned]
                                  : [];
                              const isAssigned = currentAssigned.includes(p.id);
                              return (
                                <TouchableOpacity
                                  key={p.id}
                                  style={[
                                    styles.assignorBtn,
                                    isAssigned && styles.assignorBtnActive,
                                  ]}
                                  onPress={() => {
                                    const newAssignments = {
                                      ...itemAssignments,
                                    };
                                    let current = Array.isArray(
                                      newAssignments[item.id],
                                    )
                                      ? newAssignments[item.id]
                                      : newAssignments[item.id]
                                        ? [newAssignments[item.id]]
                                        : [];
                                    if (current.includes(p.id)) {
                                      current = current.filter(
                                        (id) => id !== p.id,
                                      );
                                    } else {
                                      current = [...current, p.id];
                                    }
                                    if (current.length > 0) {
                                      newAssignments[item.id] = current;
                                    } else {
                                      delete newAssignments[item.id];
                                    }
                                    setItemAssignments(newAssignments);
                                    handleSetItemSplit(
                                      newAssignments,
                                      itemPeople,
                                    );
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.assignorBtnText,
                                      isAssigned &&
                                        styles.assignorBtnTextActive,
                                    ]}
                                  >
                                    {p.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </ScrollView>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Total Amount Due</Text>
              <Text weight="bold" style={styles.summaryTotal}>
                ₹{totals.grandTotal.toFixed(2)}
              </Text>
            </View>

            <ScrollView style={styles.methodsList}>
              {paymentMethods.map((pm, index) => (
                <View key={index} style={styles.methodRow}>
                  {splitMode !== "custom" && (
                    <View style={styles.methodPersonLabel}>
                      <User size={16} color={ThemeColors.textSecondary} />
                      <Text style={styles.methodPersonText}>
                        {splitMode === "item"
                          ? itemPeople[index]?.name || `Person ${index + 1}`
                          : `Person ${index + 1}`}
                      </Text>
                    </View>
                  )}
                  <View style={styles.methodSelectors}>
                    {methods.map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.methodSelectorBtn,
                          pm.method === m && styles.methodSelectorBtnActive,
                        ]}
                        onPress={() => handleUpdateMethod(index, m)}
                      >
                        <Text
                          style={[
                            styles.methodSelectorText,
                            pm.method === m && styles.methodSelectorTextActive,
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View
                    style={[
                      styles.amountInputContainer,
                      splitMode !== "custom" && {
                        backgroundColor: ThemeColors.surface,
                      },
                    ]}
                  >
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={pm.amount}
                      onChangeText={(val) => handleUpdateAmount(index, val)}
                      keyboardType="numeric"
                      placeholder="0.00"
                      editable={splitMode === "custom"}
                    />
                  </View>
                  {splitMode === "custom" && paymentMethods.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveMethod(index)}
                      style={styles.removeBtn}
                    >
                      <X size={20} color={ThemeColors.red} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {splitMode === "custom" && (
                <TouchableOpacity
                  style={styles.addSplitBtn}
                  onPress={handleAddMethod}
                >
                  <Text weight="semibold" style={styles.addSplitBtnText}>
                    + Add Split
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Remaining Balance:</Text>
              <Text
                weight="bold"
                style={[
                  styles.balanceValue,
                  remaining > 0
                    ? { color: ThemeColors.red }
                    : remaining < 0
                      ? { color: ThemeColors.emerald }
                      : { color: ThemeColors.textPrimary },
                ]}
              >
                ₹{remaining.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={handlePrintInvoice}
            >
              <Text weight="bold" style={styles.completeBtnText}>
                {checkoutAction === "pay" ? "Save & Pay" : "Print Invoice"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.md,
  },
  container: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 8,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  modeTab: {
    flex: 1,
    paddingVertical: ThemeSpacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  modeTabActive: {
    borderBottomColor: ThemeColors.primary,
  },
  modeTabText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  modeTabTextActive: {
    color: ThemeColors.primary,
    fontWeight: "bold",
  },
  content: {
    padding: ThemeSpacing.xl,
  },
  equalSplitControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    marginBottom: ThemeSpacing.lg,
  },
  customerFields: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.lg,
  },
  customerTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 8,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    backgroundColor: ThemeColors.bg,
  },
  equalSplitLabel: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  equalSplitStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  stepperBtn: {
    padding: 8,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  itemSplitContainer: {
    marginBottom: ThemeSpacing.lg,
  },
  itemPeopleControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
    gap: ThemeSpacing.sm,
  },
  personBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    marginRight: ThemeSpacing.sm,
  },
  personBadgeText: {
    color: ThemeColors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  addPersonBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.primary,
  },
  addPersonBtnText: {
    color: ThemeColors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  itemList: {
    maxHeight: 250,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ThemeSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  itemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  itemAssignorsScroll: {
    flexGrow: 0,
    maxWidth: 200,
  },
  itemAssignors: {
    flexDirection: "row",
    gap: 6,
  },
  assignorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.surface,
  },
  assignorBtnActive: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  assignorBtnText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: "600",
  },
  assignorBtnTextActive: {
    color: ThemeColors.white,
  },
  methodPersonLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 80,
  },
  methodPersonText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  summaryBox: {
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
  },
  summaryLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 32,
    color: ThemeColors.emerald,
  },
  methodsList: {
    maxHeight: 300,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
    gap: ThemeSpacing.sm,
  },
  methodSelectors: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.sm,
    padding: 4,
  },
  methodSelectorBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: ThemeRadius.sm,
  },
  methodSelectorBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodSelectorText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  methodSelectorTextActive: {
    color: ThemeColors.textPrimary,
    fontWeight: "600",
  },
  amountInputContainer: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
  },
  currencySymbol: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  removeBtn: {
    padding: 8,
  },
  addSplitBtn: {
    alignSelf: "flex-start",
    marginTop: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.lg,
  },
  addSplitBtnText: {
    color: ThemeColors.emerald,
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  balanceLabel: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
  },
  balanceValue: {
    fontSize: 20,
  },
  footer: {
    padding: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  completeBtn: {
    backgroundColor: ThemeColors.emerald,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  completeBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
});
