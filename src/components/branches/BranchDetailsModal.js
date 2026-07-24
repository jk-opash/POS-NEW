import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { 
  X, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  Package, 
  Users, 
  ArrowRightLeft,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  ShieldCheck,
  FileText,
  Edit2
} from "lucide-react-native";
import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from "react-native";

const MOCK_TRANSFERS = [
  { id: "TRF-1001", type: "Outbound", to: "Surat Outlet", status: "In Transit", items: 45, date: "2024-03-20" },
  { id: "TRF-1002", type: "Inbound", from: "Mumbai HQ", status: "Draft", items: 120, date: "2024-03-21" },
  { id: "TRF-1003", type: "Outbound", to: "Mumbai HQ", status: "Completed", items: 12, date: "2024-03-18" },
];

const MOCK_EMPLOYEES = [
  { id: "EMP-001", name: "Rahul Sharma", role: "Branch Manager", shift: "Morning", status: "Active" },
  { id: "EMP-002", name: "Aarav Patel", role: "Cashier", shift: "Morning", status: "Active" },
  { id: "EMP-003", name: "Priya Singh", role: "Sales Associate", shift: "Evening", status: "On Leave" },
  { id: "EMP-004", name: "Vikram Kumar", role: "Stock Clerk", shift: "Night", status: "Active" },
];

