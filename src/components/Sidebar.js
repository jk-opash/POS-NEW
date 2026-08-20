import { Text } from "@/components/ui/Text";
import { logoutUser } from "@/store/slices/authSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { hasPermission } from "@/utils/permissions";
import { usePathname, useRouter } from "expo-router";
import {
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MonitorPlay,
  Receipt,
  Settings,
  Store,
  UtensilsCrossed,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

// ── Petpooja-style grouped menu structure ────────────────────────────────────
const MENU_SECTIONS = [
  {
    title: null,
    items: [
      { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
      { key: "tables", label: "Tables", Icon: LayoutGrid },
      { key: "pos", label: "POS Billing", Icon: Store },
    ],
  },
  {
    title: "KITCHEN",
    items: [
      // {
      //   key: "online-orders",
      //   label: "Online Orders",
      //   Icon: Smartphone,
      // },
      { key: "kds", label: "KOT / KDS", Icon: MonitorPlay },
      { key: "waiter", label: "Waiter / Serve", Icon: UtensilsCrossed },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { key: "invoices", label: "Invoices", Icon: Receipt },
      { key: "operations", label: "Operations", Icon: LayoutGrid },
    ],
  },
  /*
  {
    title: "BUSINESS",
    items: [
      { key: "crm", label: "CRM & Loyalty", Icon: Heart },
      { key: "reports", label: "Reports", Icon: PieChart },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { key: "time", label: "Time Tracker", Icon: Clock },
    ],
  },
  */
];

// Flat list of all keys for collapsed view
const ALL_ITEMS = MENU_SECTIONS.flatMap((s) => s.items);

export function Sidebar({ isCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { branches, activeBranch } = useSelector((state) => state.branch);
  const [showBranchModal, setShowBranchModal] = useState(false);

  const routeMap = {
    dashboard: "/",
    tables: "/tables",
    time: "/time",
    orders: "/orders",
    customers: "/customers",
    menu: "/menu",
    kds: "/kds",
    waiter: "/waiter",
    inventory: "/inventory",
    invoices: "/invoices",
    expenses: "/expenses",
    staff: "/staff",
    pos: "/pos",
    suppliers: "/suppliers",
    branches: "/branches",
    reports: "/reports",
    settings: "/settings",
    support: "/support",
    recipes: "/recipes",
    "online-orders": "/online-orders",
    "tables-qr": "/tables-qr",
    crm: "/crm",
    feedback: "/feedback",
    "day-end": "/day-end",
    operations: "/operations",
    "audit-logs": "/logs",
  };

  const getActiveKey = () => {
    if (!pathname || pathname === "/" || pathname === "/index")
      return "dashboard";
    // Use exact match first to avoid prefix collisions
    const exactMap = {
      "/": "dashboard",
      "/tables": "tables",
      "/pos": "pos",
      "/kds": "kds",
      "/waiter": "waiter",
      "/menu": "menu",
      "/invoices": "invoices",
      "/expenses": "expenses",
      "/qr-ordering": "qr-ordering",
      "/online-orders": "online-orders",
      "/inventory": "inventory",
      "/staff": "staff",
      "/suppliers": "suppliers",
      "/branches": "branches",
      "/reports": "reports",
      "/settings": "settings",
      "/support": "support",
      "/recipes": "recipes",
      "/crm": "crm",
      "/feedback": "feedback",
      "/day-end": "day-end",
      "/operations": "operations",
      "/time": "time",
      "/orders": "orders",
      "/logs": "audit-logs",
    };
    for (const [prefix, key] of Object.entries(exactMap)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) return key;
    }
    return "dashboard";
  };

  const activeItem = getActiveKey();

  const currentBranchObj = branches.find((b) => b.id === activeBranch);

  // Extract proper branch name from user profile or fall back to selected branch
  const branchName =
    authUser?.branch_name ||
    authUser?.businesses?.[0]?.branches?.[0]?.name ||
    currentBranchObj?.name;

  const handleNavigate = (key) => {
    const route = routeMap[key] || "/tables";
    router.replace(route);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/login");
  };

  // ── Render a single menu item ─────────────────────────────────────
  const renderItem = (item, isActive) => {
    if (!hasPermission(authUser, item.key)) return null;

    return (
      <TouchableOpacity
        key={item.key}
        style={[
          styles.menuItem,
          isActive && styles.menuItemActive,
          isCollapsed && styles.menuItemCollapsed,
        ]}
        onPress={() => handleNavigate(item.key)}
        activeOpacity={0.7}
      >
        <item.Icon
          size={20}
          color={isActive ? ThemeColors.accent : ThemeColors.textMuted}
          strokeWidth={isActive ? 2.5 : 2}
        />
        {!isCollapsed && (
          <Text
            weight={isActive ? "bold" : "medium"}
            style={[styles.menuLabel, isActive && styles.menuLabelActive]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        )}
        {/* Badge for online orders */}
        {item.badge && !isCollapsed && (
          <View style={styles.badgeContainer}>
            <Text weight="bold" style={styles.badgeText}>
              3
            </Text>
          </View>
        )}
        {isActive && !item.badge && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, isCollapsed && styles.containerCollapsed]}
    >
      {/* ── Brand ───────────────────────────────── */}
      <View style={styles.brandSection}>
        {!isCollapsed && (
          <View style={styles.brandTextContainer}>
            <Text weight="bold" style={styles.brandName} numberOfLines={1}>
              POS MANAGER
            </Text>
            <Text style={styles.brandTagline} numberOfLines={1}>
              Restaurant POS
            </Text>
          </View>
        )}
      </View>

      {/* ── Scrollable Menu ─────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuScrollContent}
      >
        {isCollapsed
          ? ALL_ITEMS.map((item) => renderItem(item, activeItem === item.key))
          : MENU_SECTIONS.map((section, sIndex) => (
              <View key={sIndex} style={styles.section}>
                {section.title && (
                  <Text weight="bold" style={styles.sectionTitle}>
                    {section.title}
                  </Text>
                )}
                {section.items.map((item) =>
                  renderItem(item, activeItem === item.key),
                )}
              </View>
            ))}
      </ScrollView>

      {/* ── User & Branch Profile ─────────────────────── */}
      <TouchableOpacity
        style={[
          styles.branchIndicator,
          isCollapsed && styles.branchIndicatorCollapsed,
        ]}
        onPress={() => {
          if (authUser?.role === "admin" || authUser?.role === "superadmin") {
            setShowBranchModal(true);
          }
        }}
        activeOpacity={0.7}
        disabled={
          !(authUser?.role === "admin" || authUser?.role === "superadmin")
        }
      >
        <View style={styles.branchDot} />
        {!isCollapsed && (
          <>
            <View style={{ flex: 1, overflow: "hidden" }}>
              <Text style={styles.branchLabel} numberOfLines={1}>
                {branchName ||
                  (typeof authUser?.role === "string"
                    ? authUser.role
                    : authUser?.role?.name || "Staff")}
              </Text>
            </View>
            {(authUser?.role === "admin" ||
              authUser?.role === "superadmin") && (
              <ChevronRight
                size={14}
                color={ThemeColors.emerald}
                style={{ opacity: 0.7 }}
              />
            )}
          </>
        )}
      </TouchableOpacity>

      {/* ── Bottom: Settings & Support ────────────── */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.bottomBtn,
            activeItem === "settings" && styles.bottomBtnActive,
            isCollapsed && styles.bottomBtnCollapsed,
          ]}
          onPress={() => handleNavigate("settings")}
          activeOpacity={0.7}
        >
          <Settings
            size={18}
            color={
              activeItem === "settings"
                ? ThemeColors.accent
                : ThemeColors.textMuted
            }
            strokeWidth={2}
          />
          {!isCollapsed && (
            <Text
              weight="medium"
              style={[
                styles.bottomBtnLabel,
                activeItem === "settings" && styles.bottomBtnLabelActive,
              ]}
            >
              Settings
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomBtn,
            isCollapsed && styles.bottomBtnCollapsed,
            { marginTop: 4 },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={18} color={ThemeColors.red} strokeWidth={1.8} />
          {!isCollapsed && (
            <Text
              weight="medium"
              style={[styles.bottomBtnLabel, { color: ThemeColors.red }]}
            >
              Logout
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...(Platform.OS === "web"
      ? { boxShadow: "2px 0 16px rgba(0,0,0,0.4)" }
      : {
          shadowColor: ThemeColors.black,
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.3,
          elevation: 20,
        }),
  },
  containerCollapsed: {
    width: "100%",
  },

  // ── Brand ─────────────────────────────
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ThemeColors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandName: {
    color: ThemeColors.accent,
    fontSize: 18,
    letterSpacing: 1.5,
  },
  brandTagline: {
    color: ThemeColors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 2,
    fontWeight: "600",
  },

  // ── Sections ──────────────────────────
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    letterSpacing: 2,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: "uppercase",
  },

  // ── Scrollable Area ───────────────────
  menuScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  // ── Menu Item ─────────────────────────
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: ThemeRadius.lg,
    gap: 14,
    marginVertical: 2,
  },
  menuItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    width: 46,
    height: 46,
    alignSelf: "center",
    borderRadius: ThemeRadius.lg,
    gap: 0,
  },
  menuItemActive: {
    backgroundColor: "rgba(59, 130, 246, 0.15)", // Premium Blue with low opacity
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },

  // ── Labels ────────────────────────────
  menuLabel: {
    color: ThemeColors.textMuted,
    fontSize: 14,
    flex: 1,
  },
  menuLabelActive: {
    color: ThemeColors.white,
  },

  // ── Badge ─────────────────────────────
  badgeContainer: {
    backgroundColor: ThemeColors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    color: ThemeColors.white,
    fontSize: 11,
  },

  // ── Active Indicator ──────────────────
  activeIndicator: {
    position: "absolute",
    left: -12,
    top: "50%",
    marginTop: -8,
    width: 4,
    height: 16,
    borderRadius: 4,
    backgroundColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Branch Indicator ──────────────────
  branchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(16, 185, 129, 0.08)", // subtle emerald tint
  },
  branchIndicatorCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 18,
  },
  branchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.emerald,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  branchLabel: {
    color: ThemeColors.emerald,
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Bottom Section ────────────────────
  bottomSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  bottomBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginHorizontal: 12,
    borderRadius: ThemeRadius.md,
    gap: 14,
  },
  bottomBtnCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    marginHorizontal: 12,
  },
  bottomBtnActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  bottomBtnLabel: {
    color: ThemeColors.textMuted,
    fontSize: 15,
    fontWeight: "500",
  },
  bottomBtnLabelActive: {
    color: ThemeColors.white,
  },

  // ── Modal ─────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 340,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  modalTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  branchList: {
    maxHeight: 400,
  },
  branchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    marginBottom: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  branchItemActive: {
    borderColor: ThemeColors.accent,
    backgroundColor: ThemeColors.accentDim,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  branchCode: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
});
