import { Text } from "@/components/ui/Text";
import { useStaff } from "@/context/StaffContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

export default function AttendanceTab() {
  const { attendanceLogs } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");

  const logs = attendanceLogs || [];

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.employeeName?.toLowerCase().includes(q) ||
      log.employeeId?.toLowerCase().includes(q) ||
      log.activity?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* ── Toolbar ── */}
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.searchContainer}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employee, activity..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={{ minWidth: 960, width: "100%" }}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.col, { width: 180 }]}>
              Employee
            </Text>
            <Text weight="bold" style={[styles.col, { width: 180 }]}>
              Date
            </Text>
            <Text weight="bold" style={[styles.col, { width: 160 }]}>
              In / Out
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { flex: 1, minWidth: 180 }]}
            >
              Activity
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 120, textAlign: "right" }]}
            >
              Total Work
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 120, textAlign: "right" }]}
            >
              Lunch Break
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 120, textAlign: "right" }]}
            >
              Short Break
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 100, textAlign: "right" }]}
            >
              Status
            </Text>
          </View>

          {/* Table Rows */}
          {filteredLogs.map((item) => {
            const isPresent = item.status === "Present";
            const [timeIn, timeOut] = item.inOut?.split(" -> ") ?? [
              item.inOut,
              null,
            ];

            return (
              <View key={item.id} style={styles.tableRow}>
                {/* Employee */}
                <View style={{ width: 180, justifyContent: "center" }}>
                  <Text weight="bold" style={styles.nameText} numberOfLines={1}>
                    {item.employeeName}
                  </Text>
                  <Text style={styles.subText}>{item.employeeId}</Text>
                </View>

                {/* Date */}
                <Text
                  style={[
                    styles.col,
                    { width: 180, color: ThemeColors.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {item.date ?? "—"}
                </Text>

                {/* In / Out */}
                <View style={{ width: 160, justifyContent: "center" }}>
                  {timeOut ? (
                    <Text style={styles.col}>
                      <Text weight="bold" style={{ color: ThemeColors.red }}>
                        {timeIn}
                      </Text>
                      <Text style={{ color: ThemeColors.textMuted }}> → </Text>
                      <Text weight="bold" style={{ color: ThemeColors.emerald }}>
                        {timeOut}
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      weight="bold"
                      style={[styles.col, { color: ThemeColors.textMuted }]}
                    >
                      {timeIn ?? "—"}
                    </Text>
                  )}
                </View>

                {/* Activity */}
                <Text
                  style={[
                    styles.col,
                    { flex: 1, minWidth: 180, color: ThemeColors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {item.activity ?? "—"}
                </Text>

                {/* Total Work */}
                <Text
                  weight="bold"
                  style={[styles.col, { width: 120, textAlign: "right" }]}
                >
                  {item.totalWork ?? "—"}
                </Text>

                {/* Lunch Break */}
                <Text
                  weight="bold"
                  style={[
                    styles.col,
                    {
                      width: 120,
                      textAlign: "right",
                      color: ThemeColors.textSecondary,
                    },
                  ]}
                >
                  {item.lunchBreak ?? "—"}
                </Text>

                {/* Short Break */}
                <Text
                  weight="bold"
                  style={[
                    styles.col,
                    { width: 120, textAlign: "right", color: ThemeColors.blue },
                  ]}
                >
                  {item.shortBreak ?? "—"}
                </Text>

                {/* Status Badge */}
                <View style={{ width: 100, alignItems: "flex-end" }}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: isPresent
                          ? ThemeColors.emerald + "20"
                          : ThemeColors.red + "20",
                      },
                    ]}
                  >
                    <Text
                      weight="bold"
                      style={[
                        styles.badgeText,
                        {
                          color: isPresent
                            ? ThemeColors.emerald
                            : ThemeColors.red,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ color: ThemeColors.textMuted }}>
                No attendance records found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: "row",
    marginVertical: ThemeSpacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  headerTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },

  // ── Table ────────────────────────────────────
  scrollView: {
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  nameText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
});