export function BranchDetailsModal({ visible, branch, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, inventory, employees
  const { isDesktop, isTablet, isMiniTab } = useResponsive();

  if (!branch) return null;

  const isActive = branch.status === "Operational" || branch.status === "Active";
  
  // Calculate columns for transfers: 4 on tablet/desktop, 3 on minitab, 1 on mobile
  const colCount = isDesktop || isTablet ? 4 : isMiniTab ? 3 : 1;
  const colWidth = colCount === 1 ? "100%" : colCount === 3 ? "31%" : "23%";

  // Calculate columns for employees: 3 on tablet, 2 on minitab
  const empColCount = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;
  const empColWidth = empColCount === 1 ? "100%" : empColCount === 2 ? "48%" : empColCount === 3 ? "31%" : "23%";

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Text weight="bold" style={styles.sectionTitle}>Performance Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <TrendingUp size={20} color={ThemeColors.emerald} />
          <Text style={styles.metricLabel}>Total Revenue</Text>
          <Text weight="bold" style={styles.metricValue}>₹{(branch.metrics?.revenue || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Activity size={20} color={ThemeColors.blue} />
          <Text style={styles.metricLabel}>Net Profit</Text>
          <Text weight="bold" style={styles.metricValue}>₹{(branch.metrics?.profit || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Package size={20} color={ThemeColors.amber} />
          <Text style={styles.metricLabel}>Inventory Value</Text>
          <Text weight="bold" style={styles.metricValue}>₹{(branch.metrics?.inventoryValue || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Users size={20} color={ThemeColors.textPrimary} />
          <Text style={styles.metricLabel}>Customers</Text>
          <Text weight="bold" style={styles.metricValue}>{(branch.metrics?.customerCount || 0).toLocaleString()}</Text>
        </View>
        <View style={styles.metricCard}>
          <Clock size={20} color={ThemeColors.textSecondary} />
          <Text style={styles.metricLabel}>Avg Checkout</Text>
          <Text weight="bold" style={styles.metricValue}>{branch.metrics?.averageCheckoutTime || "N/A"}</Text>
        </View>
        <View style={styles.metricCard}>
          <Activity size={20} color={ThemeColors.red} />
          <Text style={styles.metricLabel}>Shrinkage</Text>
          <Text weight="bold" style={styles.metricValue}>{branch.metrics?.shrinkage || "0%"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text weight="bold" style={styles.sectionTitle}>Organizational Details</Text>
      <View style={styles.detailsList}>
        <View style={styles.detailItem}>
          <Building2 size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Company: {branch.company || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Region: {branch.region || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <User size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Manager: {branch.manager || "Not Assigned"}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Location: {branch.address}, {branch.city}, {branch.state}, {branch.country}</Text>
        </View>
        <View style={styles.detailItem}>
          <Phone size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Contact: {branch.contact}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text weight="bold" style={styles.sectionTitle}>Operating Calendar</Text>
      <View style={styles.detailsList}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Weekday Hours: {branch.schedule?.weekday || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Weekend Hours: {branch.schedule?.weekend || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Time Zone: {branch.timeZone || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text weight="bold" style={styles.sectionTitle}>Compliance & Legal</Text>
      <View style={styles.detailsList}>
        <View style={styles.detailItem}>
          <ShieldCheck size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Tax Jurisdiction: {branch.taxJurisdiction || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <FileText size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Tax Registration ID: {branch.taxRegistration || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Building2 size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Store Size: {branch.storeSize || "N/A"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar size={16} color={ThemeColors.textMuted} />
          <Text style={styles.detailText}>Opening Date: {branch.openingDate || "N/A"}</Text>
        </View>
      </View>
    </View>
  );

  const renderInventoryTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoHeader}>
        <Text weight="bold" style={styles.sectionTitle}>Local Inventory</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <ArrowRightLeft size={16} color={ThemeColors.white} />
          <Text weight="bold" style={styles.actionBtnText}>New Transfer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.placeholderBox}>
        <Package size={32} color={ThemeColors.textMuted} />
        <Text style={styles.placeholderText}>
          Total Inventory Value: ₹{(branch.metrics?.inventoryValue || 0).toLocaleString()}
        </Text>
      </View>
      
      <Text weight="bold" style={[styles.sectionTitle, { marginTop: ThemeSpacing.xl }]}>Recent Transfers</Text>
      <View style={[styles.transferList, { flexDirection: "row", flexWrap: "wrap" }]}>
        {MOCK_TRANSFERS.map((t) => (
          <View key={t.id} style={[styles.transferCard, { width: colWidth, flexGrow: 1 }]}>
            <View style={styles.transferHeader}>
              <Text weight="bold" style={styles.transferId}>{t.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: t.status === "Completed" ? ThemeColors.emeraldDim : t.status === "In Transit" ? ThemeColors.blueDim : ThemeColors.amberDim }]}>
                <Text style={[styles.statusText, { color: t.status === "Completed" ? ThemeColors.emerald : t.status === "In Transit" ? ThemeColors.blue : ThemeColors.amber }]}>{t.status}</Text>
              </View>
            </View>
            <View style={styles.transferRoute}>
              <Text style={styles.transferLabel}>{t.type === "Outbound" ? "To: " : "From: "}</Text>
              <Text weight="bold" style={styles.transferValue}>{t.type === "Outbound" ? t.to : t.from}</Text>
            </View>
            <View style={styles.transferFooter}>
              <Text style={styles.transferDate}>{t.date}</Text>
              <Text style={styles.transferItems}>{t.items} Items</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEmployeesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoHeader}>
        <Text weight="bold" style={styles.sectionTitle}>Assigned Employees ({branch.metrics?.employeeCount || 0})</Text>
      </View>
      <View style={[styles.employeeList, { flexDirection: "row", flexWrap: "wrap" }]}>
        {MOCK_EMPLOYEES.map((emp) => (
          <View key={emp.id} style={[styles.employeeCard, { width: empColWidth, flexGrow: 1 }]}>
            <View style={styles.employeeHeader}>
              <View style={styles.employeeAvatar}>
                <User size={20} color={ThemeColors.textMuted} />
              </View>
              <View style={styles.employeeInfo}>
                <Text weight="bold" style={styles.employeeName}>{emp.name}</Text>
                <Text style={styles.employeeRole}>{emp.role}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: emp.status === "Active" ? ThemeColors.emeraldDim : ThemeColors.amberDim }]}>
                <Text style={[styles.statusText, { color: emp.status === "Active" ? ThemeColors.emerald : ThemeColors.amber }]}>{emp.status}</Text>
              </View>
            </View>
            <View style={styles.employeeFooter}>
              <View style={styles.employeeDetail}>
                <Text style={styles.employeeDetailLabel}>ID:</Text>
                <Text style={styles.employeeDetailValue}>{emp.id}</Text>
              </View>
              <View style={styles.employeeDetail}>
                <Clock size={12} color={ThemeColors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.employeeDetailValue}>{emp.shift} Shift</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconWrap, { backgroundColor: isActive ? ThemeColors.emeraldDim : ThemeColors.redDim }]}>
                <Building2 size={28} color={isActive ? ThemeColors.emerald : ThemeColors.red} />
              </View>
              <View>
                <Text weight="bold" style={styles.title}>{branch.name}</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.codeText}>{branch.code}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isActive ? ThemeColors.emeraldDim : ThemeColors.redDim }]}>
                    <Text weight="bold" style={[styles.statusText, { color: isActive ? ThemeColors.emerald : ThemeColors.red }]}>
                      {branch.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ThemeSpacing.md }}>
              <TouchableOpacity onPress={onEdit} style={styles.closeBtn}>
                <Edit2 size={20} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === "overview" && styles.activeTab]}
                onPress={() => setActiveTab("overview")}
              >
                <Text weight="bold" style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Overview</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === "inventory" && styles.activeTab]}
                onPress={() => setActiveTab("inventory")}
              >
                <Text weight="bold" style={[styles.tabText, activeTab === "inventory" && styles.activeTabText]}>Inventory & Transfers</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === "employees" && styles.activeTab]}
                onPress={() => setActiveTab("employees")}
              >
                <Text weight="bold" style={[styles.tabText, activeTab === "employees" && styles.activeTabText]}>Employees</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {activeTab === "overview" && renderOverviewTab()}
            {activeTab === "inventory" && renderInventoryTab()}
            {activeTab === "employees" && renderEmployeesTab()}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "90%",
    backgroundColor: ThemeColors.bg,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
    alignItems: "center",
  },
  iconWrap: {
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.lg,
  },
  title: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  codeText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 2,
    borderRadius: ThemeRadius.full,
  },
  statusText: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  tabsWrapper: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.xl,
  },
  tab: {
    paddingVertical: ThemeSpacing.md,
    marginRight: ThemeSpacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: ThemeColors.emerald,
  },
  tabText: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  activeTabText: {
    color: ThemeColors.emerald,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: ThemeSpacing.xl,
    paddingBottom: ThemeSpacing.xxxl * 2,
    flexGrow: 1,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.lg,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  metricLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: ThemeSpacing.md,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.xxl,
  },
  detailsList: {
    gap: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  detailText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.lg,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.full,
  },
  actionBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  placeholderBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: ThemeSpacing.xxl,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: "dashed",
    gap: ThemeSpacing.lg,
  },
  placeholderText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  transferList: {
    gap: ThemeSpacing.md,
  },
  transferCard: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  transferHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.sm,
  },
  transferId: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  transferRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  transferLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  transferValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  transferFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  transferDate: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  transferItems: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  employeeList: {
    gap: ThemeSpacing.md,
  },
  employeeCard: {
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ThemeSpacing.md,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  employeeRole: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  employeeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  employeeDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeDetailLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginRight: 4,
  },
  employeeDetailValue: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
});
