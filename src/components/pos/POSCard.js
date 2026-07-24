import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function POSCard({ product, inCart, onAddToCart }) {
  const price = product.pricing?.sellingPrice || 0;

  let typeColor = ThemeColors.border;

  const isDessert =
    product.category === "Desserts" || product.station === "Desserts";
  const isDrink =
    product.category?.includes("Beverage") ||
    product.category === "Bar / Beverages" ||
    product.station === "Beverage";

  if (product.foodType === "Dessert" || isDessert) {
    typeColor = ThemeColors.blue;
  } else if (product.foodType === "Beverage" || isDrink) {
    typeColor = ThemeColors.violet;
  } else if (product.foodType === "Veg") {
    typeColor = ThemeColors.veg;
  } else if (product.foodType === "Non-Veg") {
    typeColor = ThemeColors.nonVeg;
  } else if (product.foodType === "Egg") {
    typeColor = ThemeColors.egg;
  } else if (product.foodType === "Vegan") {
    typeColor = ThemeColors.vegan;
  } else if (product.foodType === "Jain") {
    typeColor = ThemeColors.jain;
  }

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        {
          borderTopColor:
            typeColor !== ThemeColors.border ? typeColor : ThemeColors.primary,
        },
        inCart && styles.productCardSelected,
      ]}
      onPress={() => onAddToCart(product)}
      activeOpacity={0.6}
    >
      {/* Selection Overlay Indicator */}
      {inCart && (
        <View style={styles.selectedOverlay}>
          <Text style={styles.selectedText}>✓ Added</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          weight="black"
          style={styles.productName}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {product.name}
        </Text>

        {/* <Text weight="bold" style={styles.productPrice}>
          ₹{price.toFixed(2)}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderTopWidth: 6, // Thick color bar at the top for instant visual recognition
    borderColor: ThemeColors.border,
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  productCardSelected: {
    borderColor: ThemeColors.emerald,
    borderTopColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emerald + "0A",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 2,
    alignItems: "center",
    zIndex: 10,
  },
  selectedText: {
    color: ThemeColors.white,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: ThemeSpacing.xs,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  productName: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
    textAlign: "center",
  },
});
