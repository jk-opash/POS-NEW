import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LiveShiftCard } from './LiveShiftCard';
import { MonthlyInsights } from './MonthlyInsights';
import { AttendanceTimelineTable } from './AttendanceTimelineTable';
import { ThemeSpacing } from '@/theme/theme';

export function AttendanceTab() {
  return (
    <View style={styles.container}>
      <LiveShiftCard />
      <View style={styles.gap} />
      <MonthlyInsights />
      <View style={styles.gap} />
      <AttendanceTimelineTable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gap: {
    height: ThemeSpacing.xxl,
  },
});

