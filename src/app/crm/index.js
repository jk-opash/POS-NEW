import { customerApi } from "@/api/services";
import { AddCustomerModal } from "@/components/crm/AddCustomerModal";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import {
  CalendarDays,
  Gift,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const LABEL_COLORS = {
  VIP: { bg: ThemeColors.amberDim, text: ThemeColors.amber, icon: Star },
  Regular: { bg: ThemeColors.blueDim, text: ThemeColors.blue, icon: User },
  New: { bg: ThemeColors.emeraldDim, text: ThemeColors.emerald, icon: TrendingUp },
};

export default function CRMPage() {
  const navigation = useNavigation();
  const { isDesktop, isWebDesktop, isMobile } = useResponsive();
  const { branch, business } = useSelector((state) => state.settings);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCustomers = async () => {
    if (!branch?.id) return;
    try {
      setLoading(true);
      const res = await customerApi.getByBranch(branch.id);
      if (res.data?.success) {
        setCustomers(res.data.data);
        if (!selectedCustomer && res.data.data.length > 0 && isDesktop) {
          setSelectedCustomer(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [branch?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleSaveCustomer = async (formData) => {
    try {
      setIsSaving(true);
      const res = await customerApi.create({
        ...formData,
        branch_id: branch.id,
        business_id: business.id,
      });
      if (res.data?.success) {
        setIsAddModalVisible(false);
        fetchCustomers();
      }
    } catch (err) {
      console.error("Failed to add customer:", err);
      alert("Error adding customer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Determine label dynamically based on logic
  const getCustomerLabel = (c) => {
    const spent = parseFloat(c.total_spent || 0);
    if (spent >= 10000 || c.total_visits > 10) return "VIP";
    if (c.total_visits <= 1) return "New";
    return "Regular";
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
  );

  const totalPoints = customers.reduce(
    (s, c) => s + (parseInt(c.loyalty_points) || 0),
    0
  );
  const totalSpent = customers.reduce(
    (s, c) => s + parseFloat(c.total_spent || 0),
    0
  );
  const avgSpend = customers.length ? Math.round(totalSpent / customers.length) : 0;
  const vipCount = customers.filter((c) => getCustomerLabel(c) === "VIP").length;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuBtn}
              >
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <View style={styles.iconContainer}>
              <Heart size={20} color={ThemeColors.white} />
            </View>
            <View>
              <Text weight="bold" style={styles.pageTitle}>
                CRM Dashboard
              </Text>
              <Text style={styles.pageSubtitle}>
                Manage loyalty and customer relationships
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={18} color={ThemeColors.white} />
            {!isMobile && (
              <Text weight="semibold" style={styles.addBtnText}>
                New Customer
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {/* Main List Area */}
        <View style={styles.mainContent}>
          {/* Stats Row */}
          <ScrollView
            horizontal
            style={{ flexGrow: 0 }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            {[
              {
                label: "Total Customers",
                value: customers.length,
                icon: Users,
                color: ThemeColors.blue,
              },
              {
                label: "VIP Members",
                value: vipCount,
                icon: Star,
                color: ThemeColors.amber,
              },
              {
                label: "Total Points",
                value: totalPoints,
                icon: Gift,
                color: ThemeColors.violet,
              },
              {
                label: "Avg. Spend",
                value: `₹${avgSpend}`,
                icon: TrendingUp,
                color: ThemeColors.emerald,
              },
            ].map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View
                  style={[styles.statIconWrap, { backgroundColor: stat.color + "1A" }]}
                >
                  <stat.icon size={20} color={stat.color} />
                </View>
                <View>
                  <Text weight="bold" style={styles.statValue}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Search Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color={ThemeColors.textMuted} />
              <TextInput
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor={ThemeColors.textMuted}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={{ color: ThemeColors.accent, fontSize: 13 }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
              <RefreshCcw size={18} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Customer List */}
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {loading && customers.length === 0 ? (
              <ActivityIndicator
                size="large"
                color={ThemeColors.accent}
                style={{ marginTop: 40 }}
              />
            ) : filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <User size={48} color={ThemeColors.border} />
                <Text style={styles.emptyStateText}>No customers found.</Text>
              </View>
            ) : (
              filtered.map((customer) => {
                const label = getCustomerLabel(customer);
                const labelCfg = LABEL_COLORS[label];
                const LabelIcon = labelCfg.icon;
                const isSelected = selectedCustomer?.id === customer.id;

                return (
                  <TouchableOpacity
                    key={customer.id}
                    style={[
                      styles.customerCard,
                      isSelected && styles.customerCardSelected,
                    ]}
                    onPress={() => setSelectedCustomer(customer)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.customerCardInner}>
                      <View style={styles.customerAvatar}>
                        <Text weight="bold" style={styles.avatarText}>
                          {customer.name?.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.customerInfo}>
                        <View style={styles.customerNameRow}>
                          <Text weight="bold" style={styles.customerName}>
                            {customer.name}
                          </Text>
                          <View
                            style={[
                              styles.labelBadge,
                              { backgroundColor: labelCfg.bg },
                            ]}
                          >
                            <LabelIcon size={10} color={labelCfg.text} />
                            <Text
                              weight="bold"
                              style={[styles.labelText, { color: labelCfg.text }]}
                            >
                              {label}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.customerPhone}>
                          {customer.phone || "No phone added"}
                        </Text>

                        <View style={styles.statsMiniRow}>
                          <View style={styles.statMini}>
                            <TrendingUp size={12} color={ThemeColors.textMuted} />
                            <Text style={styles.statMiniText}>
                              ₹{customer.total_spent || 0}
                            </Text>
                          </View>
                          <View style={styles.statMini}>
                            <CalendarDays size={12} color={ThemeColors.textMuted} />
                            <Text style={styles.statMiniText}>
                              {customer.total_visits || 0} visits
                            </Text>
                          </View>
                          <View style={styles.statMini}>
                            <Gift size={12} color={ThemeColors.accent} />
                            <Text
                              style={[
                                styles.statMiniText,
                                { color: ThemeColors.accent },
                              ]}
                            >
                              {customer.loyalty_points || 0} pts
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Right Detail Panel (Desktop only) */}
        {isDesktop && (
          <View style={styles.detailPanel}>
            {selectedCustomer ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <View style={styles.detailAvatarLarge}>
                    <Text weight="bold" style={styles.detailAvatarLargeText}>
                      {selectedCustomer.name?.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <Text weight="bold" style={styles.detailNameLarge}>
                    {selectedCustomer.name}
                  </Text>
                  <Text style={styles.detailJoined}>
                    Customer since{" "}
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.detailCard}>
                  <View style={styles.detailCardItem}>
                    <View style={styles.detailIconBox}>
                      <Phone size={16} color={ThemeColors.blue} />
                    </View>
                    <View>
                      <Text style={styles.detailCardLabel}>Phone Number</Text>
                      <Text weight="medium" style={styles.detailCardValue}>
                        {selectedCustomer.phone || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailCardDivider} />
                  <View style={styles.detailCardItem}>
                    <View style={[styles.detailIconBox, { backgroundColor: ThemeColors.emeraldDim }]}>
                      <Mail size={16} color={ThemeColors.emerald} />
                    </View>
                    <View>
                      <Text style={styles.detailCardLabel}>Email Address</Text>
                      <Text weight="medium" style={styles.detailCardValue}>
                        {selectedCustomer.email || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailCardDivider} />
                  <View style={styles.detailCardItem}>
                    <View style={[styles.detailIconBox, { backgroundColor: ThemeColors.amberDim }]}>
                      <MapPin size={16} color={ThemeColors.amber} />
                    </View>
                    <View>
                      <Text style={styles.detailCardLabel}>Address</Text>
                      <Text weight="medium" style={styles.detailCardValue}>
                        {selectedCustomer.address || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text weight="bold" style={styles.detailSectionTitle}>
                  Activity Snapshot
                </Text>
                <View style={styles.snapshotGrid}>
                  <View style={styles.snapshotBox}>
                    <Text style={styles.snapshotLabel}>Total Spent</Text>
                    <Text weight="bold" style={styles.snapshotValue}>
                      ₹{selectedCustomer.total_spent || 0}
                    </Text>
                  </View>
                  <View style={styles.snapshotBox}>
                    <Text style={styles.snapshotLabel}>Total Visits</Text>
                    <Text weight="bold" style={styles.snapshotValue}>
                      {selectedCustomer.total_visits || 0}
                    </Text>
                  </View>
                  <View style={[styles.snapshotBox, { backgroundColor: ThemeColors.accentDim }]}>
                    <Text style={[styles.snapshotLabel, { color: ThemeColors.accent }]}>Points</Text>
                    <Text weight="bold" style={[styles.snapshotValue, { color: ThemeColors.accent }]}>
                      {selectedCustomer.loyalty_points || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtnSecondary}>
                    <Text style={styles.actionBtnSecondaryText}>View History</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnPrimary}>
                    <Text weight="bold" style={styles.actionBtnPrimaryText}>
                      Edit Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyDetail}>
                <User size={64} color={ThemeColors.border} />
                <Text style={styles.emptyDetailText}>
                  Select a customer to view details
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <AddCustomerModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveCustomer}
        isSaving={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.lg,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md },
  menuBtn: { padding: 4 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: ThemeRadius.lg,
    backgroundColor: ThemeColors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ThemeColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: { fontSize: 20, color: ThemeColors.textPrimary },
  pageSubtitle: { fontSize: 13, color: ThemeColors.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: ThemeRadius.lg,
  },
  addBtnText: { color: ThemeColors.white, fontSize: 14 },
  body: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1, backgroundColor: ThemeColors.bg },
  statsRow: {
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.lg,
    gap: ThemeSpacing.lg,
  },
  statCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    padding: ThemeSpacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    minWidth: 180,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: ThemeRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: { fontSize: 24, color: ThemeColors.textPrimary },
  statLabel: { fontSize: 12, color: ThemeColors.textSecondary, marginTop: 2 },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    paddingHorizontal: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: ThemeColors.textPrimary,
    height: "100%",
  },
  refreshBtn: {
    width: 50,
    height: 50,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: ThemeSpacing.xl, paddingBottom: 100 },
  customerCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    marginBottom: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  customerCardSelected: {
    borderColor: ThemeColors.accent,
    backgroundColor: ThemeColors.accentDim,
  },
  customerCardInner: {
    flexDirection: "row",
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.lg,
    alignItems: "center",
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ThemeColors.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  avatarText: { fontSize: 18, color: ThemeColors.textSecondary, letterSpacing: 1 },
  customerInfo: { flex: 1, gap: 6 },
  customerNameRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  customerName: { fontSize: 16, color: ThemeColors.textPrimary },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  labelText: { fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  customerPhone: { fontSize: 13, color: ThemeColors.textSecondary },
  statsMiniRow: { flexDirection: "row", gap: ThemeSpacing.lg, marginTop: 4 },
  statMini: { flexDirection: "row", alignItems: "center", gap: 6 },
  statMiniText: { fontSize: 12, color: ThemeColors.textSecondary, fontWeight: "500" },
  detailPanel: {
    width: 380,
    backgroundColor: ThemeColors.surface,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
    padding: ThemeSpacing.xxl,
  },
  detailHeader: { alignItems: "center", marginBottom: ThemeSpacing.xl },
  detailAvatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: ThemeColors.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.lg,
  },
  detailAvatarLargeText: { fontSize: 32, color: ThemeColors.textSecondary, letterSpacing: 2 },
  detailNameLarge: { fontSize: 24, color: ThemeColors.textPrimary, marginBottom: 4 },
  detailJoined: { fontSize: 13, color: ThemeColors.textMuted },
  detailCard: {
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.xl,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    marginBottom: ThemeSpacing.xxl,
  },
  detailCardItem: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md, paddingVertical: ThemeSpacing.sm },
  detailIconBox: {
    width: 40,
    height: 40,
    borderRadius: ThemeRadius.lg,
    backgroundColor: ThemeColors.blueDim,
    justifyContent: "center",
    alignItems: "center",
  },
  detailCardLabel: { fontSize: 11, color: ThemeColors.textMuted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  detailCardValue: { fontSize: 14, color: ThemeColors.textPrimary },
  detailCardDivider: { height: 1, backgroundColor: ThemeColors.border, marginVertical: ThemeSpacing.sm },
  detailSectionTitle: { fontSize: 16, color: ThemeColors.textPrimary, marginBottom: ThemeSpacing.lg },
  snapshotGrid: { flexDirection: "row", flexWrap: "wrap", gap: ThemeSpacing.md, marginBottom: ThemeSpacing.xxl },
  snapshotBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
  },
  snapshotLabel: { fontSize: 12, color: ThemeColors.textSecondary, marginBottom: 6 },
  snapshotValue: { fontSize: 20, color: ThemeColors.textPrimary },
  actionRow: { flexDirection: "row", gap: ThemeSpacing.md, marginTop: ThemeSpacing.md },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
  },
  actionBtnSecondaryText: { fontSize: 14, color: ThemeColors.textPrimary, fontWeight: "600" },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: ThemeColors.accent,
    paddingVertical: 14,
    borderRadius: ThemeRadius.lg,
    alignItems: "center",
  },
  actionBtnPrimaryText: { fontSize: 14, color: ThemeColors.white },
  emptyState: { alignItems: "center", marginTop: 100, gap: ThemeSpacing.md },
  emptyStateText: { fontSize: 16, color: ThemeColors.textMuted },
  emptyDetail: { flex: 1, justifyContent: "center", alignItems: "center", gap: ThemeSpacing.md },
  emptyDetailText: { fontSize: 14, color: ThemeColors.textMuted },
});
