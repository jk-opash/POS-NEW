import { DraggableTable } from "@/components/tables/DraggableTable";
import { MergeTablesModal } from "@/components/tables/MergeTablesModal";
import { TableActionModal } from "@/components/tables/TableActionModal";
import { TableDetailsModal } from "@/components/tables/TableDetailsModal";
import { TableOrderMenuModal } from "@/components/tables/TableOrderMenuModal";
import { TablesFab } from "@/components/tables/TablesFab";
import { TablesHeader } from "@/components/tables/TablesHeader";
import { TablesLegend } from "@/components/tables/TablesLegend";
import { TablesZoomControls } from "@/components/tables/TablesZoomControls";
import { useKDS } from "@/context/KDSContext";
import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrdersContext";
import { useTables } from "@/context/TablesContext";
import { usePOS } from "@/context/POSContext";
import { useResponsive } from "@/hooks/useResponsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { Edit2, Check, Plus } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function TablesScreen() {
  const {
    floors,
    tables,
    updateTablePosition,
    updateTableRotation,
    addTable,
    updateTableDetails,
    deleteTable,
    mergeTables,
    unmergeTable,
  } = useTables();
  const { addOrderToKDS, replaceTableOrderInKDS } = useKDS();
  const { addOrder, updateOrder } = useOrders();
  const { menuItems } = useMenu();

  const [activeFloor, setActiveFloor] = useState(floors[0]?.id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showOrderMenuModal, setShowOrderMenuModal] = useState(false);
  const [actionTable, setActionTable] = useState(null);
  const { isDesktop, isTablet, isMiniTab, isMobile , isWebDesktop } = useResponsive();
  const { setActiveTable, setOrderType } = usePOS();
  const router = useRouter();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.3, Math.min(3, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedCanvasStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleZoomIn = () => {
    const newScale = Math.min(3, scale.value + 0.2);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.3, scale.value - 0.2);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const handleResetZoom = () => {
    scale.value = withSpring(1);
    savedScale.value = 1;
  };

  const floorTables = tables.filter((t) => t.floorId === activeFloor);

  const availableCount = floorTables.filter(
    (t) => t.status === "Available",
  ).length;
  const dineInCount = floorTables.filter((t) => t.status === "Occupied").length;
  const reservedCount = floorTables.filter(
    (t) => t.status === "Reserved",
  ).length;

  const isSmallScreen = isMobile || isMiniTab;

  return (
    <View style={styles.root}>
      <TablesHeader
        isDesktop={isWebDesktop}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        floors={floors}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        onMergePress={() => setShowMergeModal(true)}
      />

      <ScrollView contentContainerStyle={styles.canvasScrollContent}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.canvasScrollContent}
        >
          <GestureDetector gesture={pinchGesture}>
            <Animated.View style={[styles.canvasArea, animatedCanvasStyle]}>
              {floorTables.map((table) => (
                <DraggableTable
                  key={table.id}
                  table={table}
                  isEditMode={isEditMode}
                  onPositionChange={updateTablePosition}
                  onRotationChange={updateTableRotation}
                  onEdit={(t) => {
                    setModalMode("edit");
                    setSelectedTable(t);
                    setShowAddModal(true);
                  }}
                  onPress={() => {
                    if (!isEditMode) {
                      setActiveTable(table);
                      setOrderType("Dine-In");
                      router.push("/pos");
                    }
                  }}
                />
              ))}
            </Animated.View>
          </GestureDetector>
        </ScrollView>
      </ScrollView>

      {/* Floating Canvas UI Elements */}
      <TablesLegend
        isSmallScreen={isSmallScreen}
        availableCount={availableCount}
        dineInCount={dineInCount}
        reservedCount={reservedCount}
      />

      <TablesZoomControls
        isSmallScreen={isSmallScreen}
        isEditMode={isEditMode}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
      />

      {/* Floating Action Buttons Container */}
      <View style={styles.fabContainer}>
        {isEditMode && (
          <TouchableOpacity
            style={[styles.fab, styles.addFab]}
            activeOpacity={0.8}
            onPress={() => {
              setModalMode("add");
              setSelectedTable(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={20} color={ThemeColors.white} />
            <Text style={styles.fabText}>Add Table</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.fab, isEditMode && styles.fabActive]}
          activeOpacity={0.8}
          onPress={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? (
            <Check size={20} color={ThemeColors.white} strokeWidth={3} />
          ) : (
            <Edit2 size={20} color={ThemeColors.white} strokeWidth={2.5} />
          )}
          <Text style={styles.fabText}>
            {isEditMode ? "Done Editing" : "Edit Layout"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Table Details Modal */}
      <TableDetailsModal
        visible={showAddModal}
        mode={modalMode}
        initialData={selectedTable}
        onClose={() => setShowAddModal(false)}
        onSave={(config) => {
          if (modalMode === "add") {
            addTable(activeFloor, config);
          } else if (selectedTable) {
            updateTableDetails(selectedTable.id, config);
          }
        }}
        onDelete={() => {
          if (selectedTable) {
            deleteTable(selectedTable.id);
          }
        }}
      />

      {/* Merge Tables Modal */}
      <MergeTablesModal
        visible={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        floorTables={floorTables}
        onMerge={(ids) => {
          mergeTables(ids);
          setIsEditMode(true);
        }}
      />

      {/* Table Action Modal (Non-Edit Mode) */}
      <TableActionModal
        visible={showActionModal}
        table={actionTable}
        onClose={() => setShowActionModal(false)}
        onUpdateStatus={(id, status) => updateTableDetails(id, { status })}
        onTakeOrder={() => setShowOrderMenuModal(true)}
        onCheckout={(id) =>
          updateTableDetails(id, { order: null, status: "Available", orderId: null })
        }
        onCancelOrder={(id) =>
          updateTableDetails(id, { order: null, status: "Available", orderId: null })
        }
        onUnmerge={(id) => {
          unmergeTable(id);
          setShowActionModal(false);
          setIsEditMode(true);
        }}
      />

      {/* Menu List Modal for taking order */}
      <TableOrderMenuModal
        visible={showOrderMenuModal}
        table={actionTable}
        initialOrder={actionTable?.order || {}}
        onClose={() => setShowOrderMenuModal(false)}
        onPlaceOrder={(orderItems) => {
          const isExistingOrder = !!actionTable.orderId;
          const orderId = actionTable.orderId || `ORD-${Date.now().toString().slice(-4)}`;

          updateTableDetails(actionTable.id, {
            order: orderItems,
            status: "Occupied",
            orderId: orderId,
          });

          const cart = orderItems
            .filter((item) => item.quantity > 0)
            .map((item) => ({
              ...item,
              product: menuItems.find((p) => p.id === item.productId),
            }))
            .filter((item) => item.product);

          const kdsPayload = {
            cart,
            customer: null,
            activeTable: actionTable,
            orderType: "Dine-In",
            itemWise: false,
            notes: "",
          };

          const orderPayload = {
            id: orderId,
            customer: { name: "Walk-in Customer", initials: "WC" },
            status: "In Progress",
            type: "Dine In",
            table: actionTable.name,
            date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            items: cart.map((c) => ({
              name: c.product.name,
              qty: c.quantity,
              price: c.product.pricing?.sellingPrice || c.product.price || 0,
            })),
            total: cart.reduce(
              (sum, item) => sum + (item.product.pricing?.sellingPrice || item.product.price || 0) * item.quantity,
              0
            ),
          };

          if (isExistingOrder) {
            replaceTableOrderInKDS(actionTable.name, kdsPayload);
            updateOrder(orderId, orderPayload);
          } else {
            addOrderToKDS(kdsPayload);
            addOrder(orderPayload);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.surfaceElevated, // Lighter background for canvas feel
  },
  canvasScrollContent: {
    flexGrow: 1,
  },
  canvasArea: {
    width: 1000,
    height: 1000,
    position: "relative",
  },
  fabContainer: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xxl,
    alignItems: "flex-end",
    gap: 16,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: ThemeRadius.full,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  addFab: {
    backgroundColor: ThemeColors.primary, // different shade if you want
  },
  fabActive: {
    backgroundColor: ThemeColors.emerald,
    shadowColor: ThemeColors.emerald,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
