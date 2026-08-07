import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Bell,
  ChevronRight,
  MapPin,
  Menu,
  Save,
  Store,
} from "lucide-react-native";

import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { BranchDetails } from "@/components/settings/tabs/BranchDetails";
import { BusinessDetails } from "@/components/settings/tabs/BusinessDetails";
import { fetchSettings, updateBusiness, updateBranchSettings } from "@/store/slices/settingsSlice";
import { useDispatch, useSelector } from "react-redux";

const GROUPS = [
  {
    name: "General settings",
    items: [
      {
        id: "business",
        label: "Business Details",
        icon: Store,
        description: "Manage core business identity and tax information",
      },
      {
        id: "branch",
        label: "Branch Details",
        icon: MapPin,
        description: "Manage branch-specific location and operations",
      },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

function renderContent(activeTab, settings, updateSetting) {
  switch (activeTab) {
    case "business":
      return (
        <BusinessDetails settings={settings} updateSetting={updateSetting} />
      );
    case "branch":
      return (
        <BranchDetails settings={settings} updateSetting={updateSetting} />
      );
    case "taxes":
      return <TaxesSettings />;
    case "receipt":
      return <ReceiptInvoiceSettings />;
    case "restaurant":
      return <RestaurantSettings />;
    case "roles":
      return <RolesPermissionsSettings />;
    case "system":
      return <SystemPreferences />;
    default:
      return null;
  }
}

function SidebarNav({ activeTab, onSelect }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.navScroll}
    >
      {GROUPS.map((group) => (
        <View key={group.name} style={styles.navGroup}>
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
                <View
                  style={[
                    styles.accentStrip,
                    isActive && styles.accentStripActive,
                  ]}
                />
                <View
                  style={[styles.navIcon, isActive && styles.navIconActive]}
                >
                  <Icon
                    size={16}
                    color={
                      isActive ? ThemeColors.accent : ThemeColors.textMuted
                    }
                  />
                </View>
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

const defaultSettings = {
  business: {
    name: "",
    legal_name: "",
    business_type: "",
    phone: "",
    email: "",
    website: "",
    gstin: "",
    pan: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    business_registration_number: "",
  },
  branch: {
    name: "",
    code: "",
    branch_type: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    currency: "",
    time_zone: "",
    capacity: 0,
    tables_count: 0,
    tax_jurisdiction: "",
    tax_registration: "",
    tax_percentage: 0,
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [showHub, setShowHub] = useState(true);
  const navigation = useNavigation();
  const { isDesktop, isMobile, isWebDesktop } = useResponsive();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeBranch } = useSelector((state) => state.branch);
  const { business: reduxBusiness, branch: reduxBranch, isLoading: loading, isSaving: saving } = useSelector(
    (state) => state.settings
  );

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const businessId = user?.business_id || user?.businesses?.[0]?.id;
    if (!businessId) return;
    dispatch(fetchSettings({ businessId, branchId: activeBranch }));
  }, [dispatch, user, activeBranch]);

  // Sync Redux settings into local editable state
  useEffect(() => {
    const biz = reduxBusiness;
    const branch = reduxBranch;
    if (!biz || Object.keys(biz).length === 0) return;
    setSettings({
      business: {
        name: biz.name || "",
        legal_name: biz.legal_name || "",
        business_type: biz.business_type || "",
        phone: biz.phone || "",
        email: biz.email || "",
        website: biz.website || "",
        gstin: biz.gstin || "",
        pan: biz.pan || "",
        address_line1: biz.address_line1 || "",
        address_line2: biz.address_line2 || "",
        city: biz.city || "",
        state: biz.state || "",
        country: biz.country || "",
        pincode: biz.pincode || "",
        business_registration_number: biz.business_registration_number || "",
      },
      branch: {
        name: branch.name || "",
        code: branch.code || "",
        branch_type: branch.branch_type || "",
        contact: branch.contact || "",
        email: branch.email || "",
        address: branch.address || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "",
        currency: branch.currency || "",
        time_zone: branch.time_zone || "",
        capacity: branch.capacity || 0,
        tables_count: branch.tables_count || 0,
        tax_jurisdiction: branch.tax_jurisdiction || "",
        tax_registration: branch.tax_registration || "",
        tax_percentage: branch.tax_percentage || 0,
      },
    });
  }, [reduxBusiness, reduxBranch]);

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const businessId = user?.business_id || user?.businesses?.[0]?.id;
      const promises = [];
      if (businessId) {
        promises.push(dispatch(updateBusiness({ businessId, data: settings.business })).unwrap());
      }
      if (activeBranch) {
        promises.push(dispatch(updateBranchSettings({ branchId: activeBranch, data: settings.branch })).unwrap());
      }
      await Promise.all(promises);
      Alert.alert("Success", "Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings", err);
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const activeItem = ALL_ITEMS.find((c) => c.id === activeTab);

  const handleSelect = (id) => {
    setActiveTab(id);
    if (isMobile) setShowHub(false);
  };

  return (
    <View style={styles.root}>
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
            <HeaderQuickNav />
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={ThemeColors.white} />
              ) : (
                <>
                  <Save size={18} color={ThemeColors.white} />
                  <Text weight="semibold" style={styles.saveBtnText}>
                    Save
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {!isMobile && (
          <View style={styles.sidebar}>
            <SidebarNav activeTab={activeTab} onSelect={handleSelect} />
          </View>
        )}
        {isMobile && showHub && (
          <View style={styles.mobileHubWrap}>
            <MobileHub onSelect={handleSelect} />
          </View>
        )}
        {(!isMobile || !showHub) && (
          <View style={styles.content}>
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
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={ThemeColors.accent}
                  style={{ marginTop: 50 }}
                />
              ) : (
                renderContent(activeTab, settings, updateSetting)
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
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
  menuBtn: { padding: ThemeSpacing.xs },
  pageTitle: { fontSize: 26, color: ThemeColors.textPrimary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  notifBtn: { position: "relative", padding: 4 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: ThemeColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThemeRadius.md,
  },
  saveBtnText: { color: ThemeColors.white, fontSize: 14 },
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
  body: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  navScroll: { paddingTop: ThemeSpacing.lg, paddingBottom: 80 },
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
  navRowActive: { backgroundColor: ThemeColors.accentDim },
  accentStrip: {
    width: 3,
    height: "100%",
    borderRadius: 2,
    marginRight: ThemeSpacing.md,
    backgroundColor: "transparent",
  },
  accentStripActive: { backgroundColor: ThemeColors.accent },
  navIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.sm,
  },
  navIconActive: {},
  navLabel: { fontSize: 14, color: ThemeColors.textSecondary },
  navLabelActive: { color: ThemeColors.accent },
  mobileHubWrap: { flex: 1, backgroundColor: ThemeColors.bg },
  hubScroll: {
    padding: ThemeSpacing.xxl,
    paddingBottom: 80,
    gap: ThemeSpacing.xxl,
  },
  hubGroup: { gap: ThemeSpacing.sm },
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
  hubRowText: { flex: 1, gap: 2 },
  hubRowLabel: { fontSize: 15, color: ThemeColors.textPrimary },
  hubRowDesc: { fontSize: 12, color: ThemeColors.textMuted },
  content: { flex: 1 },
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
  contentTitle: { fontSize: 16, color: ThemeColors.textPrimary },
  contentDesc: { fontSize: 13, color: ThemeColors.textMuted, marginTop: 1 },
  contentScroll: { padding: ThemeSpacing.xxl, paddingBottom: 100 },
});
