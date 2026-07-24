import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Check, ChevronDown, Search } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Text } from "./Text";

export function SearchWithFilter({
  searchQuery,
  onSearchChange,
  onSubmit,
  filterOptions = [],
  activeFilter,
  onFilterChange,
  placeholder = "Search...",
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const selectedOption = filterOptions.find(
    (opt) => opt.value === activeFilter,
  );
  const hasFilters = filterOptions.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Search
          size={18}
          color={ThemeColors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={ThemeColors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={onSubmit}
        />
        {hasFilters && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.8}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <Text
                style={[
                  styles.filterText,
                  !selectedOption && styles.placeholderText,
                ]}
              >
                {selectedOption ? selectedOption.label : "Filter"}
              </Text>
              <ChevronDown size={16} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {hasFilters && isDropdownVisible && (
        <Animated.View
          style={styles.dropdown}
          entering={FadeInUp.springify().damping(20).stiffness(400).mass(0.5)}
          exiting={FadeOutUp.duration(100)}
        >
          <View style={styles.dropdownHeader}>
            <Text weight="bold" style={styles.dropdownTitle}>
              Filter Options
            </Text>
          </View>
          <FlatList
            data={filterOptions}
            keyExtractor={(item) => item.value.toString()}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => {
                  onFilterChange(item.value);
                  setIsDropdownVisible(false);
                }}
              >
                <Text
                  weight={activeFilter === item.value ? "semibold" : "regular"}
                  style={[
                    styles.optionText,
                    activeFilter === item.value && styles.optionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
                {activeFilter === item.value && (
                  <Check size={16} color={ThemeColors.emerald} />
                )}
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    zIndex: 1000,
    elevation: 1000,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    height: 42,
    paddingHorizontal: ThemeSpacing.md,
    zIndex: 10,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: ThemeColors.border,
    marginHorizontal: ThemeSpacing.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    paddingVertical: ThemeSpacing.sm,
  },
  filterText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  placeholderText: {
    color: ThemeColors.textMuted,
  },
  dropdown: {
    position: "absolute",
    top: 52, // slightly below the input with more breathing room
    right: 0,
    width: 250,
    maxHeight: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    paddingVertical: ThemeSpacing.md,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 9999,
  },
  dropdownHeader: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    marginBottom: ThemeSpacing.sm,
  },
  dropdownTitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
  },
  optionText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  optionTextActive: {
    color: ThemeColors.emerald,
  },
});
