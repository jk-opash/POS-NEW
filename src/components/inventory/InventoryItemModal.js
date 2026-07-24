import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { Dropdown } from '@/components/ui/Dropdown';
import { X, Save, Upload } from 'lucide-react-native';
import { useInventoryContext } from '@/context/InventoryContext';

export function InventoryItemModal({ visible, onClose }) {
  const { isMobile } = useResponsive();
  const { addInventoryItem, logStockMovement } = useInventoryContext();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (visible) {
      setName('');
      setSku('');
      setCategory('');
      setStock('');
      setUnit('pcs');
      setPrice('');
      setImage(null);
      setError('');
    }
  }, [visible]);

  const INVENTORY_CATEGORIES = [
    { label: 'Raw Materials', value: 'Raw Materials' },
    { label: 'Packaging', value: 'Packaging' },
    { label: 'Ingredients', value: 'Ingredients' },
    { label: 'Beverages', value: 'Beverages' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'Other', value: 'Other' },
  ];

  const UNIT_OPTIONS = [
    { label: 'Pieces (pcs)', value: 'pcs' },
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
    { label: 'Liters (L)', value: 'L' },
    { label: 'Milliliters (ml)', value: 'ml' },
    { label: 'Box/Carton', value: 'box' },
  ];

  const handleImageUpload = () => {
    // Mock image upload
    Alert.alert(
      "Upload Image",
      "In a real app, this would open the image picker.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mock Upload", onPress: () => setImage("https://picsum.photos/200") }
      ]
    );
  };

  const handleSubmit = () => {
    setError('');
    const pName = name.trim();
    const pSku = sku.trim();
    const pCat = category.trim();
    const stockNum = parseInt(stock, 10);
    const priceNum = parseFloat(price);

    if (!pName) return setError("Item name is required.");
    if (!pSku) return setError("SKU is required.");
    if (!pCat) return setError("Category is required.");
    if (isNaN(stockNum) || stockNum < 0) return setError("Valid initial stock is required.");
    if (isNaN(priceNum) || priceNum < 0) return setError("Valid price is required.");

    const newItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      name: pName,
      sku: pSku,
      category: pCat,
      inStock: stockNum,
      reserved: 0,
      reorderLevel: 10, // Default mock value
      unit: unit.trim(),
      price: priceNum,
      image: image,
      status: stockNum > 10 ? 'Normal' : (stockNum === 0 ? 'Out of Stock' : 'Low'),
      lastCounted: new Date().toISOString().split('T')[0]
    };

    addInventoryItem(newItem);
    
    // Log creation
    logStockMovement({
      type: 'ITEM_CREATED',
      itemId: newItem.id,
      itemName: newItem.name,
      quantityChange: stockNum,
      reason: 'Initial setup',
      performedBy: 'Admin'
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, isMobile && styles.modalMobile]}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>Add Inventory Item</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Burger Buns (Pack of 12)"
                placeholderTextColor={ThemeColors.textMuted}
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>SKU</Text>
                <TextInput
                  style={styles.input}
                  value={sku}
                  onChangeText={setSku}
                  placeholder="e.g. BUN-012"
                  placeholderTextColor={ThemeColors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, zIndex: 10 }]}>
                <Text style={styles.label}>Category</Text>
                <Dropdown
                  options={INVENTORY_CATEGORIES}
                  value={category}
                  onChange={setCategory}
                  placeholder="Select Category"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Initial Stock</Text>
                <TextInput
                  style={styles.input}
                  value={stock}
                  onChangeText={setStock}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={ThemeColors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, zIndex: 9 }]}>
                <Text style={styles.label}>Unit</Text>
                <Dropdown
                  options={UNIT_OPTIONS}
                  value={unit}
                  onChange={setUnit}
                  placeholder="Select Unit"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Unit Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={ThemeColors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Image</Text>
              <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
                {image ? (
                  <Image source={{ uri: image }} style={{ width: '100%', height: 120, borderRadius: ThemeRadius.md }} resizeMode="cover" />
                ) : (
                  <>
                    <Upload size={24} color={ThemeColors.textSecondary} />
                    <Text style={styles.uploadText}>Click to upload image</Text>
                  </>
                )}
              </TouchableOpacity>
              {image && (
                <TouchableOpacity onPress={() => setImage(null)} style={{ marginTop: 8 }}>
                  <Text style={{ color: ThemeColors.red, fontSize: 13 }}>Remove Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
              <Save size={16} color={ThemeColors.white} style={{ marginRight: 8 }} />
              <Text weight="bold" style={styles.btnPrimaryText}>Save Item</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: 'hidden',
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalMobile: {
    width: '95%',
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
    gap: ThemeSpacing.lg,
  },
  errorBanner: {
    backgroundColor: ThemeColors.redDim,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.red + '30',
  },
  errorText: {
    color: ThemeColors.red,
    fontSize: 14,
  },
  inputGroup: {
    gap: ThemeSpacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: ThemeSpacing.md,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: 'none',
  },
  imageUpload: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: "dashed",
    borderRadius: ThemeRadius.sm,
    padding: ThemeSpacing.xl,
    alignItems: "center",
    gap: ThemeSpacing.sm,
    marginTop: ThemeSpacing.xs,
  },
  uploadText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: ThemeSpacing.md,
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.surfaceElevated,
  },
  btnCancel: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  btnCancelText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emerald, // InventoryActionModal uses emerald
  },
  btnPrimaryText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
