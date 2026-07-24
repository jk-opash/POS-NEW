import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Dropdown } from '@/components/ui/Dropdown';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { X, Users, Trash2, Circle, Square, ChevronDown } from 'lucide-react-native';

const CAPACITY_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const cap = (i + 1) * 2;
  return {
    id: cap,
    label: `${cap} Seat${cap > 1 ? 's' : ''}`,
    capacity: cap,
    value: cap, // for Dropdown
    span: Math.ceil(cap / 4) || 1,
  };
});

export function TableDetailsModal({ visible, onClose, mode = 'add', initialData, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState(2);
  const [shape, setShape] = useState('rectangle');

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name || '');
        setSelectedCapacity(initialData.capacity || 2);
        setShape(initialData.shape || 'rectangle');
      } else {
        setName('');
        setSelectedCapacity(2);
        setShape('rectangle');
      }
    }
  }, [visible, mode, initialData]);

  if (!visible) return null;

  const handleSave = () => {
    const config = CAPACITY_OPTIONS.find(c => c.capacity === selectedCapacity);
    onSave({
      name: name.trim() || 'New',
      capacity: config.capacity,
      span: config.span,
      shape
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>
              {mode === 'edit' ? 'Edit Table' : 'Add New Table'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.formGroup}>
              <Text weight="medium" style={styles.label}>Table Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. A12"
                placeholderTextColor={ThemeColors.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text weight="medium" style={styles.label}>Capacity</Text>
              
              <Dropdown
                options={CAPACITY_OPTIONS}
                value={selectedCapacity}
                onChange={setSelectedCapacity}
                style={{ paddingVertical: ThemeSpacing.md, height: 'auto' }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text weight="medium" style={styles.label}>Shape</Text>
              <View style={styles.capacityGrid}>
                <TouchableOpacity 
                  style={[styles.capacityCard, shape === 'rectangle' && styles.capacityCardActive]}
                  onPress={() => setShape('rectangle')}
                  activeOpacity={0.7}
                >
                  <Square size={18} color={shape === 'rectangle' ? ThemeColors.white : ThemeColors.emerald} />
                  <Text weight={shape === 'rectangle' ? "bold" : "medium"} style={[styles.capacityText, shape === 'rectangle' && styles.capacityTextActive]}>
                    Rectangle
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.capacityCard, shape === 'square' && styles.capacityCardActive]}
                  onPress={() => setShape('square')}
                  activeOpacity={0.7}
                >
                  <Square size={18} color={shape === 'square' ? ThemeColors.white : ThemeColors.emerald} />
                  <Text weight={shape === 'square' ? "bold" : "medium"} style={[styles.capacityText, shape === 'square' && styles.capacityTextActive]}>
                    Square
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.capacityCard, shape === 'oval' && styles.capacityCardActive]}
                  onPress={() => setShape('oval')}
                  activeOpacity={0.7}
                >
                  <Circle size={18} color={shape === 'oval' ? ThemeColors.white : ThemeColors.emerald} />
                  <Text weight={shape === 'oval' ? "bold" : "medium"} style={[styles.capacityText, shape === 'oval' && styles.capacityTextActive]}>
                    Oval
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.capacityCard, shape === 'circle' && styles.capacityCardActive]}
                  onPress={() => setShape('circle')}
                  activeOpacity={0.7}
                >
                  <Circle size={18} color={shape === 'circle' ? ThemeColors.white : ThemeColors.emerald} />
                  <Text weight={shape === 'circle' ? "bold" : "medium"} style={[styles.capacityText, shape === 'circle' && styles.capacityTextActive]}>
                    Circle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {mode === 'edit' && (
              <TouchableOpacity style={styles.deleteBtn} onPress={() => { onDelete(); onClose(); }}>
                <Trash2 size={18} color={ThemeColors.red} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.footerRight}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text weight="bold" style={styles.saveBtnText}>Save</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: ThemeColors.surface,
    width: 400,
    borderRadius: ThemeRadius.lg,
    maxHeight: '80%',
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.xl,
  },
  formGroup: {
    gap: ThemeSpacing.md,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    padding: ThemeSpacing.md,
    fontSize: 16,
    color: ThemeColors.textPrimary,
    backgroundColor: ThemeColors.bg,
  },
  capacityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ThemeSpacing.md,
  },
  capacityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    gap: ThemeSpacing.sm,
  },
  capacityCardActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  capacityText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  capacityTextActive: {
    color: ThemeColors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  footerRight: {
    flexDirection: 'row',
    gap: ThemeSpacing.md,
    marginLeft: 'auto',
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
  },
  cancelBtnText: {
    color: ThemeColors.textSecondary,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
  },
  saveBtnText: {
    color: ThemeColors.white,
    fontSize: 16,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    backgroundColor: ThemeColors.redDim,
    borderRadius: ThemeRadius.md,
  },
  deleteBtnText: {
    color: ThemeColors.red,
    fontWeight: '500',
  }
});
