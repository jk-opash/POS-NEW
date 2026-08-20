import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { CommonHeader } from "@/components/common/CommonHeader";
import { Search, ChevronDown, Plus } from "lucide-react-native";

export function SupplierHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onAddSupplier,
}) {
  const statuses = ["All Statuses", "Active", "Blocked", "Archived"];

  return (
    <CommonHeader
      title="Suppliers Hub"
      subtitle="Manage your vendors, contacts, and supply chain."
      bottomContent={
        <View style={styles.toolbarRow}>
          <View style={styles.filtersContainer}>
            {/* Search Input */}
            <View style={styles.searchBox}>
              <Search size={16} color={ThemeColors.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search suppliers..."
                placeholderTextColor={ThemeColors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Status Filter Dummy Button (Would ideally open an ActionSheet or simple Modal) */}
            <TouchableOpacity 
              style={styles.statusDropdown}
              onPress={() => {
                // Simple cycle for now to replicate select box behavior on React Native without heavy libraries
                const currentIndex = statuses.indexOf(statusFilter === "all" ? "All Statuses" : statusFilter);
                const nextIndex = (currentIndex + 1) % statuses.length;
                const nextStatus = statuses[nextIndex];
                setStatusFilter(nextStatus === "All Statuses" ? "all" : nextStatus);
              }}
            >
              <Text style={styles.statusText}>{statusFilter === "all" ? "All Statuses" : statusFilter}</Text>
              <ChevronDown size={14} color={ThemeColors.textMuted} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={onAddSupplier}>
            <Plus size={16} color={ThemeColors.white} />
            <Text weight="bold" style={styles.addButtonText}>Add Supplier</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    flex: 1,
    minWidth: 250,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: 12,
    flex: 1,
    maxWidth: 300,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    height: "100%",
  },
  statusDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: 12,
    height: 36,
    minWidth: 120,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.textPrimary, // Slate 900
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThemeRadius.md,
    gap: 8,
  },
  addButtonText: {
    color: ThemeColors.white,
    fontSize: 13,
  },
});
