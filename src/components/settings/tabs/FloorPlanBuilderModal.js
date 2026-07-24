import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  SafeAreaView
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useTables } from '@/context/TablesContext';

const GRID_SIZE = 20;

// Helper to snap to grid
const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableTable = ({ table, updateTablePosition, onDelete }) => {
  const pan = useRef(new Animated.ValueXY({ x: table.x, y: table.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        // Snap to grid on release
        const newX = Math.max(0, snapToGrid(table.x + gesture.dx));
        const newY = Math.max(0, snapToGrid(table.y + gesture.dy));
        
        // Ensure we stay within a reasonable boundary (assume max width 2000 for now)
        pan.setValue({ x: newX, y: newY });
        updateTablePosition(table.id, newX, newY);
      },
    })
  ).current;

  // Sync internal animated value if external props change
  React.useEffect(() => {
    pan.setValue({ x: table.x, y: table.y });
  }, [table.x, table.y]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        pan.getLayout(),
        styles.tableBox,
        table.capacity > 4 && styles.tableLarge,
      ]}
    >
      <Text weight="bold" style={styles.tableName}>{table.name}</Text>
      <Text style={styles.tableCapacity}>{table.capacity} pax</Text>
      
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => onDelete(table.id)}
      >
        <Trash2 size={12} color={ThemeColors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export function FloorPlanBuilderModal({ visible, onClose }) {
  const { floors, tables, updateTablePosition, addTable, deleteTable } = useTables();
  const [activeFloorId, setActiveFloorId] = useState(floors[0]?.id);

  const currentTables = tables.filter(t => t.floorId === activeFloorId);

  const handleAddTable = () => {
    addTable(activeFloorId, { name: `T${currentTables.length + 1}`, capacity: 4 });
  };

  const handleDelete = (id) => {
    const table = tables.find(t => t.id === id);
    if (table && table.status !== 'Available') {
      alert("Cannot delete a table with an active status.");
      return;
    }
    deleteTable(id);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>Floor Plan Builder</Text>
              <Text style={styles.subtitle}>Drag and drop tables to arrange your layout.</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Toolbar */}
          <View style={styles.toolbar}>
            <View style={styles.floorTabs}>
              {floors.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.floorTab, activeFloorId === f.id && styles.floorTabActive]}
                  onPress={() => setActiveFloorId(f.id)}
                >
                  <Text style={[styles.floorTabText, activeFloorId === f.id && styles.floorTabTextActive]}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddTable}>
              <Plus size={16} color={ThemeColors.white} />
              <Text weight="bold" style={{ color: ThemeColors.white, marginLeft: 6 }}>Add Table</Text>
            </TouchableOpacity>
          </View>

          {/* Canvas */}
          <View style={styles.canvasContainer}>
            <View style={styles.canvas}>
              {/* Grid pattern background mock */}
              <View style={styles.gridOverlay} pointerEvents="none" />
              
              {currentTables.map(t => (
                <DraggableTable 
                  key={t.id} 
                  table={t} 
                  updateTablePosition={updateTablePosition} 
                  onDelete={handleDelete}
                />
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <CheckCircle2 size={18} color={ThemeColors.white} />
              <Text weight="bold" style={styles.doneBtnText}>Save & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ThemeSpacing.lg,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    marginTop: 4,
  },
  closeBtn: {
    padding: 8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  floorTabs: {
    flexDirection: 'row',
    gap: ThemeSpacing.sm,
  },
  floorTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.bg,
  },
  floorTabActive: {
    backgroundColor: ThemeColors.blue,
  },
  floorTabText: {
    color: ThemeColors.textSecondary,
    fontWeight: '600',
  },
  floorTabTextActive: {
    color: ThemeColors.white,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: ThemeRadius.md,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: ThemeColors.borderSubtle, // Slightly darker grid background
    overflow: 'hidden',
  },
  canvas: {
    width: 2000,
    height: 2000,
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  footer: {
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    alignItems: 'flex-end',
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: ThemeRadius.md,
  },
  doneBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
  tableBox: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ThemeColors.blue,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tableLarge: {
    width: 120,
    height: 80,
  },
  tableName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  tableCapacity: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  deleteBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: ThemeColors.red,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
