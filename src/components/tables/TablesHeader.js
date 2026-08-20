import { CommonHeader } from "@/components/common/CommonHeader";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export function TablesHeader({
  isDesktop,
  isEditMode,
  setIsEditMode,
  floors,
  activeFloor,
  setActiveFloor,
  onMergePress,
}) {
  return (
    <CommonHeader
      title="Table View"
      bottomContent={
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
