import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Beaker, ChevronRight, Menu, Plus, Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_RECIPES = [
  { id: "R-001", menuItem: "Paneer Butter Masala", category: "Main Course", foodCost: 100, sellingPrice: 300, margin: 66.7, ingredients: [
    { name: "Paneer", qty: "200g", cost: 40 }, { name: "Tomato Puree", qty: "150ml", cost: 15 },
    { name: "Cream", qty: "50ml", cost: 20 }, { name: "Butter", qty: "30g", cost: 12 },
    { name: "Spices Mix", qty: "10g", cost: 8 }, { name: "Kasuri Methi", qty: "2g", cost: 5 },
  ]},
  { id: "R-002", menuItem: "Butter Chicken", category: "Main Course", foodCost: 130, sellingPrice: 350, margin: 62.9, ingredients: [
    { name: "Chicken", qty: "250g", cost: 55 }, { name: "Tomato Puree", qty: "200ml", cost: 20 },
    { name: "Cream", qty: "60ml", cost: 25 }, { name: "Butter", qty: "40g", cost: 16 },
    { name: "Yogurt", qty: "50g", cost: 8 }, { name: "Spices Mix", qty: "15g", cost: 6 },
  ]},
  { id: "R-003", menuItem: "Chicken Biryani", category: "Biryani & Rice", foodCost: 120, sellingPrice: 350, margin: 65.7, ingredients: [
    { name: "Chicken", qty: "250g", cost: 55 }, { name: "Basmati Rice", qty: "200g", cost: 25 },
    { name: "Onion", qty: "100g", cost: 8 }, { name: "Saffron", qty: "0.2g", cost: 15 },
    { name: "Ghee", qty: "30ml", cost: 12 }, { name: "Spices", qty: "10g", cost: 5 },
  ]},
  { id: "R-004", menuItem: "Dal Makhani", category: "Main Course", foodCost: 70, sellingPrice: 260, margin: 73.1, ingredients: [
    { name: "Black Urad Dal", qty: "150g", cost: 18 }, { name: "Rajma", qty: "50g", cost: 8 },
    { name: "Cream", qty: "40ml", cost: 18 }, { name: "Butter", qty: "30g", cost: 12 },
    { name: "Tomato", qty: "100g", cost: 8 }, { name: "Spices", qty: "8g", cost: 6 },
  ]},
  { id: "R-005", menuItem: "Masala Dosa", category: "South Indian", foodCost: 40, sellingPrice: 150, margin: 73.3, ingredients: [
    { name: "Dosa Batter", qty: "150ml", cost: 10 }, { name: "Potato", qty: "150g", cost: 8 },
    { name: "Onion", qty: "50g", cost: 4 }, { name: "Mustard Seeds", qty: "5g", cost: 2 },
    { name: "Sambar", qty: "100ml", cost: 10 }, { name: "Chutney", qty: "50ml", cost: 6 },
  ]},
  { id: "R-006", menuItem: "Gulab Jamun (2 Pcs)", category: "Desserts", foodCost: 25, sellingPrice: 100, margin: 75.0, ingredients: [
    { name: "Khoya", qty: "80g", cost: 14 }, { name: "Sugar", qty: "60g", cost: 4 },
    { name: "Cardamom", qty: "1g", cost: 3 }, { name: "Rose Water", qty: "5ml", cost: 2 },
    { name: "Oil (frying)", qty: "20ml", cost: 2 },
  ]},
];

