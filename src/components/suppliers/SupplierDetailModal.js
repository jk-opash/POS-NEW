import { Text } from "@/components/ui/Text";
import { useSuppliers } from "@/context/SupplierContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Download,
  ExternalLink,
  Info,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Send,
  Star,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SupplierDetailModal({ visible, supplierId, onClose }) {
  const {
    suppliers,
    createPurchaseOrder,
    recordPayment,
    logCommunication,
    mapProduct,
  } = useSuppliers();
  const supplier = suppliers.find((s) => s.id === supplierId);
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const isLargeScreen = isDesktop;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPOModal, setShowPOModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMapProductModal, setShowMapProductModal] = useState(false);
  const [showLogEntryModal, setShowLogEntryModal] = useState(false);

  // Form States
  const [poExpectedDate, setPoExpectedDate] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [mapProductName, setMapProductName] = useState("");
  const [mapProductCost, setMapProductCost] = useState("");
  const [logType, setLogType] = useState("Email");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [logSummary, setLogSummary] = useState("");

  if (!supplier) return null;

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "info", label: "Information", icon: Info },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "contracts", label: "Contracts", icon: BookOpen },
    { id: "comms", label: "Comms Log", icon: MessageSquare },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return ThemeColors.emerald;
      case "Medium":
        return ThemeColors.amber;
      case "High":
        return ThemeColors.rose;
      default:
        return ThemeColors.textMuted;
    }
  };

  const renderDashboard = () => (
    <View style={styles.tabContent}>
      <View
        style={{
          flexDirection: "row",
          gap: ThemeSpacing.md,
          marginBottom: ThemeSpacing.sm,
        }}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={() => setShowPOModal(true)}
        >
          <Plus size={16} color={ThemeColors.white} />
          <Text weight="bold" style={{ color: ThemeColors.white }}>
            Create PO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.8}
          onPress={() => setShowPaymentModal(true)}
        >
          <Send size={16} color={ThemeColors.textPrimary} />
          <Text weight="bold" style={{ color: ThemeColors.textPrimary }}>
            Send Payment
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Spend (YTD)</Text>
          <Text weight="bold" style={styles.statVal}>
            ₹{(supplier.stats?.totalSpend || 0).toLocaleString()}
          </Text>
          <Text
            style={{ fontSize: 12, color: ThemeColors.emerald, marginTop: 4 }}
          >
            +12% from last year
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Outstanding</Text>
          <Text
            weight="bold"
            style={[styles.statVal, { color: ThemeColors.rose }]}
          >
            ₹{(supplier.stats?.outstandingBalance || 0).toLocaleString()}
          </Text>
          <Text
            style={{ fontSize: 12, color: ThemeColors.textMuted, marginTop: 4 }}
          >
            Due in 15 days
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Last Order</Text>
          <Text weight="bold" style={styles.statVal}>
            {supplier.stats?.lastOrderDate}
          </Text>
          <Text
            style={{ fontSize: 12, color: ThemeColors.textMuted, marginTop: 4 }}
          >
            Fulfilled on time
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Orders</Text>
          <Text weight="bold" style={styles.statVal}>
            {supplier.stats?.totalOrders}
          </Text>
          <Text
            style={{ fontSize: 12, color: ThemeColors.textMuted, marginTop: 4 }}
          >
            Active account
          </Text>
        </View>
      </View>

      <View style={styles.riskCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: ThemeSpacing.sm,
            }}
          >
            <AlertCircle
              size={20}
              color={getRiskColor(supplier.performance?.riskLevel)}
            />
            <Text weight="bold" style={{ fontSize: 16 }}>
              Supplier Risk Assessment
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  getRiskColor(supplier.performance?.riskLevel) + "20",
              },
            ]}
          >
            <Text
              weight="bold"
              style={{ color: getRiskColor(supplier.performance?.riskLevel) }}
            >
              {supplier.performance?.riskLevel} Risk
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginTop: ThemeSpacing.sm,
            color: ThemeColors.textSecondary,
            lineHeight: 20,
          }}
        >
          Based on historical delivery times, quality scores, and supply
          dependency, this supplier is currently rated as a{" "}
          <Text
            weight="bold"
            style={{ color: getRiskColor(supplier.performance?.riskLevel) }}
          >
            {supplier.performance?.riskLevel} Risk
          </Text>
          . We recommend maintaining a safety stock of 15% for critical items
          sourced from this vendor.
        </Text>
      </View>
    </View>
  );

  const renderInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ThemeSpacing.md,
          }}
        >
          <Text weight="bold" style={styles.infoCardTitle}>
            Basic Info
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Business Name:</Text>
          <Text style={styles.infoValue}>{supplier.businessName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registration No:</Text>
          <Text style={styles.infoValue}>
            {supplier.registrationNumber || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{supplier.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registration Date:</Text>
          <Text style={styles.infoValue}>{supplier.registrationDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  supplier.status === "Active"
                    ? ThemeColors.emerald + "20"
                    : ThemeColors.border,
              },
            ]}
          >
            <Text
              weight="bold"
              style={{
                color:
                  supplier.status === "Active"
                    ? ThemeColors.emerald
                    : ThemeColors.textMuted,
              }}
            >
              {supplier.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ThemeSpacing.md,
          }}
        >
          <Text weight="bold" style={styles.infoCardTitle}>
            Contact & Address
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => alert(`Calling ${supplier.contact?.mobile}...`)}
            >
              <Phone size={18} color={ThemeColors.emerald} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => alert(`Emailing ${supplier.contact?.email}...`)}
            >
              <Mail size={18} color={ThemeColors.emerald} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Primary Contact:</Text>
          <Text style={styles.infoValue}>{supplier.contact?.person}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile:</Text>
          <Text style={styles.infoValue}>{supplier.contact?.mobile}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Office:</Text>
          <Text style={styles.infoValue}>
            {supplier.contact?.office || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{supplier.contact?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Website:</Text>
          <Text style={[styles.infoValue, { color: ThemeColors.emerald }]}>
            {supplier.contact?.website || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>
            {supplier.address?.line1}, {supplier.address?.city},{" "}
            {supplier.address?.state} {supplier.address?.zip}{" "}
            {supplier.address?.country}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text weight="bold" style={styles.infoCardTitle}>
          Financial Details
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>GST Number:</Text>
          <Text style={styles.infoValue}>{supplier.tax?.gst || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Terms:</Text>
          <Text style={styles.infoValue}>
            {supplier.financial?.paymentTerms || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Credit Limit:</Text>
          <Text style={styles.infoValue}>
            ₹{(supplier.financial?.creditLimit || 0).toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bank Name:</Text>
          <Text style={styles.infoValue}>
            {supplier.banking?.bankName || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account No:</Text>
          <Text style={styles.infoValue}>
            {supplier.banking?.accNo
              ? `**** ${supplier.banking.accNo.slice(-4)}`
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProgressBar = (score, max = 5) => {
    const percentage = (score / max) * 100;
    const color =
      percentage >= 80
        ? ThemeColors.emerald
        : percentage >= 50
          ? ThemeColors.amber
          : ThemeColors.rose;
    return (
      <View style={{ flex: 1, marginLeft: ThemeSpacing.lg }}>
        <View
          style={{
            width: "100%",
            height: 8,
            backgroundColor: ThemeColors.borderSubtle,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  };

  const renderPerformance = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <Text weight="bold" style={styles.infoCardTitle}>
          Performance & Quality Scores
        </Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Overall Rating</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Star fill={ThemeColors.amber} color={ThemeColors.amber} size={16} />
            <Text weight="bold">
              {supplier.performance?.overallRating} / 5.0
            </Text>
          </View>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Delivery Reliability</Text>
          {renderProgressBar(supplier.performance?.deliveryScore)}
          <Text weight="bold" style={{ width: 40, textAlign: "right" }}>
            {supplier.performance?.deliveryScore}
          </Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Product Quality</Text>
          {renderProgressBar(supplier.performance?.qualityScore)}
          <Text weight="bold" style={{ width: 40, textAlign: "right" }}>
            {supplier.performance?.qualityScore}
          </Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Pricing Stability</Text>
          {renderProgressBar(supplier.performance?.pricingScore)}
          <Text weight="bold" style={{ width: 40, textAlign: "right" }}>
            {supplier.performance?.pricingScore}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text weight="bold" style={styles.infoCardTitle}>
          Fulfillment Metrics
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Avg Delivery Time:</Text>
          <Text style={styles.infoValue}>
            {supplier.stats?.avgDeliveryTime}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Return Rate (Defects):</Text>
          <Text style={[styles.infoValue, { color: ThemeColors.rose }]}>
            {supplier.stats?.returnRate}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ThemeSpacing.md,
          }}
        >
          <Text weight="bold" style={styles.infoCardTitle}>
            Sourced Products Catalog
          </Text>
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => setShowMapProductModal(true)}
          >
            <Plus size={14} color={ThemeColors.textPrimary} />
            <Text
              weight="bold"
              style={{ color: ThemeColors.textPrimary, fontSize: 13 }}
            >
              Map Product
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.productRow,
            {
              borderBottomColor: ThemeColors.border,
              backgroundColor: ThemeColors.surfaceHighlight,
              paddingHorizontal: 12,
              borderRadius: 6,
            },
          ]}
        >
          <Text
            weight="bold"
            style={{ flex: 2, color: ThemeColors.textSecondary, fontSize: 13 }}
          >
            Product Name
          </Text>
          <Text
            weight="bold"
            style={{
              flex: 1,
              color: ThemeColors.textSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Avg Cost
          </Text>
          <Text
            weight="bold"
            style={{
              flex: 1,
              color: ThemeColors.textSecondary,
              fontSize: 13,
              textAlign: "right",
            }}
          >
            Status
          </Text>
        </View>

        {supplier.products?.map((prod, idx) => (
          <View
            key={idx}
            style={[styles.productRow, { paddingHorizontal: 12 }]}
          >
            <View
              style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            >
              <Package size={16} color={ThemeColors.textMuted} />
              <Text style={{ marginLeft: 8 }}>{prod}</Text>
            </View>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: "500" }}>
              ₹{((idx + 1) * 15.5).toFixed(2)}
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: ThemeColors.emerald + "20" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: ThemeColors.emerald,
                    fontWeight: "bold",
                  }}
                >
                  In Stock
                </Text>
              </View>
            </View>
          </View>
        ))}
        {(!supplier.products || supplier.products.length === 0) && (
          <Text style={{ color: ThemeColors.textMuted, marginTop: 12 }}>
            No products have been mapped to this supplier yet.
          </Text>
        )}
      </View>
    </View>
  );

  const renderContracts = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ThemeSpacing.md,
          }}
        >
          <Text weight="bold" style={styles.infoCardTitle}>
            Active Master Agreement
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => alert("Downloading Contract PDF...")}
            >
              <Download size={16} color={ThemeColors.emerald} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => alert("Opening contract in external viewer...")}
            >
              <ExternalLink size={16} color={ThemeColors.emerald} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contract Reference:</Text>
          <Text style={styles.infoValue}>
            {supplier.contracts?.contractNumber}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valid From:</Text>
          <Text style={styles.infoValue}>{supplier.contracts?.startDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valid Until:</Text>
          <Text style={[styles.infoValue, { color: ThemeColors.textPrimary }]}>
            <Text weight="bold">{supplier.contracts?.endDate}</Text>
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Terms:</Text>
          <Text style={styles.infoValue}>
            {supplier.contracts?.paymentTerms}
          </Text>
        </View>

        <View
          style={{
            marginTop: ThemeSpacing.lg,
            padding: ThemeSpacing.md,
            backgroundColor: ThemeColors.surfaceHighlight,
            borderRadius: ThemeRadius.md,
            borderWidth: 1,
            borderColor: ThemeColors.borderSubtle,
          }}
        >
          <Text
            weight="bold"
            style={{ color: ThemeColors.textPrimary, marginBottom: 4 }}
          >
            Standard Service Level Agreement (SLA)
          </Text>
          <Text
            style={{
              color: ThemeColors.textSecondary,
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            Requires 98% on-time delivery rate. Failure to meet SLAs for 3
            consecutive months permits contract termination without penalty.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderComms = () => (
    <View style={styles.tabContent}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: ThemeSpacing.sm,
        }}
      >
        <Text style={{ color: ThemeColors.textMuted }}>
          Recent communication history
        </Text>
        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.8}
          onPress={() => setShowLogEntryModal(true)}
        >
          <Plus size={14} color={ThemeColors.textPrimary} />
          <Text
            weight="bold"
            style={{ color: ThemeColors.textPrimary, fontSize: 13 }}
          >
            Log Entry
          </Text>
        </TouchableOpacity>
      </View>

      {supplier.communications?.map((comm, idx) => (
        <View key={idx} style={styles.commCard}>
          <View style={styles.commHeader}>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View
                style={{
                  padding: 6,
                  backgroundColor: ThemeColors.emerald + "15",
                  borderRadius: 20,
                }}
              >
                {comm.type === "Email" ? (
                  <Mail size={14} color={ThemeColors.emerald} />
                ) : (
                  <Phone size={14} color={ThemeColors.emerald} />
                )}
              </View>
              <Text weight="bold" style={{ fontSize: 15 }}>
                {comm.type} logged
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: ThemeColors.textMuted }}>
              {comm.date}
            </Text>
          </View>
          <Text
            style={{
              color: ThemeColors.textSecondary,
              marginTop: ThemeSpacing.md,
              lineHeight: 20,
            }}
          >
            {comm.summary}
          </Text>
        </View>
      ))}

      {(!supplier.communications || supplier.communications.length === 0) && (
        <View style={{ alignItems: "center", padding: ThemeSpacing.xl }}>
          <MessageSquare size={48} color={ThemeColors.border} />
          <Text
            style={{ color: ThemeColors.textMuted, marginTop: ThemeSpacing.md }}
          >
            No communications logged yet.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType={isLargeScreen ? "fade" : "slide"}
        onRequestClose={onClose}
      >
        <SafeAreaView
          style={[styles.overlay, isLargeScreen && styles.overlayCenter]}
        >
          <View
            style={[
              styles.modalContainer,
              isLargeScreen && styles.modalContainerCentered,
            ]}
          >
            <View style={styles.header}>
              <View>
                <Text weight="bold" style={styles.title}>
                  {supplier.name}
                </Text>
                <Text style={styles.subtitle}>
                  {supplier.id} • {supplier.status}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* ── Filter Tabs ─────────────────────── */}
            <View style={styles.toolbarRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterTabs}
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
                      style={[
                        styles.filterTab,
                        isActive && {
                          backgroundColor: ThemeColors.emerald,
                          borderColor: ThemeColors.emerald,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <tab.icon
                        size={16}
                        color={isActive ? ThemeColors.white : ThemeColors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        weight={isActive ? "semibold" : "regular"}
                        style={[
                          styles.filterTabText,
                          isActive && styles.filterTabTextActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.contentArea}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mainScroll}
              >
                {activeTab === "dashboard" && renderDashboard()}
                {activeTab === "info" && renderInfo()}
                {activeTab === "performance" && renderPerformance()}
                {activeTab === "products" && renderProducts()}
                {activeTab === "contracts" && renderContracts()}
                {activeTab === "comms" && renderComms()}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Create PO Modal ─────────────────── */}
      <Modal
        visible={showPOModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPOModal(false)}
      >
        <View style={[styles.overlay, styles.overlayCenter]}>
          <View
            style={[
              styles.modalContainerCentered,
              {
                padding: isMobile ? ThemeSpacing.lg : ThemeSpacing.xxl,
                width: isMobile ? "95%" : "100%",
                maxWidth: 500,
                backgroundColor: ThemeColors.surface,
                borderRadius: ThemeRadius.xl,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ThemeSpacing.xl,
              }}
            >
              <View>
                <Text weight="bold" style={{ fontSize: 20 }}>
                  New Purchase Order
                </Text>
                <Text style={{ color: ThemeColors.textMuted }}>
                  Drafting PO for {supplier?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPOModal(false)}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: ThemeSpacing.lg }}>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Items to Order
                </Text>
                <View style={styles.input}>
                  <Text style={{ color: ThemeColors.textMuted }}>
                    Select products from catalog...
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Expected Delivery Date
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={poExpectedDate}
                  onChangeText={setPoExpectedDate}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Order Notes (Optional)
                </Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  placeholder="Add instructions for vendor..."
                  placeholderTextColor={ThemeColors.textMuted}
                  value={poNotes}
                  onChangeText={setPoNotes}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: ThemeSpacing.md,
                marginTop: ThemeSpacing.xl,
              }}
            >
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setShowPOModal(false)}
              >
                <Text weight="bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  createPurchaseOrder(supplierId, {
                    expectedDate: poExpectedDate || "TBD",
                    notes: poNotes,
                  });
                  setPoExpectedDate("");
                  setPoNotes("");
                  setShowPOModal(false);
                }}
              >
                <CheckCircle size={16} color={ThemeColors.white} />
                <Text weight="bold" style={{ color: ThemeColors.white }}>
                  Submit Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Send Payment Modal ─────────────────── */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={[styles.overlay, styles.overlayCenter]}>
          <View
            style={[
              styles.modalContainerCentered,
              {
                padding: isMobile ? ThemeSpacing.lg : ThemeSpacing.xxl,
                width: isMobile ? "95%" : "100%",
                maxWidth: 450,
                backgroundColor: ThemeColors.surface,
                borderRadius: ThemeRadius.xl,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ThemeSpacing.xl,
              }}
            >
              <View>
                <Text weight="bold" style={{ fontSize: 20 }}>
                  Send Payment
                </Text>
                <Text style={{ color: ThemeColors.textMuted }}>
                  Pay outstanding balance to {supplier?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: ThemeSpacing.lg }}>
              <View
                style={{
                  backgroundColor: ThemeColors.bg,
                  padding: ThemeSpacing.lg,
                  borderRadius: ThemeRadius.md,
                  alignItems: "center",
                  marginBottom: ThemeSpacing.sm,
                }}
              >
                <Text
                  style={{ color: ThemeColors.textSecondary, marginBottom: 4 }}
                >
                  Outstanding Balance
                </Text>
                <Text
                  weight="bold"
                  style={{ fontSize: 28, color: ThemeColors.rose }}
                >
                  ₹{(supplier?.stats?.outstandingBalance || 0).toLocaleString()}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Payment Amount (₹)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder={(
                    supplier?.stats?.outstandingBalance || 0
                  ).toString()}
                  placeholderTextColor={ThemeColors.textMuted}
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Payment Method
                </Text>
                <TextInput
                  style={styles.input}
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Reference / UTR Number
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter transaction reference"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={paymentRef}
                  onChangeText={setPaymentRef}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: ThemeSpacing.md,
                marginTop: ThemeSpacing.xl,
              }}
            >
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text weight="bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  recordPayment(
                    supplierId,
                    paymentAmount,
                    paymentMethod,
                    paymentRef,
                  );
                  setPaymentAmount("");
                  setPaymentRef("");
                  setShowPaymentModal(false);
                }}
              >
                <Send size={16} color={ThemeColors.white} />
                <Text weight="bold" style={{ color: ThemeColors.white }}>
                  Confirm Payment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Map Product Modal ─────────────────── */}
      <Modal
        visible={showMapProductModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMapProductModal(false)}
      >
        <View style={[styles.overlay, styles.overlayCenter]}>
          <View
            style={[
              styles.modalContainerCentered,
              {
                padding: isMobile ? ThemeSpacing.lg : ThemeSpacing.xxl,
                width: isMobile ? "95%" : "100%",
                maxWidth: 450,
                backgroundColor: ThemeColors.surface,
                borderRadius: ThemeRadius.xl,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ThemeSpacing.xl,
              }}
            >
              <View>
                <Text weight="bold" style={{ fontSize: 20 }}>
                  Map Sourced Product
                </Text>
                <Text style={{ color: ThemeColors.textMuted }}>
                  Link internal inventory to {supplier?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowMapProductModal(false)}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: ThemeSpacing.lg }}>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Product Name
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Organic Tomatoes"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={mapProductName}
                  onChangeText={setMapProductName}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Agreed Cost per Unit (₹)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={mapProductCost}
                  onChangeText={setMapProductCost}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: ThemeSpacing.md,
                marginTop: ThemeSpacing.xl,
              }}
            >
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setShowMapProductModal(false)}
              >
                <Text weight="bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  if (mapProductName) {
                    mapProduct(supplierId, {
                      name: mapProductName,
                      cost: parseFloat(mapProductCost) || 0,
                    });
                    setMapProductName("");
                    setMapProductCost("");
                    setShowMapProductModal(false);
                  }
                }}
              >
                <CheckCircle size={16} color={ThemeColors.white} />
                <Text weight="bold" style={{ color: ThemeColors.white }}>
                  Save Mapping
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Log Entry Modal ─────────────────── */}
      <Modal
        visible={showLogEntryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogEntryModal(false)}
      >
        <View style={[styles.overlay, styles.overlayCenter]}>
          <View
            style={[
              styles.modalContainerCentered,
              {
                padding: isMobile ? ThemeSpacing.lg : ThemeSpacing.xxl,
                width: isMobile ? "95%" : "100%",
                maxWidth: 500,
                backgroundColor: ThemeColors.surface,
                borderRadius: ThemeRadius.xl,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ThemeSpacing.xl,
              }}
            >
              <View>
                <Text weight="bold" style={{ fontSize: 20 }}>
                  Log Communication
                </Text>
                <Text style={{ color: ThemeColors.textMuted }}>
                  Record interactions with {supplier?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowLogEntryModal(false)}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: ThemeSpacing.lg }}>
              <View style={{ flexDirection: "row", gap: ThemeSpacing.lg }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: ThemeColors.textSecondary,
                      marginBottom: 8,
                      fontSize: 13,
                    }}
                  >
                    Type
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={logType}
                    onChangeText={setLogType}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: ThemeColors.textSecondary,
                      marginBottom: 8,
                      fontSize: 13,
                    }}
                  >
                    Date
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={logDate}
                    onChangeText={setLogDate}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    color: ThemeColors.textSecondary,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  Summary Notes
                </Text>
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  multiline
                  placeholder="What was discussed?"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={logSummary}
                  onChangeText={setLogSummary}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: ThemeSpacing.md,
                marginTop: ThemeSpacing.xl,
              }}
            >
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setShowLogEntryModal(false)}
              >
                <Text weight="bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  if (logSummary) {
                    logCommunication(supplierId, {
                      type: logType,
                      date: logDate,
                      summary: logSummary,
                    });
                    setLogSummary("");
                    setShowLogEntryModal(false);
                  }
                }}
              >
                <CheckCircle size={16} color={ThemeColors.white} />
                <Text weight="bold" style={{ color: ThemeColors.white }}>
                  Save Log
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayCenter: {
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xxl,
  },
  modalContainer: {
    backgroundColor: ThemeColors.surface,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    width: "100%",
    height: "90%",
    overflow: "hidden",
  },
  modalContainerCentered: {
    width: "100%",
    maxWidth: 800,
    height: "auto",
    maxHeight: "95%",
    borderRadius: ThemeRadius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 22,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  filterTabs: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  filterTabText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  filterTabTextActive: {
    color: ThemeColors.white,
  },
  contentArea: {
    flex: 1,
  },
  mainScroll: {
    padding: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.xxl * 2,
  },
  tabContent: { gap: ThemeSpacing.xl },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: ThemeSpacing.md },
  statBox: {
    flex: 1,
    minWidth: 150,
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  statTitle: { fontSize: 13, color: ThemeColors.textMuted, marginBottom: 4 },
  statVal: { fontSize: 20, color: ThemeColors.textPrimary },
  riskCard: {
    backgroundColor: ThemeColors.surfaceHighlight,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
  },
  infoCard: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  infoCardTitle: {
    fontSize: 16,
    marginBottom: ThemeSpacing.md,
    color: ThemeColors.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  infoLabel: {
    minWidth: 120,
    flex: 1,
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
  infoValue: {
    minWidth: 150,
    flex: 2,
    color: ThemeColors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  scoreLabel: { color: ThemeColors.textSecondary, fontSize: 15, width: 140 },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  commCard: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  commHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  secondaryBtn: {
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    backgroundColor: ThemeColors.emerald + "15",
    borderRadius: ThemeRadius.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ThemeRadius.full,
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 44,
    color: ThemeColors.textPrimary,
    fontSize: 15,
  },
});
