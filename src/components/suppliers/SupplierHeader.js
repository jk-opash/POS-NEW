import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Menu, Bell } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchWithFilter } from "@/components/ui/SearchWithFilter";

export function SupplierHeader({
  isDesktop,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  categories,
}) {
  const navigation = useNavigation();

  // Map categories to { label, value } for SearchWithFilter
  const filterOptions = categories.map(cat => ({ label: cat, value: cat }));

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
          <Text style={styles.pageTitle}>Supplier Management</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={20} color={ThemeColors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toolbarRow}>
        <SearchWithFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={filterOptions}
          activeFilter={filterCategory}
          onFilterChange={setFilterCategory}
          placeholder="Search suppliers..."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
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
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 1000,
    elevation: 50,
  },
});
