import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { hasPermission } from "@/utils/permissions";
import { usePathname, useRouter } from "expo-router";
import {
  Home,
  LayoutGrid,
  Monitor,
  MonitorPlay,
  ReceiptText,
  UtensilsCrossed,
  Wrench,
} from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const NAV_ITEMS = [
  { key: "dashboard", path: "/", icon: Home, label: "Dash" },
  { key: "tables", path: "/tables", icon: LayoutGrid, label: "Tables" },
  { key: "pos", path: "/pos", icon: Monitor, label: "POS" },
  { key: "kds", path: "/kds", icon: MonitorPlay, label: "KDS" },
  { key: "waiter", path: "/waiter", icon: UtensilsCrossed, label: "Waiter" },
  { key: "invoices", path: "/invoices", icon: ReceiptText, label: "invoices" },
  { key: "operations", path: "/operations", icon: Wrench, label: "Operations" },
];

export function HeaderQuickNav() {
  const router = useRouter();
  const pathname = usePathname();
  const authUser = useSelector((state) => state.auth.user);

  // Highlight the current route if it matches
  const getIsActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {NAV_ITEMS.filter((item) => hasPermission(authUser, item.key)).map(
        (item) => {
          const isActive = getIsActive(item.path);
          const color = isActive
            ? ThemeColors.accent
            : ThemeColors.textSecondary;

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
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: ThemeSpacing.md,
    paddingRight: ThemeSpacing.md,
    borderRightWidth: 1,
    borderRightColor: ThemeColors.borderSubtle,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    ...(Platform.OS === "web" ? { transition: "all 0.2s ease" } : {}),
  },
  navBtnActive: {
    backgroundColor: ThemeColors.accentDim,
    borderColor: ThemeColors.accent + "40",
    ...(Platform.OS === "web"
      ? { boxShadow: `0 2px 8px ${ThemeColors.accent}20` }
      : {
          shadowColor: ThemeColors.accent,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }),
  },
});
