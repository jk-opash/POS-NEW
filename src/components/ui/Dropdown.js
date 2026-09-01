import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Platform, Pressable } from 'react-native';
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
  const headerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = useCallback(() => {
    if (headerRef.current) {
      // measureInWindow is more reliable on web than measure()
      const measureFn = headerRef.current.measureInWindow || headerRef.current.measure;
      if (headerRef.current.measureInWindow) {
        headerRef.current.measureInWindow((x, y, width, height) => {
          if (width > 0) {
            setDropdownPos({
              top: y + height + 4,
              left: x,
              width: width,
            });
          }
          setIsOpen(true);
        });
      } else {
        headerRef.current.measure((fx, fy, width, height, px, py) => {
          if (width > 0) {
            setDropdownPos({
              top: py + height + 4,
              left: px,
              width: width,
            });
          }
          setIsOpen(true);
        });
      }
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleSelect = useCallback((itemValue) => {
    onChange(itemValue);
    setIsOpen(false);
  }, [onChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

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
        onRequestClose={handleClose}
      >
        {/* Backdrop: closes the dropdown when tapped */}
        <Pressable
          style={styles.modalOverlay}
          onPress={handleClose}
        >
          {/* 
            Stop propagation so taps inside the list don't bubble
            to the backdrop and close the modal prematurely.
          */}
          <Pressable
            style={[
              styles.dropdownContainer,
              {
                position: 'absolute',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width > 0 ? dropdownPos.width : '80%',
              }
            ]}
            // This inner Pressable catches taps so they don't reach the backdrop
            onPress={(e) => e.stopPropagation && e.stopPropagation()}
          >
            <View style={styles.dropdownList}>
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected
                      ]}
                      onPress={() => handleSelect(item.value)}
                      activeOpacity={0.6}
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
          </Pressable>
        </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dropdownContainer: {
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: 'hidden',
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
