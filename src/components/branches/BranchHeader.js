import { ThemeSpacing } from "@/theme/theme";
import { StyleSheet, View } from "react-native";
import { SearchWithFilter } from "@/components/ui/SearchWithFilter";
import { CommonHeader } from "@/components/common/CommonHeader";

export function BranchHeader({
  isDesktop,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <CommonHeader
      title="Branch Management"
      bottomContent={
        <View style={styles.toolbarRow}>
          <SearchWithFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search branches..."
          />
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
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 1000,
    elevation: 50,
  },
});
