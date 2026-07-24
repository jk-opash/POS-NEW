import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, CheckSquare, Square, GitMerge } from "lucide-react-native";

export function MergeTablesModal({ visible, onClose, floorTables, onMerge }) {
  const [selectedTableIds, setSelectedTableIds] = useState([]);

  useEffect(() => {
    if (visible) {
      setSelectedTableIds([]);
    }
  }, [visible]);

  const toggleTableSelection = (id) => {
    setSelectedTableIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id],
    );
  };

  const handleMerge = () => {
    if (selectedTableIds.length >= 2) {
      onMerge(selectedTableIds);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              Merge Tables
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.subtitle}>
              Select 2 or more tables to merge into a single large table.
            </Text>
            
            <ScrollView style={styles.tableList}>
              {floorTables.map((table) => {
                const isSelected = selectedTableIds.includes(table.id);
                return (
                  <TouchableOpacity
                    key={table.id}
                    style={[
                      styles.tableItem,
                      isSelected && styles.tableItemActive,
                    ]}
                    onPress={() => toggleTableSelection(table.id)}
                  >
                    <View style={styles.tableInfo}>
                      <Text weight="bold" style={styles.tableName}>
                        {table.name}
                      </Text>
                      <Text style={styles.tableCapacity}>
                        Capacity: {table.capacity} • {table.status}
                      </Text>
                    </View>
                    <View style={styles.checkbox}>
                      {isSelected ? (
                        <CheckSquare size={24} color={ThemeColors.emerald} />
                      ) : (
                        <Square size={24} color={ThemeColors.border} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text weight="bold" style={styles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mergeBtn,
                  selectedTableIds.length < 2 && styles.mergeBtnDisabled,
                ]}
                disabled={selectedTableIds.length < 2}
                onPress={handleMerge}
              >
                <GitMerge size={20} color={ThemeColors.white} />
                <Text weight="bold" style={styles.mergeBtnText}>
                  Merge ({selectedTableIds.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 450,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  body: {
    padding: ThemeSpacing.xl,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
    marginBottom: ThemeSpacing.lg,
  },
  tableList: {
    maxHeight: 300,
    marginBottom: ThemeSpacing.xl,
  },
  tableItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    marginBottom: ThemeSpacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tableItemActive: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  tableCapacity: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  checkbox: {
    marginLeft: ThemeSpacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  cancelBtnText: {
    color: ThemeColors.textPrimary,
    fontSize: 16,
  },
  mergeBtn: {
    flex: 2,
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.primary,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  mergeBtnDisabled: {
    backgroundColor: ThemeColors.border,
  },
  mergeBtnText: {
    color: ThemeColors.surface,
    fontSize: 16,
  },
});
