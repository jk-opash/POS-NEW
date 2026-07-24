import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { useSuppliers } from '@/context/SupplierContext';
import { X, Check } from 'lucide-react-native';

export function SupplierFormModal({ visible, onClose }) {
  const { addSupplier } = useSuppliers();
  
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    category: 'Manufacturer',
    regNumber: '',
    contactPerson: '',
    mobile: '',
    officeNumber: '',
    email: '',
    website: '',
    gst: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    paymentTerms: '',
    creditLimit: '',
  });

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.businessName) {
      alert("Name and Business Name are required.");
      return;
    }

    addSupplier({
      name: formData.name,
      businessName: formData.businessName,
      category: formData.category,
      registrationNumber: formData.regNumber,
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      contact: {
        person: formData.contactPerson,
        mobile: formData.mobile,
        office: formData.officeNumber,
        email: formData.email,
        website: formData.website,
      },
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      tax: { gst: formData.gst },
      financial: {
        paymentTerms: formData.paymentTerms,
        creditLimit: parseFloat(formData.creditLimit) || 0,
      },
      banking: {},
      performance: { deliveryScore: 0, qualityScore: 0, pricingScore: 0, overallRating: 0, riskLevel: 'Medium' },
      stats: { totalOrders: 0, totalSpend: 0, outstandingBalance: 0, lastOrderDate: 'N/A', avgDeliveryTime: 'N/A', returnRate: '0%' },
      products: [],
      contracts: {},
      communications: []
    });
    
    // Reset and close
    setFormData({
      name: '', businessName: '', category: 'Manufacturer', regNumber: '',
      contactPerson: '', mobile: '', officeNumber: '', email: '', website: '', gst: '',
      addressLine1: '', city: '', state: '', zip: '', country: '',
      paymentTerms: '', creditLimit: ''
    });
    onClose();
  };

  const categories = ["Manufacturer", "Distributor", "Wholesaler", "Service Provider"];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>New Supplier</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: ThemeSpacing.xxl }}>
            {/* Basic Info */}
            <View style={styles.section}>
              <Text weight="bold" style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Supplier Display Name *</Text>
                <TextInput style={styles.input} placeholder="e.g. Fresh Farms" placeholderTextColor={ThemeColors.textMuted} value={formData.name} onChangeText={t => handleChange('name', t)} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Legal Business Name *</Text>
                <TextInput style={styles.input} placeholder="e.g. Fresh Farms Agriculture LLC" placeholderTextColor={ThemeColors.textMuted} value={formData.businessName} onChangeText={t => handleChange('businessName', t)} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Company Registration No.</Text>
                <TextInput style={styles.input} placeholder="e.g. CIN123456" placeholderTextColor={ThemeColors.textMuted} value={formData.regNumber} onChangeText={t => handleChange('regNumber', t)} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ThemeSpacing.sm, marginTop: ThemeSpacing.sm }}>
                  {categories.map(cat => (
                    <TouchableOpacity key={cat} style={[styles.catChip, formData.category === cat && styles.catChipActive]} onPress={() => handleChange('category', cat)}>
                      <Text style={{ color: formData.category === cat ? ThemeColors.emerald : ThemeColors.textSecondary }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.section}>
              <Text weight="bold" style={styles.sectionTitle}>Contact Details</Text>
              <View style={{ flexDirection: 'row', gap: ThemeSpacing.md }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Contact Person</Text>
                  <TextInput style={styles.input} value={formData.contactPerson} onChangeText={t => handleChange('contactPerson', t)} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput style={styles.input} keyboardType="phone-pad" value={formData.mobile} onChangeText={t => handleChange('mobile', t)} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: ThemeSpacing.md }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput style={styles.input} keyboardType="email-address" value={formData.email} onChangeText={t => handleChange('email', t)} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Website</Text>
                  <TextInput style={styles.input} value={formData.website} onChangeText={t => handleChange('website', t)} />
                </View>
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text weight="bold" style={styles.sectionTitle}>Address Information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Complete Address Line</Text>
                <TextInput style={styles.input} placeholder="123 Farm Road..." placeholderTextColor={ThemeColors.textMuted} value={formData.addressLine1} onChangeText={t => handleChange('addressLine1', t)} />
              </View>
              <View style={{ flexDirection: 'row', gap: ThemeSpacing.md }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput style={styles.input} value={formData.city} onChangeText={t => handleChange('city', t)} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput style={styles.input} value={formData.state} onChangeText={t => handleChange('state', t)} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: ThemeSpacing.md }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Postal Code</Text>
                  <TextInput style={styles.input} value={formData.zip} onChangeText={t => handleChange('zip', t)} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput style={styles.input} value={formData.country} onChangeText={t => handleChange('country', t)} />
                </View>
              </View>
            </View>

            {/* Financial Details */}
            <View style={styles.section}>
              <Text weight="bold" style={styles.sectionTitle}>Financial & Tax Information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>GST / VAT No</Text>
                <TextInput style={styles.input} value={formData.gst} onChangeText={t => handleChange('gst', t)} />
              </View>
              <View style={{ flexDirection: 'row', gap: ThemeSpacing.md }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Payment Terms</Text>
                  <TextInput style={styles.input} placeholder="e.g. Net 30, Immediate" placeholderTextColor={ThemeColors.textMuted} value={formData.paymentTerms} onChangeText={t => handleChange('paymentTerms', t)} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Credit Limit (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={formData.creditLimit} onChangeText={t => handleChange('creditLimit', t)} />
                </View>
              </View>
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: ThemeColors.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Check size={18} color={ThemeColors.surface} />
              <Text weight="bold" style={{ color: ThemeColors.surface }}>Save Supplier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: ThemeSpacing.xl },
  modalContainer: { width: '100%', maxWidth: 700, backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, maxHeight: '90%', overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: ThemeSpacing.xl, borderBottomWidth: 1, borderBottomColor: ThemeColors.border },
  title: { fontSize: 20, color: ThemeColors.textPrimary },
  body: { padding: ThemeSpacing.xl },
  section: { marginBottom: ThemeSpacing.xxl },
  sectionTitle: { fontSize: 16, color: ThemeColors.textPrimary, marginBottom: ThemeSpacing.lg, paddingBottom: ThemeSpacing.sm, borderBottomWidth: 1, borderBottomColor: ThemeColors.borderSubtle },
  inputGroup: { marginBottom: ThemeSpacing.md },
  label: { color: ThemeColors.textSecondary, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: ThemeColors.bg, borderWidth: 1, borderColor: ThemeColors.borderSubtle, borderRadius: ThemeRadius.md, paddingHorizontal: ThemeSpacing.md, height: 44, color: ThemeColors.textPrimary, fontSize: 15 },
  catChip: { paddingHorizontal: ThemeSpacing.lg, paddingVertical: ThemeSpacing.sm, borderRadius: ThemeRadius.full, borderWidth: 1, borderColor: ThemeColors.borderSubtle, backgroundColor: ThemeColors.bg },
  catChipActive: { borderColor: ThemeColors.emerald, backgroundColor: ThemeColors.emeraldDim },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: ThemeSpacing.md, padding: ThemeSpacing.xl, borderTopWidth: 1, borderTopColor: ThemeColors.border },
  cancelBtn: { paddingHorizontal: ThemeSpacing.xl, paddingVertical: ThemeSpacing.md },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: ThemeSpacing.sm, backgroundColor: ThemeColors.emerald, paddingHorizontal: ThemeSpacing.xl, paddingVertical: ThemeSpacing.md, borderRadius: ThemeRadius.md }
});
