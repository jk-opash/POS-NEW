import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { Dropdown } from '@/components/ui/Dropdown';
import { X, Save, AlertCircle } from 'lucide-react-native';
import { useInventoryContext } from '@/context/InventoryContext';


export function InventoryActionModal({ visible, onClose, type, initialProductId = '' }) {
  const { isMobile } = useResponsive();
  const { inventory, logStockMovement, adjustStock } = useInventoryContext();


  const [productId, setProductId] = React.useState(initialProductId);
  const [adjustmentType, setAdjustmentType] = React.useState('remove');
  const [quantity, setQuantity] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (visible) {
      setProductId(initialProductId || '');
      setAdjustmentType('remove');
      setQuantity('');
      setReason('');
      setNotes('');
      setError('');
    }
  }, [visible, initialProductId]);

  const handleSubmit = () => {
    setError('');
    if (type === 'adjustments' || type === 'quarantine') {
      const pId = productId.trim();
      const qtyNum = parseInt(quantity, 10);
      
      if (!pId) return setError("Product ID/SKU is required.");
      if (isNaN(qtyNum)) return setError("Valid quantity is required.");
      if (!reason.trim()) return setError("Reason is required.");

      const product = inventory.find(p => p.id === pId || p.sku === pId);
      if (!product) return setError(`No product found with ID/SKU: ${pId}`);

      let finalQty = Math.abs(qtyNum);
      if (type === 'quarantine' || (type === 'adjustments' && adjustmentType === 'remove')) {
        finalQty = -finalQty;
      }

      if (type === 'adjustments') {
        adjustStock(product.id, product.name, finalQty, reason, "Admin");
      } else {
        logStockMovement({
          productId: product.id,
          itemName: product.name,
          quantityChange: finalQty,
          reason: type === 'quarantine' ? `Quarantine: ${reason}` : reason,
          notes: notes,
          performedBy: "Admin", // Hardcoded for mock
        });
      }
      
      onClose();
    } else {
      // Stub for other types
      onClose();
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'transfers': return 'New Stock Transfer';
      case 'adjustments': return 'Inventory Adjustment';
      case 'count': return 'Start Stock Count';
      case 'quarantine': return 'Log Quarantine Issue';
      case 'replenish': return 'Order Replenishment';
      default: return 'Inventory Action';
    }
  };

  const ADD_REASONS = [
    { label: 'Stock Correction (Found)', value: 'Stock Correction (Found)' },
    { label: 'Supplier Over-delivery', value: 'Supplier Over-delivery' },
    { label: 'Customer Return', value: 'Customer Return' },
    { label: 'Other Addition', value: 'Other Addition' },
  ];

  const REMOVE_REASONS = [
    { label: 'Stock Correction (Lost)', value: 'Stock Correction (Lost)' },
    { label: 'Damage/Spoilage', value: 'Damage/Spoilage' },
    { label: 'Promotional/Giveaway', value: 'Promotional/Giveaway' },
    { label: 'Return to Supplier', value: 'Return to Supplier' },
    { label: 'Theft/Loss', value: 'Theft/Loss' },
  ];

  const QUARANTINE_REASONS = [
    { label: 'Damaged in Transit', value: 'Damaged in Transit' },
    { label: 'Quality Check Pending', value: 'Quality Check Pending' },
    { label: 'Expired/Spoiled', value: 'Expired/Spoiled' },
    { label: 'Recall', value: 'Recall' },
  ];

  const renderFields = () => {
    switch(type) {
      case 'transfers':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Source Location</Text>
              <TextInput style={styles.input} placeholder="e.g. Main Warehouse" placeholderTextColor={ThemeColors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destination Location</Text>
              <TextInput style={styles.input} placeholder="e.g. Front Store" placeholderTextColor={ThemeColors.textMuted} />
            </View>
          </>
        );
      case 'adjustments':
      case 'quarantine':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product ID or SKU</Text>
              <TextInput style={styles.input} placeholder="e.g. P-1001" placeholderTextColor={ThemeColors.textMuted} value={productId} onChangeText={setProductId} />
            </View>

            {type === 'adjustments' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Action</Text>
                <View style={{ flexDirection: 'row', backgroundColor: ThemeColors.bg, borderRadius: ThemeRadius.md, padding: 2 }}>
                  <TouchableOpacity 
                    style={[
                      { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: ThemeRadius.sm },
                      adjustmentType === 'add' ? { backgroundColor: ThemeColors.surface, shadowColor: ThemeColors.black, shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}
                    ]}
                    onPress={() => { setAdjustmentType('add'); setReason(''); }}
                    activeOpacity={0.8}
                  >
                    <Text weight={adjustmentType === 'add' ? "bold" : "regular"} style={{ color: adjustmentType === 'add' ? ThemeColors.emerald : ThemeColors.textMuted }}>Add Stock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: ThemeRadius.sm },
                      adjustmentType === 'remove' ? { backgroundColor: ThemeColors.surface, shadowColor: ThemeColors.black, shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}
                    ]}
                    onPress={() => { setAdjustmentType('remove'); setReason(''); }}
                    activeOpacity={0.8}
                  >
                    <Text weight={adjustmentType === 'remove' ? "bold" : "regular"} style={{ color: adjustmentType === 'remove' ? ThemeColors.red : ThemeColors.textMuted }}>Remove Stock</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: ThemeSpacing.md, zIndex: 10 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" placeholderTextColor={ThemeColors.textMuted} value={quantity} onChangeText={setQuantity} />
              </View>
              <View style={[styles.inputGroup, { flex: 2, zIndex: 10 }]}>
                <Text style={styles.label}>Reason</Text>
                <Dropdown
                  options={type === 'quarantine' ? QUARANTINE_REASONS : (adjustmentType === 'add' ? ADD_REASONS : REMOVE_REASONS)}
                  value={reason}
                  onChange={setReason}
                  placeholder="Select reason..."
                />
              </View>
            </View>
          </>
        );
      case 'replenish':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supplier</Text>
              <TextInput style={styles.input} placeholder="Select supplier..." placeholderTextColor={ThemeColors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Items to Order</Text>
              <TextInput style={styles.input} placeholder="Add items..." placeholderTextColor={ThemeColors.textMuted} />
            </View>
          </>
        );
      case 'count':
      default:
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location / Zone</Text>
            <TextInput style={styles.input} placeholder="e.g. Aisle 4, Warehouse B" placeholderTextColor={ThemeColors.textMuted} />
          </View>
        );
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, isMobile && styles.modalMobile]}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {renderFields()}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Optional notes..." 
                placeholderTextColor={ThemeColors.textMuted}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {error ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: ThemeColors.rose + '20', padding: 8, borderRadius: ThemeRadius.md, gap: 8 }}>
                <AlertCircle size={16} color={ThemeColors.rose} />
                <Text style={{ color: ThemeColors.rose, fontSize: 13 }}>{error}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
              <Save size={16} color={ThemeColors.white} style={{ marginRight: 8 }} />
              <Text weight="bold" style={styles.btnPrimaryText}>Submit</Text>
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
  inputGroup: {
    gap: ThemeSpacing.sm,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    backgroundColor: ThemeColors.emerald,
  },
  btnPrimaryText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
