import { DraggableTable } from "@/components/tables/DraggableTable";
import { MergeTablesModal } from "@/components/tables/MergeTablesModal";
import { TableActionModal } from "@/components/tables/TableActionModal";
import { TableDetailsModal } from "@/components/tables/TableDetailsModal";
import { TablesHeader } from "@/components/tables/TablesHeader";
import { TablesLegend } from "@/components/tables/TablesLegend";
import { TablesZoomControls } from "@/components/tables/TablesZoomControls";
import { useResponsive } from "@/hooks/useResponsive";
import {
  fetchZonesAndTables,
  createTable as rtkCreateTable,
  deleteTable as rtkDeleteTable,
  updateTable as rtkUpdateTable,
  updateTablePosition as rtkUpdateTablePosition,
  updateTableRotation as rtkUpdateTableRotation,
} from "@/store/slices/branchSlice";
import { setActiveTable, setOrderType, createOrder, restoreOrder, resetOrder } from "@/store/slices/posSlice";

import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useRouter } from "expo-router";
import { Check, Edit2, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

export default function TablesScreen() {
  const {
    activeBranch,
    floors = [],
    tables = [],
  } = useSelector((state) => state.branch);
  const { user } = useSelector((state) => state.auth);

  const currentBranchId =
    activeBranch && activeBranch !== "br-1" ? activeBranch : user?.branch_id;
  
  // Branch details needed for generating the Order Number
  const branchDetails = useSelector((state) => state.branch.branches || []).find(
    (b) => b.id === currentBranchId
  );
  const branchCode = branchDetails?.branch_code || "BR";

  // ─── Generate Order Number (follows the same pattern as Invoice) ─────────
  // Format: ORD-{BranchCode}-{TableName}-{DDMMYYYY}-{randomSuffix}
  const generateOrderNumber = (tableName) => {
    const now = new Date();
    const date = [
      String(now.getDate()).padStart(2, "0"),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getFullYear()),
    ].join("");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const safeTable = (tableName || "T").replace(/\s/g, "");
    return `ORD-${branchCode}-${safeTable}-${date}-${random}`;
  };

  const [activeFloor, setActiveFloor] = useState(floors[0]?.id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionTable, setActionTable] = useState(null);
  const { isDesktop, isTablet, isMiniTab, isMobile, isWebDesktop } =
    useResponsive();
  const router = useRouter();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const updateTablePosition = (tableId, x, y) =>
    dispatch(rtkUpdateTablePosition({ tableId, x, y }));
  const updateTableRotation = (tableId, rotation) =>
    dispatch(rtkUpdateTableRotation({ tableId, rotation }));
  const createTable = (data) => dispatch(rtkCreateTable(data)).unwrap();
  const updateTable = (id, data) =>
    dispatch(rtkUpdateTable({ id, data })).unwrap();
  const deleteTable = (id) => dispatch(rtkDeleteTable(id)).unwrap();

  useEffect(() => {
    const branchId =
      authUser?.branch_id ||
      authUser?.branchId ||
      authUser?.businesses?.[0]?.id;
    if (branchId) {
      dispatch(fetchZonesAndTables(branchId)).then((action) => {
        if (
          fetchZonesAndTables.fulfilled.match(action) &&
          action.payload.zones.length > 0
        ) {
          setActiveFloor(action.payload.zones[0].id);
        }
      });
    }
  }, [authUser]);

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
    const s = Math.min(3, scale.value + 0.2);
    scale.value = withSpring(s);
    savedScale.value = s;
  };
  const handleZoomOut = () => {
    const s = Math.max(0.3, scale.value - 0.2);
    scale.value = withSpring(s);
    savedScale.value = s;
  };
  const handleResetZoom = () => {
    scale.value = withSpring(1);
    savedScale.value = 1;
  };

  const floorTables = tables.filter((t) => t.floorId === activeFloor);

  const availableCount = floorTables.filter((t) => {
    const hasOrder =
      t.order &&
      (Array.isArray(t.order)
        ? t.order.length > 0
        : Object.keys(t.order).length > 0);
    return !hasOrder && (!t.status || t.status === "Available");
  }).length;

  const dineInCount = floorTables.filter((t) => {
    const hasOrder =
      t.order &&
      (Array.isArray(t.order)
        ? t.order.length > 0
        : Object.keys(t.order).length > 0);
    return t.status === "Occupied" || hasOrder;
  }).length;

  const reservedCount = floorTables.filter((t) => {
    const hasOrder =
      t.order &&
      (Array.isArray(t.order)
        ? t.order.length > 0
        : Object.keys(t.order).length > 0);
    return t.status === "Reserved" && !hasOrder;
  }).length;

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
                      if (table.status === "Occupied") {
                        // ── Occupied Table: Restore existing order from DB ────────
                        dispatch(setActiveTable(table));
                        dispatch(setOrderType("Dine-In"));
                        dispatch(restoreOrder({
                          branchId: currentBranchId,
                          tableId: table.id,
                        }));
                      } else {
                        // ── Available Table: Start a fresh session ───────────────────
                        dispatch(resetOrder());
                        dispatch(setActiveTable(table));
                        dispatch(setOrderType("Dine-In"));
                      }

                      router.push("/pos");
                    }
                  }}
                  onLongPress={() => {
                    if (!isEditMode) {
                      setActionTable(table);
                      setShowActionModal(true);
                    }
                  }}
                />
              ))}
            </Animated.View>
          </GestureDetector>
        </ScrollView>
      </ScrollView>

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
          onPress={async () => {
            if (isEditMode) {
              await Promise.all(
                floorTables.map((t) =>
                  updateTable(t.id, {
                    position_x: t.x,
                    position_y: t.y,
                    rotation: t.rotation || 0,
                  }),
                ),
              );
            }
            setIsEditMode(!isEditMode);
          }}
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

      <TableDetailsModal
        visible={showAddModal}
        mode={modalMode}
        initialData={selectedTable}
        onClose={() => setShowAddModal(false)}
        onSave={(config) => {
          const { span, ...apiConfig } = config;
          if (modalMode === "add") {
            createTable({
              ...apiConfig,
              zone_id: activeFloor,
              branch_id: currentBranchId,
              position_x: 100,
              position_y: 100,
              status: "Available",
              rotation: 0,
            });
          } else if (selectedTable) {
            updateTable(selectedTable.id, apiConfig);
          }
        }}
        onDelete={() => {
          if (selectedTable) deleteTable(selectedTable.id);
        }}
      />

      <MergeTablesModal
        visible={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        floorTables={floorTables}
        onMerge={async (ids) => {
          const selected = tables.filter((t) => ids.includes(t.id));
          if (selected.length < 2) return;
          await createTable({
            name: selected.map((t) => t.name).join("+"),
            zone_id: activeFloor,
            branch_id: currentBranchId,
            position_x: Math.min(...selected.map((t) => t.x)),
            position_y: Math.min(...selected.map((t) => t.y)),
            capacity: selected.reduce((s, t) => s + t.capacity, 0),
            status: "Available",
            shape: "rectangle",
            rotation: 0,
            merged_tables: selected,
          });
          for (const t of selected) await deleteTable(t.id);
          setIsEditMode(true);
        }}
      />

      <TableActionModal
        visible={showActionModal}
        table={actionTable}
        onClose={() => setShowActionModal(false)}
        onUpdateStatus={(id, status) => updateTable(id, { status })}
        onCheckout={(id) =>
          updateTable(id, { status: "Available", order: null })
        }
        onCancelOrder={(id) =>
          updateTable(id, { status: "Available", order: null })
        }
        onUnmerge={async (id) => {
          const tbl = tables.find((t) => t.id === id);
          if (tbl?.merged_tables?.length) {
            for (const ot of tbl.merged_tables)
              await createTable({
                ...ot,
                id: undefined,
                zone_id: activeFloor,
                branch_id: currentBranchId,
              });
            await deleteTable(id);
          }
          setShowActionModal(false);
          setIsEditMode(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.surfaceElevated },
  canvasScrollContent: { flexGrow: 1 },
  canvasArea: { width: 1000, height: 1000, position: "relative" },
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
  addFab: { backgroundColor: ThemeColors.primary },
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
