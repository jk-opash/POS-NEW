import { Text } from "@/components/ui/Text";
import { logoutUser } from "@/store/slices/authSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { usePathname, useRouter } from "expo-router";
import {
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MonitorPlay,
  Receipt,
  Settings,
  Smartphone,
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
      {
        key: "online-orders",
        label: "Online Orders",
        Icon: Smartphone,
      },
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
      { key: "inventory", label: "Inventory", Icon: Boxes },
      { key: "invoices", label: "Invoices", Icon: Receipt },
      { key: "feedback", label: "Feedback", Icon: MessageSquare },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { key: "staff", label: "Staff", Icon: Users },
      { key: "branches", label: "Branches", Icon: MapPin },
      { key: "suppliers", label: "Suppliers", Icon: Truck },
      { key: "day-end", label: "Day End", Icon: Moon },
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
  const renderItem = (item, isActive) => (
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
        size={18}
        color={isActive ? ThemeColors.accent : ThemeColors.textMuted}
        strokeWidth={isActive ? 2.2 : 1.8}
      />
      {!isCollapsed && (
        <Text
          weight={isActive ? "semibold" : "regular"}
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

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, isCollapsed && styles.containerCollapsed]}
    >
      {/* ── Brand ───────────────────────────────── */}
      <View style={styles.brandSection}>
        <View style={styles.logoIcon}>
          <UtensilsCrossed
            size={18}
            color={ThemeColors.white}
            strokeWidth={2.2}
          />
        </View>
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
      <View
        style={styles.branchIndicator}
        onPress={() => {
          if (authUser?.role === "admin" || authUser?.role === "superadmin") {
            setShowBranchModal(true);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.branchDot} />
        <View style={{ flex: 1, overflow: "hidden" }}>
          <Text style={styles.branchLabel} numberOfLines={1}>
            {branchName ||
              (typeof authUser?.role === "string"
                ? authUser.role
                : authUser?.role?.name || "Staff")}
          </Text>
        </View>
      </View>

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
            strokeWidth={1.8}
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
      ? { boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }
      : {
          shadowColor: ThemeColors.black,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
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
  },
  brandTextContainer: {
    flex: 1,
  },
  brandName: {
    color: ThemeColors.accent,
    fontSize: 16,
    letterSpacing: 2,
  },
  brandTagline: {
    color: ThemeColors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 1,
  },

  // ── Sections ──────────────────────────
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },

  // ── Scrollable Area ───────────────────
  menuScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },

  // ── Menu Item ─────────────────────────
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 12,
    marginVertical: 1,
  },
  menuItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    width: 42,
    height: 42,
    alignSelf: "center",
    borderRadius: 12,
    gap: 0,
  },
  menuItemActive: {
    backgroundColor: "rgba(255,107,53,0.12)",
  },

  // ── Labels ────────────────────────────
  menuLabel: {
    color: ThemeColors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  menuLabelActive: {
    color: ThemeColors.white,
  },

  // ── Badge ─────────────────────────────
  badgeContainer: {
    backgroundColor: ThemeColors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: ThemeColors.white,
    fontSize: 10,
  },

  // ── Active Indicator ──────────────────
  activeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ThemeColors.accent,
  },

  // ── Branch Indicator ──────────────────
  branchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  branchIndicatorCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  branchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.emerald,
  },
  branchLabel: {
    color: ThemeColors.emerald,
    fontSize: 12,
    flex: 1,
  },

  // ── Bottom Section ────────────────────
  bottomSection: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  bottomBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  bottomBtnCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    marginHorizontal: 8,
  },
  bottomBtnActive: {
    backgroundColor: "rgba(255,107,53,0.12)",
  },
  bottomBtnLabel: {
    color: ThemeColors.textMuted,
    fontSize: 15,
  },
  bottomBtnLabelActive: {
    color: ThemeColors.accent,
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
