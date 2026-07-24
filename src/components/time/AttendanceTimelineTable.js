import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { MoreHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

const MOCK_ATTENDANCE = [
  { id: '1', date: 'Today, Oct 24', timeIn: '09:00 AM', timeOut: '05:30 PM', status: 'Present', type: 'Regular', total: '8h 30m' },
  { id: '2', date: 'Wed, Oct 23', timeIn: '08:55 AM', timeOut: '05:00 PM', status: 'Present', type: 'Regular', total: '8h 05m' },
  { id: '3', date: 'Tue, Oct 22', timeIn: '09:15 AM', timeOut: '05:30 PM', status: 'Late', type: 'Regular', total: '8h 15m' },
  { id: '4', date: 'Mon, Oct 21', timeIn: '09:00 AM', timeOut: '01:00 PM', status: 'Half Day', type: 'Regular', total: '4h 00m' },
];

export function AttendanceTimelineTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Recent Activity</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text weight="semibold" style={[styles.headerCell, { width: 140 }]}>Date</Text>
            <Text weight="semibold" style={[styles.headerCell, { width: 200 }]}>Timeline (In - Out)</Text>
            <Text weight="semibold" style={[styles.headerCell, { width: 120 }]}>Status</Text>
            <Text weight="semibold" style={[styles.headerCell, { width: 100 }]}>Type</Text>
            <Text weight="semibold" style={[styles.headerCell, { width: 100, textAlign: 'right' }]}>Total</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Table Rows */}
          {MOCK_ATTENDANCE.map((row) => (
            <View key={row.id} style={styles.tableRow}>
              <Text weight="medium" style={[styles.cell, { width: 140 }]}>{row.date}</Text>
              
              <View style={[styles.timelineCell, { width: 200 }]}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{row.timeIn}</Text>
                  <View style={styles.timelineDotIn} />
                </View>
                <View style={styles.timelineConnector} />
                <View style={styles.timeBlock}>
                  <View style={styles.timelineDotOut} />
                  <Text style={styles.timeText}>{row.timeOut}</Text>
                </View>
              </View>

              <View style={{ width: 120 }}>
                <View style={[
                  styles.statusBadge,
                  row.status === 'Late' && styles.statusLate,
                  row.status === 'Half Day' && styles.statusHalf,
                ]}>
                  <Text weight="medium" style={[
                    styles.statusText,
                    row.status === 'Late' && styles.statusTextLate,
                    row.status === 'Half Day' && styles.statusTextHalf,
                  ]}>
                    {row.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cell, { width: 100, color: ThemeColors.textSecondary }]}>{row.type}</Text>
              
              <Text weight="bold" style={[styles.cell, { width: 100, textAlign: 'right' }]}>{row.total}</Text>
              
              <View style={{ width: 60, alignItems: 'center' }}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MoreHorizontal size={16} color={ThemeColors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        <Text style={styles.pageText}>Showing 1-4 of 24 entries</Text>
        <View style={styles.paginationRight}>
          <TouchableOpacity style={styles.pageBtn}>
            <ChevronLeft size={16} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pageBtn, styles.pageBtnActive]}>
            <Text weight="bold" style={styles.pageBtnTextActive}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pageBtn}>
            <Text style={styles.pageText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pageBtn}>
            <ChevronRight size={16} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  header: {
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  table: {
    minWidth: 720,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surfaceElevated,
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  headerCell: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
  },
  cell: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  timelineCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  timelineDotIn: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.emerald,
  },
  timelineDotOut: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
  },
  timelineConnector: {
    width: 24,
    height: 2,
    backgroundColor: ThemeColors.border,
    marginHorizontal: 4,
  },
  statusBadge: {
    backgroundColor: ThemeColors.emeraldDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: ThemeColors.emerald,
  },
  statusLate: {
    backgroundColor: ThemeColors.amberDim,
  },
  statusTextLate: {
    color: ThemeColors.amber,
  },
  statusHalf: {
    backgroundColor: ThemeColors.blueDim,
  },
  statusTextHalf: {
    color: ThemeColors.blue,
  },
  actionBtn: {
    padding: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  pageText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  paginationRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  pageBtnActive: {
    backgroundColor: ThemeColors.blue,
    borderColor: ThemeColors.blue,
  },
  pageBtnTextActive: {
    color: ThemeColors.surface,
    fontSize: 13,
  },
});
