import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

export function StaffFab({ activeTab, onPress }) {
  const getFabLabel = () => {
    switch (activeTab) {
      case "directory":
      case "shifts":
        return "Add Employee";
      default:
        return null;
    }
  };

  if (!getFabLabel()) return null;

  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={onPress}>
      <Plus size={20} color={ThemeColors.white} />
      <Text style={styles.fabText}>{getFabLabel()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: ThemeSpacing.xl,
    bottom: ThemeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: 100,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
