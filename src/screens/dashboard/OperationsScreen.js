import { BillingConfigModal } from "@/components/dashboard/BillingConfigModal";
import { DiscountConfigModal } from "@/components/dashboard/DiscountConfigModal";
import { PrintConfigModal } from "@/components/dashboard/PrintConfigModal";
import { ServiceRenewalModal } from "@/components/dashboard/ServiceRenewalModal";
import { TaxConfigModal } from "@/components/dashboard/TaxConfigModal";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { showAlert } from "@/utils/alert";
import { useNavigation, useRouter } from "expo-router";
import {
  ArrowUpFromLine,
  Banknote,
  Bell,
  Clock,
  CreditCard,
  FileDigit,
  FileText,
  Globe,
  History,
  Languages,
  Menu,
  MessageSquare,
  Monitor,
  MonitorPlay,
  Package,
  Percent,
  PlusCircle,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  Sun,
  Tags,
  Truck,
  User,
  Users,
  Wallet,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPERATIONS_OPTIONS = [
  { id: "orders", label: "Orders", icon: Receipt, route: "/orders" },
  {
    id: "extra-history",
    label: "Extra Information History",
    icon: FileText,
    route: null,
  },

  { id: "kots", label: "KOTs", icon: FileDigit, route: null },
  { id: "customers", label: "Customers", icon: Users, route: "/crm" },
  { id: "cash-flow", label: "Cash Flow", icon: Banknote, route: null },
  { id: "expense", label: "Expense", icon: CreditCard, route: null },
  { id: "withdrawal", label: "Withdrawal", icon: ArrowUpFromLine, route: null },
  { id: "cash-topup", label: "Cash Top-Up", icon: PlusCircle, route: null },
  { id: "inventory", label: "Inventory", icon: Package, route: "/inventory" },
  { id: "virtual-wallet", label: "Virtual Wallet", icon: Wallet, route: null },
  { id: "manual-sync", label: "Manual Sync", icon: RefreshCw, route: null },
  { id: "live-view", label: "Live View", icon: Monitor, route: null },
  { id: "due-payment", label: "Due Payment", icon: CreditCard, route: null },
  {
    id: "language-profiles",
    label: "Language Profiles",
    icon: Languages,
    route: null,
  },
  {
    id: "billing-user",
    label: "Billing User Profile",
    icon: User,
    route: "/staff",
  },
  { id: "day-end", label: "Day End", icon: Sun, route: "/day-end" },
  {
    id: "day-end-history",
    label: "Day End History",
    icon: History,
    route: null,
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    route: "/feedback",
  },
  { id: "delivery-boys", label: "Delivery Boys", icon: Truck, route: null },
  { id: "led-display", label: "LED Display", icon: MonitorPlay, route: null },
  { id: "tables-qr", label: "Tables QR", icon: QrCode, route: "/tables-qr" },
];

const CONFIGURATION_OPTIONS = [
  { id: "menu", label: "Menu", icon: FileText, route: "/menu" },
  { id: "print", label: "Bill / KOT Print", icon: Printer, route: null },
  { id: "tax", label: "Tax", icon: Percent, route: null },
  { id: "discount", label: "Discount", icon: Tags, route: null },
  { id: "billing-screen", label: "Billing Screen", icon: Monitor, route: null },
  {
    id: "online-order",
    label: "Online Order Configuration",
    icon: Globe,
    route: "/online-order-config",
  },
  { id: "service-renewal", label: "Service Renewal", icon: Clock, route: null },
];

export default function OperationsScreen() {
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

  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [renewalModalVisible, setRenewalModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [taxModalVisible, setTaxModalVisible] = useState(false);

  // Determine grid columns based on screen width
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

  const handlePress = (id, route, label) => {
    if (id === "discount") {
      setDiscountModalVisible(true);
    } else if (id === "service-renewal") {
      setRenewalModalVisible(true);
    } else if (id === "billing-screen") {
      setBillingModalVisible(true);
    } else if (id === "print") {
      setPrintModalVisible(true);
    } else if (id === "tax") {
      setTaxModalVisible(true);
    } else if (route) {
      router.push(route);
    } else {
      showAlert("Coming Soon", `${label} is currently under construction.`);
    }
  };

  const renderGrid = (options) => {
    return (
      <View style={[styles.gridContainer, { gap }]}>
        {options.map((item) => {
          const Icon = item.icon;
          const itemWidth = isWebDesktop
            ? `calc(${100 / numColumns}% - ${(gap * (numColumns - 1)) / numColumns}px)`
            : (width - ThemeSpacing.xl * 2 - gap * (numColumns - 1)) /
              numColumns;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tile, { width: itemWidth }]}
              onPress={() => handlePress(item.id, item.route, item.label)}
              activeOpacity={0.7}
            >
              <Icon
                size={36}
                color={ThemeColors.textPrimary}
                strokeWidth={1.2}
              />
              <Text weight="medium" style={styles.tileText} numberOfLines={2}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* ── Header ──────────────────────────── */}
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
            <Text style={styles.pageTitle}>Operations & Configuration</Text>
          </View>
          <View style={styles.headerRight}>
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
          <Text weight="bold" style={styles.sectionTitle}>
            Operations
          </Text>
          {renderGrid(OPERATIONS_OPTIONS)}
        </View>

        <View style={styles.section}>
          <Text weight="bold" style={styles.sectionTitle}>
            Set the configuration for your restaurant
          </Text>
          {renderGrid(CONFIGURATION_OPTIONS)}
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
  root: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
  },
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
  menuBtn: {
    padding: ThemeSpacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
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
  scrollContent: {
    flexGrow: 1,
    padding: ThemeSpacing.lg,
  },
  section: {
    marginBottom: ThemeSpacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
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
