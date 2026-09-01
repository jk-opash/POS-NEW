import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Menu, Bell } from 'lucide-react-native';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { HeaderQuickNav } from '@/components/common/HeaderQuickNav';
import { useNavigation } from 'expo-router';

export function OnlineOrdersHeader({ isDesktop, newOrderCount }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity
              onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
              style={styles.menuBtn}
            >
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>Online Orders</Text>
          {newOrderCount > 0 && (
            <View style={styles.newBadge}>
              <Text weight="bold" style={styles.newBadgeText}>
                {newOrderCount} New
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <HeaderQuickNav />
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={24} color={ThemeColors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
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
  newBadge: {
    backgroundColor: ThemeColors.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
  },
  newBadgeText: {
    color: ThemeColors.white,
    fontSize: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  notifBtn: { position: "relative", padding: 4 },
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
});
