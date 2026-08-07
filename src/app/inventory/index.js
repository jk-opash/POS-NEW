import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { InventoryActionModal } from "@/components/inventory/InventoryActionModal";
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { InventoryFab } from "@/components/inventory/InventoryFab";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryItemModal } from "@/components/inventory/InventoryItemModal";
import { InventorySummaryCards } from "@/components/inventory/InventorySummaryCards";
import { fetchInventoryItems } from "@/store/slices/inventorySlice";

export default function InventoryPage() {
  const { isWebDesktop } = useResponsive();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { branches, activeBranch } = useSelector((state) => state.branch);
  const { items: inventoryItems, isLoading } = useSelector(
    (state) => state.inventory,
  );

  const currentBranchObj = branches?.find((b) => b.id === activeBranch) || branches?.[0];

  const [activeTab, setActiveTab] = useState("stock");
  const [activeLocation, setActiveLocation] = useState(
    currentBranchObj?.name || "All",
  );
  const [isWizardVisible, setIsWizardVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  useEffect(() => {
    if (activeBranch) {
      dispatch(fetchInventoryItems(activeBranch));
    }
  }, [activeBranch, dispatch]);

  const handleFabPress = () => {
    if (activeTab === "stock") {
      setEditingItem(null);
      setIsWizardVisible(true);
    } else {
      setIsActionModalVisible(true);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsWizardVisible(true);
  };

  const metrics = useMemo(() => {
    let totalItems = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let quarantineCount = 0; // Not tracked in backend yet
    let totalValue = 0;

    (inventoryItems || []).forEach((item) => {
      totalItems += 1;
      const stock = parseFloat(item.in_stock) || 0;
      const price = parseFloat(item.price) || 0;
      const reorderLevel = parseFloat(item.reorder_level) || 0;

      totalValue += stock * price;

      if (stock === 0) {
        outOfStockCount += 1;
      } else if (stock <= reorderLevel) {
        lowStockCount += 1;
      }
    });

    return { totalItems, lowStockCount, outOfStockCount, quarantineCount, totalValue };
  }, [inventoryItems]);

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.root}>
      <InventoryHeader
        isDesktop={isWebDesktop}
        navigation={navigation}
        dateString={dateString}
        branches={branches}
        activeLocation={activeLocation}
        setActiveLocation={setActiveLocation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InventorySummaryCards metrics={metrics} />
        <View style={styles.contentSection}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={ThemeColors.primary}
              style={{ marginTop: 40 }}
            />
          ) : (
            <InventoryContent
              activeTab={activeTab}
              onEditItem={handleEditItem}
            />
          )}
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
      <InventoryFab activeTab={activeTab} onPress={handleFabPress} />

      <InventoryItemModal
        visible={isWizardVisible}
        onClose={() => {
          setIsWizardVisible(false);
          setEditingItem(null);
        }}
        branchId={activeBranch}
        initialData={editingItem}
      />
      <InventoryActionModal
        visible={isActionModalVisible}
        onClose={() => setIsActionModalVisible(false)}
        type={activeTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  scrollContent: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.lg,
  },
  contentSection: { minHeight: 400 },
  bottomPad: { height: 100 },
});
