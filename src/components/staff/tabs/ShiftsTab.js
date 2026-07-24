import { Text } from "@/components/ui/Text";
import { useStaff } from "@/context/StaffContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SHIFT_TYPES = [
  {
    id: "Morning",
    label: "Morning",
    time: "08:00 AM - 04:00 PM",
    color: ThemeColors.emerald,
  },
  {
    id: "Evening",
    label: "Evening",
    time: "04:00 PM - 12:00 AM",
    color: ThemeColors.blue,
  },
  {
    id: "Night",
    label: "Night",
    time: "12:00 AM - 08:00 AM",
    color: ThemeColors.amber,
  },
];

export default function ShiftsTab() {
  const { employees, shifts, assignShift } = useStaff();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.status !== "Terminated" &&
      (emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getAssignedShift = (employeeId) => {
    const assigned = shifts.find((s) => s.employeeId === employeeId);
    return assigned ? assigned.shift : "Unassigned";
  };

  return (
    <View style={styles.container}>
      {/* ── Toolbar ── */}
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>Shifts</Text>
        <View style={styles.searchContainer}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* ── Table ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={{ minWidth: 820, width: "100%" }}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.col, { width: 200 }]}>
              Employee
            </Text>
            <Text weight="bold" style={[styles.col, { width: 160 }]}>
              Role
            </Text>
            <Text weight="bold" style={[styles.col, { width: 140 }]}>
              Store
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { flex: 1, minWidth: 260 }]}
            >
              Assigned Shift
            </Text>
          </View>

          {/* Table Rows */}
          {filteredEmployees.map((item) => {
            const assignedShift = getAssignedShift(item.id);
            const assignedBase = assignedShift.split(" ")[0];

            return (
              <View key={item.id} style={styles.tableRow}>
                {/* Employee */}
                <View style={{ width: 200, justifyContent: "center" }}>
                  <Text weight="bold" style={styles.nameText} numberOfLines={1}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.subText}>{item.id}</Text>
                </View>

                {/* Role */}
                <Text style={[styles.col, { width: 160 }]} numberOfLines={1}>
                  {item.role}
                </Text>

                {/* Store */}
                <Text
                  style={[
                    styles.col,
                    { width: 140, color: ThemeColors.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {item.store}
                </Text>

                {/* Shift Buttons */}
                <View
                  style={{
                    flex: 1,
                    minWidth: 260,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: ThemeSpacing.sm,
                  }}
                >
                  {SHIFT_TYPES.map((shift) => {
                    const isActive = assignedBase === shift.id;
                    return (
                      <TouchableOpacity
                        key={shift.id}
                        style={[
                          styles.shiftBtn,
                          isActive && {
                            backgroundColor: shift.color,
                            borderColor: shift.color,
                          },
                        ]}
                        onPress={() =>
                          assignShift(item.id, `${shift.id} (${shift.time})`)
                        }
                      >
                        <Text
                          weight={isActive ? "bold" : "medium"}
                          style={[
                            styles.shiftBtnText,
                            isActive && { color: ThemeColors.white },
                          ]}
                        >
                          {shift.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ color: ThemeColors.textMuted }}>
                No employees found.
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
    marginVertical: ThemeSpacing.lg,
    flexDirection: "row",
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

  // ── Shift Buttons ─────────────────────────────
  shiftBtn: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.bg,
  },
  shiftBtnText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },

  // ── Empty State ──────────────────────────────
  empty: {
    padding: 40,
    alignItems: "center",
  },
});
