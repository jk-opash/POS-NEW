import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { CommonHeader } from '@/components/common/CommonHeader';

export function ReportsHeader({ 
  isDesktop, 
  onMenuPress, 
  selectedRangeLabel, 
  onDatePickerPress,
  tabs,
  activeTab,
  onTabChange
}) {
  return (
    <CommonHeader
      title="Reports & Analytics"
      bottomContent={
        <View style={styles.toolbarRow}>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={onDatePickerPress}
          >
            <Calendar size={16} color={ThemeColors.textMuted} />
            <Text style={styles.dateSelectorText}>{selectedRangeLabel}</Text>
            <ChevronDown size={16} color={ThemeColors.textMuted} />
          </TouchableOpacity>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => onTabChange(tab.key)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    paddingHorizontal: ThemeSpacing.md,
    height: 40,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  dateSelectorText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  tabsScroll: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    paddingRight: ThemeSpacing.xxl,
  },
  tabBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  tabBtnActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  tabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  tabTextActive: {
    color: ThemeColors.white,
  },
});
