import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { BillingConfigModal } from "@/components/dashboard/BillingConfigModal";
import { DiscountConfigModal } from "@/components/dashboard/DiscountConfigModal";
import { PrintConfigModal } from "@/components/dashboard/PrintConfigModal";
import { ServiceRenewalModal } from "@/components/dashboard/ServiceRenewalModal";
import { TaxConfigModal } from "@/components/dashboard/TaxConfigModal";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
import { hasPermission } from "@/utils/permissions";
import { useNavigation, useRouter } from "expo-router";
import {
  Bell,
  CreditCard,
  FileText,
  Menu,
  Monitor,
  Package,
  QrCode,
  Receipt,
  Sun,
  Truck,
  User,
  LifeBuoy,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const OPERATIONS_OPTIONS = [
  { key: "orders", label: "Orders", icon: Receipt, path: "/operations/orders" },
  { key: "menu", label: "Menu", icon: FileText, path: "/operations/menu" },
  {
    key: "inventory",
    label: "Inventory",
    icon: Package,
    path: "/operations/inventory",
  },
  {
    key: "suppliers",
    label: "Suppliers",
    icon: Truck,
    path: "/operations/suppliers",
  },
  {
    key: "expense",
    label: "Expense",
    icon: CreditCard,
    path: "/operations/expenses",
  },
  {
    key: "billing-user",
    label: "Billing User Profile",
    icon: User,
    path: "/operations/staff",
  },
  { key: "day-end", label: "Day End", icon: Sun, path: "/operations/day-end" },
  {
    key: "tables-qr",
    label: "Tables QR",
    icon: QrCode,
    path: "/operations/tables-qr",
  },
  {
    key: "logs",
    label: "Logs",
    icon: Monitor,
    path: "/operations/logs",
  },
  {
    key: "support-ticket",
    label: "Support Ticket",
    icon: LifeBuoy,
    path: "/operations/support-ticket",
  },
  // { key: "discount", label: "Discount", icon: Tags, path: null },
  // { key: "billing-screen", label: "Billing Screen", icon: Monitor, path: null },
  // {
  //   key: "extra-history",
  //   label: "Extra Information History",
  //   icon: FileText,
  //   path: null,
  // },
  // { key: "cash-flow", label: "Cash Flow", icon: Banknote, path: null },
  // { key: "withdrawal", label: "Withdrawal", icon: ArrowUpFromLine, path: null },
  // { key: "cash-topup", label: "Cash Top-Up", icon: PlusCircle, path: null },
  // { key: "manual-sync", label: "Manual Sync", icon: RefreshCw, path: null },
];

export default function OperationsPage() {
  const {
    isDesktop,
    isTablet,
    isMiniTab,
    isMobile,
    isLaptop,
    isWebDesktop,
    width,
  } = useResponsive();
  const navigation = useNavigation();
  const router = useRouter();
  const authUser = useSelector((state) => state.auth.user);

  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [renewalModalVisible, setRenewalModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [taxModalVisible, setTaxModalVisible] = useState(false);

  const numColumns = isDesktop
    ? 8
    : isLaptop
      ? 6
      : isTablet
        ? 5
        : isMiniTab
          ? 4
          : 3;
  const gap = ThemeSpacing.lg;

  const handlePress = (key, path, label) => {
    if (key === "discount") {
      setDiscountModalVisible(true);
    } else if (key === "service-renewal") {
      setRenewalModalVisible(true);
    } else if (key === "billing-screen") {
      setBillingModalVisible(true);
    } else if (key === "print") {
      setPrintModalVisible(true);
    } else if (key === "tax") {
      setTaxModalVisible(true);
    } else if (path) {
      router.push(path);
    } else {
      showAlert("Coming Soon", `${label} is currently under construction.`);
    }
  };

  const isUnderConstruction = (key, path) => {
    const specialIds = [
      "discount",
      "service-renewal",
      "billing-screen",
      "print",
      "tax",
    ];
    return !path && !specialIds.includes(key);
  };

  const renderGrid = (options) => (
    <View style={[styles.gridContainer, { gap }]}>
      {options.map((item) => {
        const Icon = item.icon;
        const itemWidth = isWebDesktop
          ? `calc(${100 / numColumns}% - ${(gap * (numColumns - 1)) / numColumns}px)`
          : (width - ThemeSpacing.xl * 2 - gap * (numColumns - 1)) / numColumns;

        const muted = isUnderConstruction(item.key, item.path);

        return (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.tile,
              { width: itemWidth },
              muted && { opacity: 0.5 },
            ]}
            onPress={() => handlePress(item.key, item.path, item.label)}
            activeOpacity={0.7}
          >
            <Icon size={36} color={ThemeColors.textPrimary} strokeWidth={1.2} />
            <Text weight="medium" style={styles.tileText} numberOfLines={2}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Operations</Text>
          </View>
          <View style={styles.headerRight}>
            <HeaderQuickNav />
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {/* <Text weight="bold" style={styles.sectionTitle}>
            Operations
          </Text> */}
          {renderGrid(
            OPERATIONS_OPTIONS.filter((item) =>
              hasPermission(authUser, item.key),
            ),
          )}
        </View>
      </ScrollView>

      <DiscountConfigModal
        visible={discountModalVisible}
        onClose={() => setDiscountModalVisible(false)}
      />
      <ServiceRenewalModal
        visible={renewalModalVisible}
        onClose={() => setRenewalModalVisible(false)}
      />
      <BillingConfigModal
        visible={billingModalVisible}
        onClose={() => setBillingModalVisible(false)}
      />
      <PrintConfigModal
        visible={printModalVisible}
        onClose={() => setPrintModalVisible(false)}
      />
      <TaxConfigModal
        visible={taxModalVisible}
        onClose={() => setTaxModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.surface },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  scrollContent: { flexGrow: 1, padding: ThemeSpacing.lg },
  section: { marginBottom: ThemeSpacing.lg },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  gridContainer: { flexDirection: "row", flexWrap: "wrap" },
  tile: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1.1,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tileText: {
    marginTop: ThemeSpacing.lg,
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: "center",
  },
});
