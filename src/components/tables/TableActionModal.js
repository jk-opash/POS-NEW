import { Text } from "@/components/ui/Text";
import { useMenu } from "@/context/MenuContext";

import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  Ban,
  CalendarDays,
  Clock,
  CreditCard,
  Edit3,
  Printer,
  Split,
  Trash2,
  Utensils,
  X,
} from "lucide-react-native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { showAlert } from "@/utils/alert";
import QRCode from "react-native-qrcode-svg";

export function TableActionModal({
  visible,
  table,
  onClose,
  onUpdateStatus,
  onTakeOrder,
  onCheckout,
  onCancelOrder,
  onUnmerge,
}) {

  const { menuItems } = useMenu();
  if (!table) return null;

  const isAvailable = table.status === "Available";
  const isOccupied = table.status === "Occupied";
  const isReserved = table.status === "Reserved";

  const hasOrder =
    table.order &&
    (Array.isArray(table.order)
      ? table.order.length > 0
      : Object.keys(table.order).length > 0);

  const handleTakeOrder = () => {
    onClose();
    if (onTakeOrder) {
      onTakeOrder(table);
    }
  };

  const handleCancelOrder = () => {
    onClose();
    if (onCancelOrder) {
      onCancelOrder(table.id);
    }
  };

  const handleCheckout = () => {
    onClose();
    if (onCheckout) {
      onCheckout(table.id);
    }
  };

  const handlePrintBill = async () => {
    onUpdateStatus(table.id, "Occupied"); // Keeps occupied or update to some billed state
    await printReceipt({
      type: "bill",
      table: table.name,
      items: orderItemsList,
      total: totalAmount,
    });
    onClose();
  };

  // Calculate order items for display
  const orderItemsList = [];
  let totalAmount = 0;

  const allAvailableItems = [...(menuItems || [])];

  if (hasOrder) {
    if (Array.isArray(table.order)) {
      table.order.forEach((item) => {
        if (item.quantity > 0) {
          const product = allAvailableItems.find(
            (p) => p.id === item.productId,
          );
          if (product) {
            const price = product.pricing?.sellingPrice || 0;
            totalAmount += price * item.quantity;
            orderItemsList.push({
              ...product,
              qty: item.quantity,
              price,
              note: item.note,
              addons: item.addons,
            });
          }
        }
      });
    } else {
      Object.entries(table.order).forEach(([productId, qty]) => {
        if (qty > 0) {
          const product = allAvailableItems.find((p) => p.id === productId);
          if (product) {
            const price = product.pricing?.sellingPrice || 0;
            totalAmount += price * qty;
            orderItemsList.push({ ...product, qty, price });
          }
        }
      });
    }
  }

  const getStatusColor = () => {
    if (isAvailable) return ThemeColors.emerald;
    if (isReserved) return ThemeColors.red;
    return ThemeColors.blue;
  };

  const statusColor = getStatusColor();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text weight="bold" style={styles.title}>
                  {table.name}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor + "20" },
                  ]}
                >
                  <Text
                    weight="bold"
                    style={[styles.statusBadgeText, { color: statusColor }]}
                  >
                    {table.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.subtitle}>
                Capacity: {table.capacity} Persons
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                marginRight: 16,
                flexDirection: "row",
                gap: 4,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: ThemeColors.blueDim,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: ThemeRadius.sm,
                  borderWidth: 1,
                  borderColor: ThemeColors.blue,
                }}
                onPress={() => {
                  showAlert("Print QR", "QR code printed successfully!");
                }}
              >
                <Printer size={14} color={ThemeColors.blue} />
                <Text
                  weight="semibold"
                  style={{ fontSize: 12, color: ThemeColors.blue }}
                >
                  Print QR
                </Text>
              </TouchableOpacity>
              <View
                style={{ backgroundColor: "#fff", padding: 4, borderRadius: 8 }}
              >
                <QRCode
                  value={`https://demo.pos.com/order/${table.id}`}
                  size={100}
                />
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {hasOrder ? (
              <View style={styles.billSection}>
                <Text weight="bold" style={styles.billTitle}>
                  Current Order
                </Text>

                <ScrollView style={styles.billItemsScroll}>
                  {orderItemsList.map((item, idx) => (
                    <View key={idx} style={styles.billItemRowContainer}>
                      <View style={styles.billItemRow}>
                        <Text style={styles.billItemQty}>{item.qty}×</Text>
                        <Text style={styles.billItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text weight="semibold" style={styles.billItemPrice}>
                          ₹{(item.price * item.qty).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.billTotalRow}>
                  <Text weight="semibold" style={styles.billTotalLabel}>
                    Total Amount
                  </Text>
                  <Text weight="bold" style={styles.billTotalValue}>
                    ₹{totalAmount.toFixed(2)}
                  </Text>
                </View>

                {/* Primary Action */}
                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: ThemeSpacing.lg }]}
                  onPress={handleCheckout}
                >
                  <CreditCard size={20} color={ThemeColors.white} />
                  <Text weight="bold" style={styles.primaryBtnText}>
                    Settle & Clear Table
                  </Text>
                </TouchableOpacity>

                {/* Secondary Actions Row */}
                <View style={styles.orderActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.secondaryBtn,
                      { flex: 1, backgroundColor: ThemeColors.blueDim },
                    ]}
                    onPress={handlePrintBill}
                  >
                    <Printer size={18} color={ThemeColors.blue} />
                    <Text
                      weight="semibold"
                      style={[
                        styles.secondaryBtnText,
                        { color: ThemeColors.blue },
                      ]}
                    >
                      Print Bill
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.secondaryBtn,
                      {
                        flex: 1,
                        backgroundColor: ThemeColors.bg,
                        borderWidth: 1,
                        borderColor: ThemeColors.border,
                      },
                    ]}
                    onPress={handleTakeOrder}
                  >
                    <Edit3 size={18} color={ThemeColors.textPrimary} />
                    <Text
                      weight="semibold"
                      style={[
                        styles.secondaryBtnText,
                        { color: ThemeColors.textPrimary },
                      ]}
                    >
                      Edit Items
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Destructive Action */}
                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    {
                      marginTop: ThemeSpacing.md,
                      backgroundColor: "transparent",
                      borderColor: ThemeColors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleCancelOrder}
                >
                  <Ban size={18} color={ThemeColors.red} />
                  <Text
                    weight="semibold"
                    style={[
                      styles.secondaryBtnText,
                      { color: ThemeColors.red },
                    ]}
                  >
                    Cancel Order
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noOrderSection}>
                {/* Available Status Logic */}
                {isAvailable && (
                  <View style={styles.statusGrid}>
                    <TouchableOpacity
                      style={[
                        styles.primaryBtn,
                        {
                          flex: 1,
                        },
                      ]}
                      onPress={handleTakeOrder}
                      activeOpacity={0.8}
                    >
                      <Utensils size={20} color={ThemeColors.white} />
                      <Text
                        weight="bold"
                        style={styles.primaryBtnText}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        Take Order
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          flex: 1,
                          backgroundColor: ThemeColors.blueDim,
                          borderColor: ThemeColors.blue,
                        },
                      ]}
                      onPress={() => {
                        onUpdateStatus(table.id, "Occupied");
                        onClose();
                      }}
                    >
                      <CalendarDays size={18} color={ThemeColors.blue} />
                      <Text
                        style={[
                          styles.statusBtnText,
                          { color: ThemeColors.blue },
                        ]}
                        adjustsFontSizeToFit
                        numberOfLines={2}
                      >
                        Mark Occupied
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Reserved Status Logic */}
                {isReserved && (
                  <>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={handleTakeOrder}
                      activeOpacity={0.8}
                    >
                      <Utensils size={20} color={ThemeColors.white} />
                      <Text
                        weight="bold"
                        style={styles.primaryBtnText}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        Guest Arrived - Take Order
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          backgroundColor: ThemeColors.blueDim,
                          borderColor: ThemeColors.blue,
                        },
                      ]}
                      onPress={() => {
                        onUpdateStatus(table.id, "Occupied");
                        onClose();
                      }}
                    >
                      <Clock size={18} color={ThemeColors.blue} />
                      <Text
                        style={[
                          styles.statusBtnText,
                          { color: ThemeColors.blue },
                        ]}
                        adjustsFontSizeToFit
                        numberOfLines={2}
                      >
                        Guest Arrived{"\n"}(No Order)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          backgroundColor: ThemeColors.redDim,
                          borderColor: ThemeColors.red,
                        },
                      ]}
                      onPress={() => {
                        onUpdateStatus(table.id, "Available");
                        onClose();
                      }}
                    >
                      <Trash2 size={18} color={ThemeColors.red} />
                      <Text
                        style={[
                          styles.statusBtnText,
                          { color: ThemeColors.red },
                        ]}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        Cancel Reservation
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Occupied (No Order) Logic */}
                {isOccupied && !hasOrder && (
                  <View style={styles.statusGrid}>
                    <TouchableOpacity
                      style={[styles.primaryBtn, { flex: 1 }]}
                      onPress={handleTakeOrder}
                      activeOpacity={0.8}
                    >
                      <Utensils size={20} color={ThemeColors.white} />
                      <Text
                        weight="bold"
                        style={styles.primaryBtnText}
                        adjustsFontSizeToFit
                      >
                        Take Order
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        {
                          flex: 1,
                          backgroundColor: ThemeColors.bg,
                          borderColor: ThemeColors.border,
                        },
                      ]}
                      onPress={() => {
                        onUpdateStatus(table.id, "Available");
                        onClose();
                      }}
                    >
                      <Ban size={18} color={ThemeColors.textSecondary} />
                      <Text
                        style={[
                          styles.statusBtnText,
                          { color: ThemeColors.textSecondary },
                        ]}
                      >
                        Clear Table
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Unmerge Table Option */}
            {table.originalTables && table.originalTables.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  {
                    marginTop: ThemeSpacing.md,
                    backgroundColor: ThemeColors.redDim,
                    borderColor: ThemeColors.red,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  if (onUnmerge) {
                    onUnmerge(table.id);
                  }
                }}
              >
                <Split size={18} color={ThemeColors.red} />
                <Text
                  weight="semibold"
                  style={[styles.secondaryBtnText, { color: ThemeColors.red }]}
                >
                  Unmerge Table
                </Text>
              </TouchableOpacity>
            )}
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
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ThemeRadius.full,
  },
  statusBadgeText: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: ThemeSpacing.xl,
  },
  noOrderSection: {
    gap: ThemeSpacing.xl,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.emerald,
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    gap: 8,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },

  /* Bill Section Styles */
  billSection: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
  },
  billTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
  },
  billItemsScroll: {
    maxHeight: 200,
  },
  billItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  billItemQty: {
    width: 30,
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontWeight: "bold",
  },
  billItemName: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  billItemPrice: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  billTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeSpacing.md,
    marginTop: ThemeSpacing.xs,
    borderTopWidth: 2,
    borderTopColor: ThemeColors.border,
  },
  billTotalLabel: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  billTotalValue: {
    fontSize: 20,
    color: ThemeColors.emerald,
  },
  orderActionsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    marginTop: ThemeSpacing.md,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: ThemeRadius.sm,
    gap: ThemeSpacing.sm,
  },
  secondaryBtnText: {
    fontSize: 14,
  },
  statusGrid: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  statusBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    gap: 8,
  },
  statusBtnText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
});
