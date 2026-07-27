import { Text } from "@/components/ui/Text";
import { MENU_STATUS } from "@/constants/menu";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Edit2, Trash2 } from "lucide-react-native";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { showAlert } from "@/utils/alert";

export function MenuItemCard({
  menuItem,
  onPress,
  onEdit,
  onToggleStatus,
  isList,
}) {
  const price = menuItem.pricing?.sellingPrice || 0;

  let typeColor = ThemeColors.border;
  const isDessert =
    menuItem.category === "Desserts" || menuItem.station === "Desserts";
  const isDrink =
    menuItem.category?.includes("Beverage") ||
    menuItem.category === "Bar / Beverages" ||
    menuItem.station === "Beverage";

  if (menuItem.foodType === "Dessert" || isDessert) {
    typeColor = ThemeColors.blue;
  } else if (menuItem.foodType === "Beverage" || isDrink) {
    typeColor = ThemeColors.violet;
  } else if (menuItem.foodType === "Veg") {
    typeColor = ThemeColors.veg;
  } else if (menuItem.foodType === "Non-Veg") {
    typeColor = ThemeColors.nonVeg;
  } else if (menuItem.foodType === "Egg") {
    typeColor = ThemeColors.egg;
  } else if (menuItem.foodType === "Vegan") {
    typeColor = ThemeColors.vegan;
  } else if (menuItem.foodType === "Jain") {
    typeColor = ThemeColors.jain;
  }

  const isInactive = menuItem.status === MENU_STATUS.INACTIVE;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderTopWidth: 4,
          borderTopColor:
            typeColor !== ThemeColors.border ? typeColor : ThemeColors.primary,
        },
        isInactive && styles.cardInactive,
        isList && styles.cardList,
      ]}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(menuItem)}
    >
      <View style={[styles.content, isList && styles.contentList]}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Text weight="bold" style={styles.name} numberOfLines={2}>
              {menuItem.name}
            </Text>
            {/* <Text style={styles.category} numberOfLines={1}>
              {menuItem.category}
            </Text> */}
          </View>
          <Text weight="black" style={styles.price}>
            ₹{price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.statusPill}
            onPress={(e) => {
              e.stopPropagation();
              onToggleStatus && onToggleStatus(menuItem);
            }}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: !isInactive
                    ? ThemeColors.emerald
                    : ThemeColors.textSecondary,
                },
              ]}
            />
            <Text
              weight="bold"
              style={[
                styles.statusText,
                {
                  color: !isInactive
                    ? ThemeColors.emerald
                    : ThemeColors.textSecondary,
                },
              ]}
            >
              {!isInactive ? "ACTIVE" : "INACTIVE"}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={(e) => {
                e.stopPropagation();
                if (Platform.OS === "web") {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this menu item?",
                    )
                  ) {
                    menuItem.onDelete && menuItem.onDelete(menuItem.id);
                  }
                } else {
                  showAlert(
                    "Delete Menu Item",
                    "Are you sure you want to delete this item?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        onPress: () =>
                          menuItem.onDelete && menuItem.onDelete(menuItem.id),
                        style: "destructive",
                      },
                    ],
                  );
                }
              }}
            >
              <Trash2 size={18} color={ThemeColors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={(e) => {
                e.stopPropagation();
                onEdit && onEdit(menuItem);
              }}
            >
              <Edit2 size={18} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 110,
    overflow: "hidden",
  },
  cardInactive: {
    opacity: 0.6,
    backgroundColor: ThemeColors.bg,
  },
  cardList: {
    flexDirection: "row",
    minHeight: 80,
  },
  content: {
    flex: 1,
    padding: ThemeSpacing.lg,
    justifyContent: "space-between",
  },
  contentList: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  titleWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  price: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    padding: 8,
  },
});
