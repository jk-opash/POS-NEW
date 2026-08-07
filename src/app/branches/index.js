import { BranchCard } from "@/components/branches/BranchCard";
import { BranchDetailsModal } from "@/components/branches/BranchDetailsModal";
import { BranchFormModal } from "@/components/branches/BranchFormModal";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { BranchMetrics } from "@/components/branches/BranchMetrics";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const { branches, addBranch, updateBranch } = useBranches();
  const { isDesktop, isTablet, isMiniTab, isWebDesktop } = useResponsive();

  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === "Active").length;
  const totalRevenue = branches.reduce(
    (sum, b) => sum + (b.metrics?.revenue || 0),
    0,
  );

  const renderHeader = () => (
    <BranchMetrics
      totalBranches={totalBranches}
      activeBranches={activeBranches}
      totalRevenue={totalRevenue}
    />
  );

  const renderBranchCard = ({ item }) => (
    <BranchCard
      item={item}
      onPress={() => {
        setSelectedBranch(item);
        setIsDetailsVisible(true);
      }}
      onEdit={() => {
        setSelectedBranch(item);
        setIsFormVisible(true);
      }}
    />
  );

  return (
    <View style={styles.root}>
      <BranchHeader
        isDesktop={isWebDesktop}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <FlatList
        data={filteredBranches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranchCard}
        ListHeaderComponent={renderHeader}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedBranch(null);
          setIsFormVisible(true);
        }}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>Add Branch</Text>
      </TouchableOpacity>
      <BranchFormModal
        visible={isFormVisible}
        initialData={selectedBranch}
        onClose={() => setIsFormVisible(false)}
        onSubmit={(data) => {
          if (selectedBranch) {
            updateBranch(selectedBranch.id, data);
          } else {
            addBranch(data);
          }
          setIsFormVisible(false);
        }}
      />
      <BranchDetailsModal
        visible={isDetailsVisible}
        branch={selectedBranch}
        onClose={() => setIsDetailsVisible(false)}
        onEdit={() => {
          setIsDetailsVisible(false);
          setTimeout(() => { setIsFormVisible(true); }, 400);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 100,
    gap: ThemeSpacing.md,
  },
  columnWrapper: { gap: ThemeSpacing.md },
  fab: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: ThemeRadius.full,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
