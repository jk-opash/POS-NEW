import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import {
  deleteTeamMember,
  updateTeamMember,
} from "@/store/slices/teamMemberSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search, Users } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { EmployeeListItem } from "../EmployeeListItem";

export default function DirectoryTab({ onEditEmployee }) {
  const dispatch = useDispatch();
  const { teamMembers: employees } = useSelector((state) => state.teamMember);
  const { user } = useSelector((state) => state.auth);
  const { isMobile, isDesktop } = useResponsive();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    // Exclude terminated staff
    if (emp.status === "Terminated") return false;

    // Filter by branch if user is tied to a specific branch
    if (user?.branch_id) {
      const empBranchId = emp.branch_id || emp.branch?.id || emp.branch?._id;
      if (empBranchId !== user.branch_id) return false;
    }

    // Search query
    const query = searchQuery.toLowerCase();
    if (query) {
      return (
        emp.first_name?.toLowerCase().includes(query) ||
        emp.last_name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        (emp.id || emp._id)?.toString().toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleEdit = (employee) => {
    if (onEditEmployee) {
      onEditEmployee(employee);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTeamMember(id));
  };

  const handleToggleStatus = (employee) => {
    const isAvailable = employee.status === "Active" || employee.active;
    dispatch(
      updateTeamMember({
        id: employee.id,
        data: { status: isAvailable ? "Inactive" : "Active" },
      }),
    );
  };

  const renderDesktopHeader = () => {
    return (
      <View style={styles.tableHeaderRow}>
        <View style={[styles.headerCell, { flex: 1 }]}>
          <Text style={styles.headerText}>Member Name</Text>
        </View>
        <View style={[styles.headerCell, { flex: 1 }]}>
          <Text style={styles.headerText}>Role</Text>
        </View>

        <View style={[styles.headerCell, { flex: 1 }]}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        <View
          style={[
            styles.headerCell,
            { flex: 1, alignItems: "flex-end", paddingRight: 24 },
          ]}
        >
          <Text style={styles.headerText}>Actions</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No staff members added to this business yet.
      </Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.tabHeader}>
      <View style={styles.titleRow}>
        <Users size={20} color={ThemeColors.primary} />
        <Text style={styles.headerTitle}>
          Team Members ({employees.length})
        </Text>
      </View>

      <View style={styles.headerRight}>
        <View style={styles.searchContainer}>
          <Search
            size={16}
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.tableContainer]}>
        <ListHeader />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        >
          <FlatList
            data={filteredEmployees}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderDesktopHeader}
            renderItem={({ item }) => (
              <EmployeeListItem
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                isMobile={false}
              />
            )}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  tableContainer: {
    margin: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  tableContainerMobile: {
    margin: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    flex: 1,
    justifyContent: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceHighlight,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    flex: 1,
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    borderRadius: ThemeRadius.sm,
    gap: 6,
  },
  addBtnText: {
    color: ThemeColors.surface,
    fontSize: 13,
  },
  tableHeaderRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surfaceHighlight + "50",
  },
  headerCell: {
    paddingHorizontal: ThemeSpacing.sm,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: ThemeColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContentDesktop: {
    paddingBottom: 80,
  },
  listContentMobile: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
});
