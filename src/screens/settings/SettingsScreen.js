import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Bell,
  Box,
  ChevronRight,
  CreditCard,
  Database,
  HelpCircle,
  MapPin,
  Menu,
  Package,
  Printer,
  Receipt,
  Settings,
  Shield,
  Store,
  Utensils,
} from "lucide-react-native";

// ── Tab screens ───────────────────────────────────────────────────────────────
import { BranchSettings } from "@/components/settings/tabs/BranchSettings";
import { BusinessSettings } from "@/components/settings/tabs/BusinessSettings";
import { DataManagementSettings } from "@/components/settings/tabs/DataManagementSettings";
import { HelpSettings } from "@/components/settings/tabs/HelpSettings";
import { InventorySettings } from "@/components/settings/tabs/InventorySettings";
import { NotificationSettings } from "@/components/settings/tabs/NotificationSettings";
import { ProductSettings } from "@/components/settings/tabs/ProductSettings";
import { ReceiptInvoiceSettings } from "@/components/settings/tabs/ReceiptInvoiceSettings";
import { RestaurantSettings } from "@/components/settings/tabs/RestaurantSettings";
import { RolesPermissionsSettings } from "@/components/settings/tabs/RolesPermissionsSettings";
import { SecuritySettings } from "@/components/settings/tabs/SecuritySettings";
import { SubscriptionSettings } from "@/components/settings/tabs/SubscriptionSettings";
import { SystemPreferences } from "@/components/settings/tabs/SystemPreferences";
import { TaxSettings } from "@/components/settings/tabs/TaxSettings";

// ── Data ──────────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    name: "General",
    items: [
      {
        id: "business",
        label: "Business",
        icon: Store,
        description: "Store name, logo & contact",
      },
      {
        id: "branch",
        label: "Branch",
        icon: MapPin,
        description: "Manage locations",
      },
      {
        id: "tax",
        label: "Tax",
        icon: Receipt,
        description: "Tax rates & rules",
      },
      {
        id: "receipt",
        label: "Receipts",
        icon: Printer,
        description: "Receipt & invoice layout",
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: Package,
        description: "Stock & warehouse",
      },
      {
        id: "product",
        label: "Products",
        icon: Box,
        description: "Catalog & variants",
      },
      {
        id: "restaurant",
        label: "Restaurant",
        icon: Utensils,
        description: "Table & KDS config",
      },
    ],
  },
  {
    name: "System",
    items: [
      {
        id: "notification",
        label: "Notifications",
        icon: Bell,
        description: "Alerts & push",
      },
      {
        id: "roles",
        label: "Roles & Perms",
        icon: Shield,
        description: "Access control",
      },
      {
        id: "security",
        label: "Security",
        icon: Shield,
        description: "Password & 2FA",
      },
      {
        id: "subscription",
        label: "Subscription",
        icon: CreditCard,
        description: "Plan & billing",
      },
      {
        id: "data",
        label: "Data",
        icon: Database,
        description: "Import, export & clean",
      },
      {
        id: "system",
        label: "System",
        icon: Settings,
        description: "App preferences",
      },
      {
        id: "help",
        label: "Help Center",
        icon: HelpCircle,
        description: "Docs & support",
      },
    ],
  },
];

// Flat map for quick lookup
const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

