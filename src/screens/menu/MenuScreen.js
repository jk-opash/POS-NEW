import { BulkActionModal } from "@/components/menu/BulkActionModal";
import { MenuEmptyState } from "@/components/menu/MenuEmptyState";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemWizardModal } from "@/components/menu/MenuItemWizardModal";
import { Text } from "@/components/ui/Text";
import { MENU_CATEGORIES, MENU_STATUS } from "@/constants/menu";
import { useMenu } from "@/context/MenuContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { CheckSquare, ChevronDown, ChevronUp, Plus } from "lucide-react-native";
import { useState } from "react";
import { Platform, SectionList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isWizardVisible, setIsWizardVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const initial = {};
    MENU_CATEGORIES.forEach((cat) => {
      initial[cat] = true;
    });
    return initial;
  });
  const { menuItems, deleteMenuItem, addMenuItem, updateMenuItem } = useMenu();

  const toggleSection = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const navigation = useNavigation();
  const { isDesktop, isTablet, isMiniTab, width, isWebDesktop } =
    useResponsive();

  const numColumns = isDesktop ? 5 : isTablet ? 4 : isMiniTab ? 3 : 2;
  const appSidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.md * 2;
  const totalGap = ThemeSpacing.sm * (numColumns - 1);
  const scrollbarW = Platform.OS === "web" ? 20 : 0;
  const availableWidth = width - appSidebarW - listPadding - totalGap - scrollbarW;
  const cardWidth = Math.floor(availableWidth / numColumns);

  const filteredMenu = menuItems
    .filter((p) => {
      if (searchQuery) {
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.barcode &&
            p.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      if (activeFilter !== "All" && p.category !== activeFilter) return false;
      return true;
    })
    .map((p) => ({
      ...p,
      onDelete: deleteMenuItem,
    }));

  const grouped = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sections = Object.keys(grouped)
    .sort()
    .map((category) => {
      const items = grouped[category];
      const rows = [];
      if (!collapsedSections[category]) {
        for (let i = 0; i < items.length; i += numColumns) {
          rows.push(items.slice(i, i + numColumns));
        }
      }
      return {
        title: category,
        data: rows,
        itemCount: items.length,
      };
    });

  const handleMenuItemPress = (menuItem) => {
    if (isSelectMode) {
      setSelectedIds((prev) =>
        prev.includes(menuItem.id)
          ? prev.filter((id) => id !== menuItem.id)
          : [...prev, menuItem.id],
      );
    } else {
      setSelectedMenuItem(menuItem);
    }
  };

  const handleBarcodeScan = () => {
    if (!searchQuery) return;
    const match = menuItems.find(
      (p) => p.barcode === searchQuery || p.sku === searchQuery,
    );
    if (match) {
      setEditingMenuItem(match);
      setIsWizardVisible(true);
      setSearchQuery("");
    }
  };

  const handleToggleStatus = (menuItem) => {
    updateMenuItem(menuItem.id, {
      status:
        menuItem.status === MENU_STATUS.ACTIVE
          ? MENU_STATUS.INACTIVE
          : MENU_STATUS.ACTIVE,
    });
  };

  const handleSaveMenuItem = (data) => {
    const payload = {
      ...data,
      status: data.status || "Active",
    };

    if (editingMenuItem) {
      updateMenuItem(editingMenuItem.id, payload);
    } else {
      addMenuItem({
        ...payload,
        id: `M-${Math.floor(Math.random() * 10000)}`,
      });
    }
  };

  const SIDEBAR_ITEMS = ["All", ...MENU_CATEGORIES];
  const filterOptions = SIDEBAR_ITEMS.map((cat) => ({
    label: cat === "All" ? "All Items" : cat,
    value: cat,
  }));

  return (
    <View style={styles.root}>
      <MenuHeader
        isDesktop={isWebDesktop}
        isSelectMode={isSelectMode}
        setIsSelectMode={setIsSelectMode}
        setSelectedIds={setSelectedIds}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleBarcodeScan={handleBarcodeScan}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onNewPress={() => {
          setEditingMenuItem(null);
          setIsWizardVisible(true);
        }}
      />

      <View style={styles.mainContent}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item[0]?.id + index}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<MenuEmptyState />}
          renderSectionHeader={({ section: { title, itemCount } }) => (
            <TouchableOpacity
              style={styles.sectionHeader}
              activeOpacity={0.7}
              onPress={() => toggleSection(title)}
            >
              <View style={styles.sectionTitleWrap}>
                <Text weight="black" style={styles.sectionTitle}>
                  {title}
                </Text>
                <Text weight="bold" style={styles.sectionCount}>
                  {itemCount}
                </Text>
              </View>
              {collapsedSections[title] ? (
                <ChevronDown size={24} color={ThemeColors.textSecondary} />
              ) : (
                <ChevronUp size={24} color={ThemeColors.textSecondary} />
              )}
            </TouchableOpacity>
          )}
          renderItem={({ item: row }) => (
            <View
              style={{
                flexDirection: "row",
                gap: ThemeSpacing.sm,
                marginBottom: ThemeSpacing.sm,
              }}
            >
              {row.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.cardWrapper,
                    {
                      width: cardWidth,
                      position: "relative",
                    },
                  ]}
                >
                  <MenuItemCard
                    menuItem={item}
                    isList={false}
                    onPress={handleMenuItemPress}
                    onEdit={(menuItem) => {
                      setEditingMenuItem(menuItem);
                      setIsWizardVisible(true);
                    }}
                    onToggleStatus={handleToggleStatus}
                  />
                  {isSelectMode && (
                    <View
                      style={[
                        styles.selectOverlay,
                        selectedIds.includes(item.id) &&
                          styles.selectOverlayActive,
                      ]}
                      pointerEvents="none"
                    >
                      {selectedIds.includes(item.id) && (
                        <CheckSquare size={24} color={ThemeColors.emerald} />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        />
      </View>

      <MenuItemWizardModal
        visible={isWizardVisible}
        onClose={() => setIsWizardVisible(false)}
        initialData={editingMenuItem}
        onSave={handleSaveMenuItem}
      />

      {isSelectMode && selectedIds.length > 0 && (
        <View style={styles.bulkActionBar}>
          <Text weight="bold" style={styles.bulkActionText}>
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""}{" "}
            selected
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => setIsBulkModalVisible(true)}
          >
            <Text weight="bold" style={styles.btnPrimaryText}>
              Bulk Edit
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <BulkActionModal
        visible={isBulkModalVisible}
        onClose={() => setIsBulkModalVisible(false)}
        selectedIds={selectedIds}
        onClearSelection={() => {
          setSelectedIds([]);
          setIsSelectMode(false);
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          setEditingMenuItem(null);
          setIsWizardVisible(true);
        }}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>Add MenuItem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sectionHeader: {
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    backgroundColor: ThemeColors.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  sidebar: {
    width: 250,
    backgroundColor: ThemeColors.surface,
    borderRightWidth: 1,
    borderColor: ThemeColors.border,
    paddingTop: ThemeSpacing.lg,
  },
  sidebarTitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    paddingHorizontal: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: ThemeSpacing.lg,
    gap: ThemeSpacing.sm,
  },
  sidebarItemActive: {
    backgroundColor: ThemeColors.emerald + "10",
    borderRightWidth: 3,
    borderColor: ThemeColors.emerald,
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  sidebarItemTextActive: {
    color: ThemeColors.emerald,
  },
  mobileTabsContainer: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
  },
  mobileTabsScroll: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    gap: ThemeSpacing.sm,
  },
  mobileTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThemeRadius.full,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  mobileTabActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  mobileTabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  mobileTabTextActive: {
    color: ThemeColors.white,
  },
  mainContent: {
    flex: 1,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  scrollContent: {
    padding: ThemeSpacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  cardWrapper: {
    flexShrink: 0,
    flexDirection: "column",
  },
  selectOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: ThemeRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  selectOverlayActive: {
    opacity: 1,
    backgroundColor: ThemeColors.emeraldDim + "80",
    borderWidth: 2,
    borderColor: ThemeColors.emerald,
  },
  bulkActionBar: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  bulkActionText: {
    color: ThemeColors.textPrimary,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: ThemeSpacing.xl,
    bottom: ThemeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: 100,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
