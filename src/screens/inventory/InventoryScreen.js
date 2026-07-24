import { useInventoryContext } from "@/context/InventoryContext";
import { useBranches } from "@/context/BranchesContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { InventoryActionModal } from "@/components/inventory/InventoryActionModal";
import { InventoryItemModal } from "@/components/inventory/InventoryItemModal";

import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventorySummaryCards } from "@/components/inventory/InventorySummaryCards";
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { InventoryFab } from "@/components/inventory/InventoryFab";

export default function InventoryScreen() {
  const { isDesktop , isWebDesktop } = useResponsive();
  const { metrics, activeLocation, setActiveLocation } = useInventoryContext();
  const { branches } = useBranches();
  const [activeTab, setActiveTab] = useState("stock");

  useEffect(() => {
    if (activeLocation === 'All' && branches.length > 0) {
      setActiveLocation(branches[0].name);
    }
  }, [activeLocation, branches, setActiveLocation]);

  const [isWizardVisible, setIsWizardVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleFabPress = () => {
    if (activeTab === "stock") {
      setIsWizardVisible(true);
    } else {
      setIsActionModalVisible(true);
    }
  };

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
          <InventoryContent activeTab={activeTab} />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      <InventoryFab activeTab={activeTab} onPress={handleFabPress} />

      {/* Modals */}
      <InventoryItemModal
        visible={isWizardVisible}
        onClose={() => setIsWizardVisible(false)}
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
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  scrollContent: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.lg,
  },
  contentSection: {
    minHeight: 400,
  },
  bottomPad: { height: 100 },
});
