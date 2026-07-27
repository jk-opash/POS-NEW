import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Bell, Menu, ScanLine, Search, ShoppingBag } from "lucide-react-native";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function POSHeader({
  isDesktop,
  onMenuPress,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onFilterChange,
  isRetail,
  isScannerConnected,
  onSimulateScan,
  onTakeawayOrdersPress,
  takeawayCount = 0,
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>POS Billing</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={24} color={ThemeColors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toolbarRow}>
        <View style={styles.dropdownsContainer}>
          <Dropdown
            style={styles.filterDropdown}
            options={categories.map((c) => ({ label: c, value: c }))}
            value={activeCategory}
            onChange={onFilterChange}
            placeholder="Category"
          />
        </View>

        <View style={styles.searchContainer}>
          <Search
            size={18}
            color={ThemeColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name, SKU or barcode..."
            placeholderTextColor={ThemeColors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        {isRetail && (
          <TouchableOpacity
            style={styles.barcodeScanBtn}
            onPress={onSimulateScan}
          >
            <ScanLine
              size={20}
              color={
                isScannerConnected ? ThemeColors.emerald : ThemeColors.primary
              }
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: ThemeColors.primary,
            paddingHorizontal: ThemeSpacing.md,
            paddingVertical: 10,
            borderRadius: ThemeRadius.md,
          }}
          onPress={onTakeawayOrdersPress}
        >
          <ShoppingBag size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Takeaway Orders
          </Text>
          {takeawayCount > 0 && (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 6,
              paddingHorizontal: 4,
            }}>
              <Text style={{ color: ThemeColors.primary, fontSize: 11, fontWeight: 'bold' }}>
                {takeawayCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
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
  barcodeScanBtn: {
    padding: 10,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 999,
  },
  dropdownsContainer: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
    width: 250, // Fixed width for category dropdown
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    height: 42,
    paddingHorizontal: ThemeSpacing.md,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  filterDropdown: {
    flex: 1,
    height: 42,
  },
});