function renderContent(activeTab) {
  switch (activeTab) {
    case "business":
      return <BusinessSettings />;
    case "branch":
      return <BranchSettings />;
    case "tax":
      return <TaxSettings />;
    case "receipt":
      return <ReceiptInvoiceSettings />;
    case "inventory":
      return <InventorySettings />;
    case "product":
      return <ProductSettings />;
    case "restaurant":
      return <RestaurantSettings />;
    case "notification":
      return <NotificationSettings />;
    case "roles":
      return <RolesPermissionsSettings />;
    case "security":
      return <SecuritySettings />;
    case "subscription":
      return <SubscriptionSettings />;
    case "data":
      return <DataManagementSettings />;
    case "system":
      return <SystemPreferences />;
    case "help":
      return <HelpSettings />;
    default:
      return null;
  }
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function SidebarNav({ activeTab, onSelect }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.navScroll}
    >
      {GROUPS.map((group) => (
        <View key={group.name} style={styles.navGroup}>
          {/* Group label */}
          <Text weight="semibold" style={styles.navGroupLabel}>
            {group.name.toUpperCase()}
          </Text>

          {group.items.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navRow, isActive && styles.navRowActive]}
                onPress={() => onSelect(item.id)}
                activeOpacity={0.7}
              >
                {/* Active accent strip */}
                <View
                  style={[
                    styles.accentStrip,
                    isActive && styles.accentStripActive,
                  ]}
                />

                {/* Icon */}
                <View
                  style={[styles.navIcon, isActive && styles.navIconActive]}
                >
                  <Icon
                    size={16}
                    color={isActive ? ThemeColors.accent : ThemeColors.textMuted}
                  />
                </View>

                {/* Label */}
                <Text
                  weight={isActive ? "semibold" : "regular"}
                  style={[styles.navLabel, isActive && styles.navLabelActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

// ── Mobile Hub: grid of category cards ───────────────────────────────────────
function MobileHub({ onSelect }) {
  return (
    <ScrollView
      contentContainerStyle={styles.hubScroll}
      showsVerticalScrollIndicator={false}
    >
      {GROUPS.map((group) => (
        <View key={group.name} style={styles.hubGroup}>
          <Text weight="semibold" style={styles.hubGroupLabel}>
            {group.name}
          </Text>

          <View style={styles.hubSection}>
            {group.items.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === group.items.length - 1;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.hubRow, !isLast && styles.hubRowDivider]}
                  onPress={() => onSelect(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.hubRowIcon}>
                    <Icon size={18} color={ThemeColors.textSecondary} />
                  </View>
                  <View style={styles.hubRowText}>
                    <Text weight="medium" style={styles.hubRowLabel}>
                      {item.label}
                    </Text>
                    <Text style={styles.hubRowDesc}>{item.description}</Text>
                  </View>
                  <ChevronRight size={16} color={ThemeColors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("business");
  const [showHub, setShowHub] = useState(true);
  const navigation = useNavigation();
  const { isDesktop, isMobile , isWebDesktop } = useResponsive();

  const activeItem = ALL_ITEMS.find((c) => c.id === activeTab);

  const handleSelect = (id) => {
    setActiveTab(id);
    if (isMobile) setShowHub(false);
  };

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={
                  isMobile && !showHub
                    ? () => setShowHub(true)
                    : () => navigation.openDrawer()
                }
                style={styles.menuBtn}
              >
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Settings</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Body ───────────────────────────────────────────────── */}
      <View style={styles.body}>
        {/* Sidebar (desktop always visible, tablet+; mobile only in hub mode) */}
        {(!isMobile || showHub) && !isMobile && (
          <View style={styles.sidebar}>
            <SidebarNav activeTab={activeTab} onSelect={handleSelect} />
          </View>
        )}

        {/* Mobile Hub */}
        {isMobile && showHub && (
          <View style={styles.mobileHubWrap}>
            <MobileHub onSelect={handleSelect} />
          </View>
        )}

        {/* Main content panel */}
        {(!isMobile || !showHub) && (
          <View style={styles.content}>
            {/* Content section header */}
            {activeItem && (
              <View style={styles.contentHeader}>
                <View style={styles.contentHeaderIcon}>
                  {React.createElement(activeItem.icon, {
                    size: 20,
                    color: ThemeColors.accent,
                  })}
                </View>
                <View>
                  <Text weight="semibold" style={styles.contentTitle}>
                    {activeItem.label}
                  </Text>
                  <Text style={styles.contentDesc}>
                    {activeItem.description}
                  </Text>
                </View>
              </View>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentScroll}
            >
              {renderContent(activeTab)}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },

  // Header
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
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
    padding: ThemeSpacing.xs,
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
  notifBtn: {
    position: "relative",
    padding: 4,
  },
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

  // Body
  body: {
    flex: 1,
    flexDirection: "row",
  },

  // ── Sidebar ──
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  navScroll: {
    paddingTop: ThemeSpacing.lg,
    paddingBottom: 80,
  },
  navGroup: {
    marginBottom: ThemeSpacing.xl,
    paddingHorizontal: ThemeSpacing.lg,
  },
  navGroupLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: ThemeColors.textMuted,
    marginBottom: ThemeSpacing.sm,
    paddingLeft: ThemeSpacing.md,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    marginBottom: 2,
    overflow: "hidden",
  },
  navRowActive: {
    backgroundColor: ThemeColors.accentDim,
  },
  accentStrip: {
    width: 3,
    height: "100%",
    borderRadius: 2,
    marginRight: ThemeSpacing.md,
    backgroundColor: "transparent",
  },
  accentStripActive: {
    backgroundColor: ThemeColors.accent,
  },
  navIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.sm,
  },
  navIconActive: {},
  navLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  navLabelActive: {
    color: ThemeColors.accent,
  },

  // ── Mobile Hub ──
  mobileHubWrap: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  hubScroll: {
    padding: ThemeSpacing.xxl,
    paddingBottom: 80,
    gap: ThemeSpacing.xxl,
  },
  hubGroup: {
    gap: ThemeSpacing.sm,
  },
  hubGroupLabel: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    letterSpacing: 0.4,
    paddingLeft: ThemeSpacing.xs,
  },
  hubSection: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  hubRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.lg,
    gap: ThemeSpacing.lg,
  },
  hubRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  hubRowIcon: {
    width: 36,
    height: 36,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  hubRowText: {
    flex: 1,
    gap: 2,
  },
  hubRowLabel: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  hubRowDesc: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },

  // ── Content Panel ──
  content: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  contentHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  contentTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  contentDesc: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    marginTop: 1,
  },
  contentScroll: {
    padding: ThemeSpacing.xxl,
    paddingBottom: 100,
  },
});
