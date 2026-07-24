import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { Menu, Calendar, ChevronDown, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.menuBtn}
            >
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>Reports & Analytics</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={ThemeColors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation & Date Selector */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  notifBtn: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },
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
