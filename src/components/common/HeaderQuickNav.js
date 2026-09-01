import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { usePathname, useRouter } from "expo-router";
import { Home, LayoutGrid, Monitor, Wrench } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const NAV_ITEMS = [
  { key: "dashboard", path: "/", icon: Home, label: "Dash" },
  { key: "pos", path: "/pos", icon: Monitor, label: "POS" },
  { key: "tables", path: "/tables", icon: LayoutGrid, label: "Tables" },
  {
    key: "operations",
    path: "/operations",
    icon: Wrench,
    label: "Operations",
  },
];

export function HeaderQuickNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Highlight the current route if it matches
  const getIsActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = getIsActive(item.path);
        const color = isActive
          ? ThemeColors.primary || "#FF6B35"
          : ThemeColors.textSecondary || "#A0A0A0";

        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.navBtn, isActive && styles.navBtnActive]}
            onPress={() => router.push(item.path)}
            activeOpacity={0.7}
          >
            <item.icon
              size={20}
              color={color}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: ThemeSpacing.md,
    paddingRight: ThemeSpacing.md,
    borderRightWidth: 1,
    borderRightColor: ThemeColors.border || "#333333",
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  navBtnActive: {
    backgroundColor: `${ThemeColors.primary || "#FF6B35"}15`,
  },
});
