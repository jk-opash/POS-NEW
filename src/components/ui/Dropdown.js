import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { ChevronDown, Check } from 'lucide-react-native';

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  style
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const headerRef = React.useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    if (headerRef.current) {
      headerRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPos({
          top: py + height + 4,
          left: px,
          width: width,
        });
        setIsOpen(true);
      });
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        ref={headerRef}
        style={[styles.dropdownHeader, style]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[styles.headerText, !selectedOption && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={16} color={ThemeColors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.dropdownContainer,
              {
                position: 'absolute',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
              }
            ]}
          >
            <View style={styles.dropdownList}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        setIsOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={ThemeColors.emerald} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    height: 38,
  },
  headerText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  placeholderText: {
    color: ThemeColors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: 'hidden',
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  optionItemSelected: {
    backgroundColor: ThemeColors.emeraldDim,
  },
  optionText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: ThemeColors.emerald,
  },
});
