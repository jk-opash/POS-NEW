import { Text } from "@/components/ui/Text";
import { useStaff } from "@/context/StaffContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Building, Search, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DirectoryTab({ onEditEmployee }) {
  const { employees, deleteEmployee } = useStaff();
  const { isMobile, isMiniTab, isTablet, isDesktop } = useResponsive();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.status !== "Terminated" &&
      (emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleEdit = (employee) => {
    if (onEditEmployee) {
      onEditEmployee(employee);
    }
  };

  const handleDelete = (id) => {
    deleteEmployee(id);
  };

  const renderEmployeeCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => handleEdit(item)}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text weight="bold" style={styles.avatarText}>
            {item.firstName[0]}
            {item.lastName[0]}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoBlock}>
          <Text weight="bold" style={styles.nameText} numberOfLines={1}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.subText} numberOfLines={1}>
            {item.role}
          </Text>
          <View style={styles.metaRow}>
            <Building size={13} color={ThemeColors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.store}
            </Text>
          </View>
        </View>

        {/* Status + Actions */}
        <View style={styles.rightBlock}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "Active"
                    ? ThemeColors.emerald + "18"
                    : ThemeColors.amber + "18",
              },
            ]}
          >
            <Text
              weight="bold"
              style={[
                styles.statusText,
                {
                  color:
                    item.status === "Active"
                      ? ThemeColors.emerald
                      : ThemeColors.amber,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={15} color={ThemeColors.red} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>Directory</Text>
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

      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={renderEmployeeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  listContent: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: 100,
    gap: ThemeSpacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ThemeColors.blueDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    color: ThemeColors.blue,
  },
  infoBlock: {
    flex: 1,
    gap: 3,
  },
  nameText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  subText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  rightBlock: {
    alignItems: "flex-end",
    gap: ThemeSpacing.sm,
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: ThemeSpacing.sm,
    paddingVertical: 3,
    borderRadius: ThemeRadius.full,
  },
  statusText: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: ThemeRadius.sm,
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: ThemeColors.red + "10",
    borderColor: ThemeColors.red + "30",
  },
});
