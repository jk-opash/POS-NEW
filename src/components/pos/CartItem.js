import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Minus, Plus, Trash2, User } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function CartItem({
  item,
  isLocked,
  onUpdateQuantity,
  onVoidItem,
  onVoidLockedItem,
  onDecreaseLockedItem,
  onAssignStaff,
  onPress,
  index,
}) {
  let basePrice = Number(item.product.pricing?.sellingPrice || item.product.price || item.product.base_price || 0);
  if (item.variant) {
    basePrice = Number(item.variant.price) || 0;
  }
  let addonsPrice = 0;
  if (item.addons && item.addons.length > 0) {
    item.addons.forEach((a) => {
      if (a && a.price) addonsPrice += Number(a.price);
    });
  }

  const price = basePrice + addonsPrice;
  const itemTotal = price * item.quantity;

  return (
    <TouchableOpacity
      style={styles.cartItem}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(item)}
      disabled={isLocked && !onPress}
    >
      <View style={styles.cartItemRow}>
        {(!isLocked || onVoidLockedItem) && (
          <TouchableOpacity
            onPress={() => isLocked ? onVoidLockedItem(item) : onVoidItem(item.id)}
            style={styles.deleteBtn}
          >
            <Trash2 size={16} color={ThemeColors.red} />
          </TouchableOpacity>
        )}

        <View style={styles.cartItemInfo}>
          <Text weight="bold" style={styles.cartItemName} numberOfLines={1}>
            {item.product.name} {item.variant ? `(${item.variant.name})` : ""}
          </Text>
          {(item.addons?.length > 0 || item.spiceLevel) && (
            <Text
              style={{
                fontSize: 11,
                color: ThemeColors.textSecondary,
                marginBottom: 2,
              }}
            >
              {[
                item.spiceLevel?.name ? `Spice: ${item.spiceLevel.name}` : null,
                ...(item.addons || []).map((a) => a.name)
              ].filter(Boolean).join(", ")}
            </Text>
          )}
          {item.note && <Text style={styles.itemNote}>Note: {item.note}</Text>}
        </View>

        {(!isLocked || onDecreaseLockedItem) && (
          <View style={styles.cartItemControls}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                isLocked
                  ? onDecreaseLockedItem(item)
                  : onUpdateQuantity(item.id, item.quantity - 1)
              }
            >
              <Minus size={14} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
            <Text weight="bold" style={styles.qtyText}>
              {item.quantity}
            </Text>
            {isLocked ? (
              <View style={[styles.qtyBtn, { opacity: 0.3 }]}>
                <Plus size={14} color={ThemeColors.textPrimary} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={14} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.cartItemTotal}>
          <Text weight="bold" style={styles.cartItemTotalText}>
            ₹{itemTotal.toFixed(2)}
          </Text>
          <Text style={styles.cartItemPrice}>
            ₹{price.toFixed(2)} x {item.quantity}
          </Text>
        </View>
      </View>

      {/* Optional: Service Employee Assignment */}
      {item.product.type === "Service" && (
        <TouchableOpacity
          style={styles.assignStaffBtn}
          onPress={() => onAssignStaff(item.id)}
          disabled={isLocked}
        >
          <User
            size={12}
            color={
              item.employee ? ThemeColors.emerald : ThemeColors.textSecondary
            }
          />
          <Text
            style={[
              styles.assignStaffText,
              item.employee && { color: ThemeColors.emerald },
            ]}
          >
            {item.employee
              ? `Assigned: ${item.employee.firstName}`
              : "Assign Staff"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    paddingVertical: ThemeSpacing.sm,
    backgroundColor: ThemeColors.surface,
    gap: ThemeSpacing.sm,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.sm,
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
    fontWeight: "600",
  },
  itemNote: {
    fontSize: 11,
    color: ThemeColors.emerald,
    fontStyle: "italic",
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  cartItemTotal: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
    minWidth: 60,
  },
  cartItemTotalText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  deleteBtn: {
    padding: 4,
  },
  assignStaffBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  assignStaffText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
});
