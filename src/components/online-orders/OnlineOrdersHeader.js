import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius } from '@/theme/theme';
import { CommonHeader } from '@/components/common/CommonHeader';

export function OnlineOrdersHeader({ isDesktop, newOrderCount }) {
  return (
    <CommonHeader
      title="Online Orders"
      titleRight={
        newOrderCount > 0 ? (
          <View style={styles.newBadge}>
            <Text weight="bold" style={styles.newBadgeText}>
              {newOrderCount} New
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  newBadge: {
    backgroundColor: ThemeColors.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    marginLeft: 8,
  },
  newBadgeText: {
    color: ThemeColors.white,
    fontSize: 12,
  },
});