export default function RecipesPage() {
  const navigation = useNavigation();
  const { isDesktop, isWebDesktop } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filtered = MOCK_RECIPES.filter((r) => r.menuItem.toLowerCase().includes(searchQuery.toLowerCase()));
  const avgMargin = (MOCK_RECIPES.reduce((s, r) => s + r.margin, 0) / MOCK_RECIPES.length).toFixed(1);
  const avgFoodCost = Math.round(MOCK_RECIPES.reduce((s, r) => s + r.foodCost, 0) / MOCK_RECIPES.length);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Beaker size={22} color={ThemeColors.accent} />
            <Text weight="bold" style={styles.pageTitle}>Recipe & Costing</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={16} color={ThemeColors.white} />
            <Text weight="semibold" style={styles.addBtnText}>Add Recipe</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statLabel}>Total Recipes</Text><Text weight="bold" style={styles.statValue}>{MOCK_RECIPES.length}</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Avg Food Cost</Text><Text weight="bold" style={styles.statValue}>₹{avgFoodCost}</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Avg Margin</Text><Text weight="bold" style={[styles.statValue, { color: ThemeColors.emerald }]}>{avgMargin}%</Text></View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={ThemeColors.textMuted} />
          <TextInput placeholder="Search recipes..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} placeholderTextColor={ThemeColors.textMuted} />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.recipeList} showsVerticalScrollIndicator={false}>
          {filtered.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={[styles.recipeCard, selectedRecipe?.id === recipe.id && styles.recipeCardSelected]} onPress={() => setSelectedRecipe(recipe)}>
              <View style={styles.recipeHeader}>
                <View style={{ flex: 1 }}>
                  <Text weight="semibold" style={styles.recipeName}>{recipe.menuItem}</Text>
                  <Text style={styles.recipeCategory}>{recipe.category}</Text>
                </View>
                <ChevronRight size={16} color={ThemeColors.textMuted} />
              </View>
              <View style={styles.recipeMetrics}>
                <View style={styles.metricBox}><Text style={styles.metricLabel}>Cost</Text><Text weight="semibold" style={styles.metricValue}>₹{recipe.foodCost}</Text></View>
                <View style={styles.metricBox}><Text style={styles.metricLabel}>Price</Text><Text weight="semibold" style={styles.metricValue}>₹{recipe.sellingPrice}</Text></View>
                <View style={[styles.metricBox, { backgroundColor: recipe.margin >= 70 ? ThemeColors.emeraldDim : recipe.margin >= 60 ? ThemeColors.amberDim : ThemeColors.redDim }]}>
                  <Text style={styles.metricLabel}>Margin</Text>
                  <Text weight="bold" style={[styles.metricValue, { color: recipe.margin >= 70 ? ThemeColors.emerald : recipe.margin >= 60 ? ThemeColors.amber : ThemeColors.red }]}>{recipe.margin}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isDesktop && selectedRecipe && (
          <View style={styles.detailPanel}>
            <Text weight="bold" style={styles.detailTitle}>{selectedRecipe.menuItem}</Text>
            <Text style={styles.detailCategory}>{selectedRecipe.category}</Text>
            <View style={styles.costBar}>
              <View style={[styles.costBarFill, { width: `${100 - selectedRecipe.margin}%` }]} />
              <View style={styles.costBarLabels}>
                <Text style={styles.costBarText}>Food Cost: ₹{selectedRecipe.foodCost}</Text>
                <Text style={styles.costBarText}>Margin: {selectedRecipe.margin}%</Text>
              </View>
            </View>
            <Text weight="semibold" style={styles.sectionTitle}>INGREDIENTS</Text>
            {selectedRecipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <Text style={styles.ingredientQty}>{ing.qty}</Text>
                <Text weight="semibold" style={styles.ingredientCost}>₹{ing.cost}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text weight="bold" style={styles.totalLabel}>Total Food Cost</Text>
              <Text weight="bold" style={styles.totalValue}>₹{selectedRecipe.foodCost}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  headerSafe: { backgroundColor: ThemeColors.surface, borderBottomWidth: 1, borderBottomColor: ThemeColors.border },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: ThemeSpacing.xxl, paddingVertical: ThemeSpacing.md },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md },
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 22, color: ThemeColors.textPrimary },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: ThemeColors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: ThemeRadius.md },
  addBtnText: { color: ThemeColors.white, fontSize: 13 },
  statsRow: { flexDirection: "row", paddingHorizontal: ThemeSpacing.lg, paddingVertical: ThemeSpacing.md, gap: ThemeSpacing.md },
  statCard: { flex: 1, backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, alignItems: "center", gap: 4, borderWidth: 1, borderColor: ThemeColors.border },
  statValue: { fontSize: 20, color: ThemeColors.textPrimary },
  statLabel: { fontSize: 11, color: ThemeColors.textMuted },
  searchRow: { paddingHorizontal: ThemeSpacing.lg, paddingBottom: ThemeSpacing.md },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.md, paddingHorizontal: ThemeSpacing.md, borderWidth: 1, borderColor: ThemeColors.border, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: ThemeColors.textPrimary },
  body: { flex: 1, flexDirection: "row" },
  recipeList: { flex: 1, paddingHorizontal: ThemeSpacing.lg },
  recipeCard: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.sm, borderWidth: 1, borderColor: ThemeColors.border, gap: ThemeSpacing.md },
  recipeCardSelected: { borderColor: ThemeColors.accent, borderWidth: 2 },
  recipeHeader: { flexDirection: "row", alignItems: "center" },
  recipeName: { fontSize: 15, color: ThemeColors.textPrimary },
  recipeCategory: { fontSize: 12, color: ThemeColors.textMuted, marginTop: 2 },
  recipeMetrics: { flexDirection: "row", gap: ThemeSpacing.sm },
  metricBox: { flex: 1, backgroundColor: ThemeColors.bg, borderRadius: ThemeRadius.sm, padding: ThemeSpacing.sm, alignItems: "center", gap: 2 },
  metricLabel: { fontSize: 10, color: ThemeColors.textMuted },
  metricValue: { fontSize: 14, color: ThemeColors.textPrimary },
  detailPanel: { width: 360, backgroundColor: ThemeColors.surface, borderLeftWidth: 1, borderLeftColor: ThemeColors.border, padding: ThemeSpacing.xl },
  detailTitle: { fontSize: 20, color: ThemeColors.textPrimary },
  detailCategory: { fontSize: 13, color: ThemeColors.textMuted, marginBottom: ThemeSpacing.xl },
  costBar: { height: 32, backgroundColor: ThemeColors.emeraldDim, borderRadius: ThemeRadius.sm, marginBottom: ThemeSpacing.xl, overflow: "hidden", justifyContent: "center" },
  costBarFill: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: ThemeColors.redDim, borderRadius: ThemeRadius.sm },
  costBarLabels: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 },
  costBarText: { fontSize: 11, color: ThemeColors.textSecondary },
  sectionTitle: { fontSize: 11, color: ThemeColors.textMuted, letterSpacing: 1, marginBottom: ThemeSpacing.md },
  ingredientRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: ThemeColors.borderSubtle },
  ingredientName: { flex: 1, fontSize: 14, color: ThemeColors.textPrimary },
  ingredientQty: { width: 60, fontSize: 13, color: ThemeColors.textMuted, textAlign: "center" },
  ingredientCost: { width: 50, fontSize: 14, color: ThemeColors.textPrimary, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: ThemeSpacing.md, borderTopWidth: 2, borderTopColor: ThemeColors.border, marginTop: ThemeSpacing.sm },
  totalLabel: { fontSize: 15, color: ThemeColors.textPrimary },
  totalValue: { fontSize: 15, color: ThemeColors.accent },
});
