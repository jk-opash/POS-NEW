import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Search, CheckCircle2 } from 'lucide-react-native';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { useStaff } from '@/context/StaffContext';

export function EmployeeSelectionModal({ visible, onClose, onSelect, selectedEmployeeId }) {
  const { employees } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter((emp) =>
    (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Assign Staff to Service</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={ThemeColors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search staff members..."
              placeholderTextColor={ThemeColors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmployeeId === emp.id;
              return (
                <TouchableOpacity
                  key={emp.id}
                  style={[styles.employeeCard, isSelected && styles.employeeCardSelected]}
                  onPress={() => {
                    onSelect(emp);
                    onClose();
                  }}
                >
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{emp.firstName} {emp.lastName}</Text>
                    <Text style={styles.employeeRole}>{emp.role}</Text>
                  </View>
                  {isSelected && (
                    <CheckCircle2 size={24} color={ThemeColors.emerald} />
                  )}
                </TouchableOpacity>
              );
            })}
            
            <TouchableOpacity
              style={styles.employeeCard}
              onPress={() => {
                onSelect(null);
                onClose();
              }}
            >
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>None / Unassign</Text>
                <Text style={styles.employeeRole}>Remove assigned staff</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
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
  container: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
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
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: ThemeSpacing.xl,
    paddingHorizontal: ThemeSpacing.md,
    height: 48,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: ThemeColors.textPrimary,
  },
  list: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.xl,
    gap: ThemeSpacing.sm,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
  },
  employeeCardSelected: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emerald + '10',
  },
  employeeInfo: {
    gap: 4,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemeColors.textPrimary,
  },
  employeeRole: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  }
});
