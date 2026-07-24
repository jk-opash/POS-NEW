import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Check, Edit2, Menu } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function TablesHeader({
  isDesktop,
  isEditMode,
  setIsEditMode,
  floors,
  activeFloor,
  setActiveFloor,
  onMergePress,
}) {
  const navigation = useNavigation();

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
          <Text style={styles.pageTitle}>Table View</Text>
        </View>

        <View style={styles.headerRight}>
            {!isEditMode && (
              <TouchableOpacity
                style={styles.mergeActionBtn}
                onPress={onMergePress}
                activeOpacity={0.8}
              >
                <Text style={styles.mergeActionBtnText}>Merge Tables</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      <View style={styles.toolbarRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.floorTabs}
        >
          {floors.map((floor) => {
            const isActive = activeFloor === floor.id;
            return (
              <TouchableOpacity
                key={floor.id}
                onPress={() => setActiveFloor(floor.id)}
                style={[styles.floorTab, isActive && styles.floorTabActive]}
              >
                <Text
                  weight={isActive ? "bold" : "medium"}
                  style={[
                    styles.floorTabText,
                    isActive && styles.floorTabTextActive,
                  ]}
                >
                  {floor.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
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
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  menuBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
    borderRadius: 100,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  editBtnActive: {
    backgroundColor: ThemeColors.emerald,
    shadowColor: ThemeColors.emerald,
    shadowOpacity: 0.35,
  },
  editBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  mergeActionBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.full,
    marginLeft: ThemeSpacing.md,
  },
  mergeActionBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  floorTabs: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
    paddingBottom: ThemeSpacing.xs,
  },
  floorTab: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  floorTabActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },
  floorTabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  floorTabTextActive: {
    color: ThemeColors.white,
  },
});
