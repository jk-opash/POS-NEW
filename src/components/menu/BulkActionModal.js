import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { X, Check } from 'lucide-react-native';
import { useMenu } from '@/context/MenuContext';
import { MENU_CATEGORIES } from '@/constants/menu';

export function BulkActionModal({ visible, onClose, selectedIds, onClearSelection }) {
  const { bulkUpdate } = useMenu();
  const [activeTab, setActiveTab] = useState('Discount');
  
  // Discount state
  const [discountType, setDiscountType] = useState('%');
  const [discountValue, setDiscountValue] = useState('');

  // Category state
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleApply = () => {
    const updates = {};
    if (activeTab === 'Discount' && discountValue) {
      // In a real app we might store discount rules or apply flat reduction to sellingPrice
      // We will just store a generic discount field for demo
      updates.bulkDiscount = `${discountValue}${discountType}`;
    } else if (activeTab === 'Category' && selectedCategory) {
      updates.category = selectedCategory;
    }

    bulkUpdate(selectedIds, updates);
    onClearSelection();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>Bulk Edit ({selectedIds.length} items)</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsRow}>
            {['Discount', 'Category'].map(tab => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text weight="semibold" style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.body}>
            {activeTab === 'Discount' && (
              <View>
                <Text weight="medium" style={styles.label}>Apply Discount</Text>
                <View style={styles.discountRow}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Value" 
                    keyboardType="numeric"
                    value={discountValue}
                    onChangeText={setDiscountValue}
                  />
                  <View style={styles.typeToggle}>
                    <TouchableOpacity 
                      style={[styles.typeBtn, discountType === '%' && styles.typeBtnActive]}
                      onPress={() => setDiscountType('%')}
                    >
                      <Text style={styles.typeBtnText}>%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.typeBtn, discountType === '₹' && styles.typeBtnActive]}
                      onPress={() => setDiscountType('₹')}
                    >
                      <Text style={styles.typeBtnText}>₹</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'Category' && (
              <View>
                <Text weight="medium" style={styles.label}>Move to Category</Text>
                <View style={styles.categoriesWrap}>
                  {MENU_CATEGORIES.map(cat => (
                    <TouchableOpacity 
                      key={cat}
                      style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      {selectedCategory === cat && <Check size={14} color={ThemeColors.emerald} style={{marginRight: 4}}/>}
                      <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
              <Text weight="bold" style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleApply}>
              <Text weight="bold" style={styles.btnPrimaryText}>Apply Changes</Text>
            </TouchableOpacity>
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
    padding: ThemeSpacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: 'hidden',
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
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  tab: {
    flex: 1,
    paddingVertical: ThemeSpacing.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.emerald,
  },
  tabText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  tabTextActive: {
    color: ThemeColors.emerald,
  },
  body: {
    padding: ThemeSpacing.xl,
    minHeight: 180,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  discountRow: {
    flexDirection: 'row',
    gap: ThemeSpacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 44,
    fontSize: 14,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    overflow: 'hidden',
  },
  typeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: ThemeColors.border,
  },
  typeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemeColors.textPrimary,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ThemeSpacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  catChipActive: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  catChipText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  catChipTextActive: {
    color: ThemeColors.emerald,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  btnSecondaryText: {
    color: ThemeColors.textSecondary,
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emerald,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
