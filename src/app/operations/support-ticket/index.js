import { CommonHeader } from "@/components/common/CommonHeader";
import { Loader } from "@/components/common/Loader";
import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import {
  createSupportTicket,
  fetchSupportTickets,
  updateSupportTicket,
} from "@/store/slices/supportTicketSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { LifeBuoy, Plus, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const TABS = [
  { key: "all", label: "All Tickets" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

export default function SupportTicketScreen() {
  const dispatch = useDispatch();
  const { tickets, loading, createLoading, updateLoading } = useSelector(
    (state) => state.supportTicket,
  );

  const user = useSelector((state) => state.auth?.user);
  const activeBranch = useSelector((state) => state.branch?.activeBranch);
  const userBranchId = user?.branch_id;
  const currentBranchId =
    activeBranch && activeBranch !== "br-1" ? activeBranch : userBranchId;
  const currentBusinessId = user?.business_id;

  const { isWebDesktop } = useResponsive();

  // Filters
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Form State
  const [createData, setCreateData] = useState({
    subject: "",
    description: "",
    priority: "low",
  });

  const [editData, setEditData] = useState({
    id: null,
    status: "",
    priority: "",
    description: "",
    csat_score: "",
    resolution_time_hrs: "",
  });

  const [error, setError] = useState("");

  const loadTickets = () => {
    if (currentBranchId) {
      const params = { branch_id: currentBranchId };
      if (activeTab !== "all") {
        params.status = activeTab;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      dispatch(fetchSupportTickets(params));
    }
  };

  useEffect(() => {
    loadTickets();
  }, [dispatch, currentBranchId, activeTab]);

  // Search delay effect could be added here if needed, but for simplicity we can trigger search on submit or keep it simple.

  const handleCreateSubmit = async () => {
    setError("");
    if (!createData.subject.trim()) {
      return setError("Subject is required.");
    }

    const payload = {
      ...createData,
      branch_id: currentBranchId,
      business_id: currentBusinessId,
    };

    dispatch(createSupportTicket(payload))
      .unwrap()
      .then(() => {
        setCreateModalVisible(false);
        setCreateData({ subject: "", description: "", priority: "low" });
        loadTickets();
      })
      .catch((err) => {
        setError(err.message || "Failed to create ticket");
      });
  };

  const openEditModal = (ticket) => {
    setError("");
    setEditData({
      id: ticket.id,
      status: ticket.status || "open",
      priority: ticket.priority || "low",
      description: ticket.description || "",
      csat_score: ticket.csat_score ? ticket.csat_score.toString() : "",
      resolution_time_hrs: ticket.resolution_time_hrs
        ? ticket.resolution_time_hrs.toString()
        : "",
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    setError("");

    const payload = {
      status: editData.status,
      priority: editData.priority,
      description: editData.description,
    };

    if (editData.csat_score)
      payload.csat_score = parseFloat(editData.csat_score);
    if (editData.resolution_time_hrs)
      payload.resolution_time_hrs = parseFloat(editData.resolution_time_hrs);

    dispatch(updateSupportTicket({ id: editData.id, data: payload }))
      .unwrap()
      .then(() => {
        setEditModalVisible(false);
        loadTickets();
      })
      .catch((err) => {
        setError(err.message || "Failed to update ticket");
      });
  };

  const renderStatusBadge = (status) => {
    let color = ThemeColors.blue;
    let bgColor = ThemeColors.blue + "20";
    if (status === "resolved" || status === "closed") {
      color = ThemeColors.emerald;
      bgColor = ThemeColors.emerald + "20";
    } else if (status === "open") {
      color = ThemeColors.amber;
      bgColor = ThemeColors.amber + "20";
    } else if (status === "escalated") {
      color = ThemeColors.red;
      bgColor = ThemeColors.red + "20";
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text weight="bold" style={[styles.badgeText, { color }]}>
          {status ? status.replace("_", " ").toUpperCase() : "OPEN"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <CommonHeader
        title="Support Tickets"
        bottomContent={
          <View style={styles.toolbarRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabs}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    style={[
                      styles.filterTab,
                      isActive && {
                        backgroundColor: ThemeColors.emerald,
                        borderColor: ThemeColors.emerald,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
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

            <View style={styles.searchWrap}>
              <Search
                size={18}
                color={ThemeColors.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tickets..."
                placeholderTextColor={ThemeColors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={loadTickets}
              />
            </View>
          </View>
        }
        isDesktop={isWebDesktop}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.listContent}
      >
        <View style={{ minWidth: 900, width: "100%" }}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.col, { width: 130 }]}>
              Ticket #
            </Text>
            <Text weight="bold" style={[styles.col, { width: 180 }]}>
              Date
            </Text>
            <Text weight="bold" style={[styles.col, { width: 220 }]}>
              Subject
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { flex: 1, minWidth: 200 }]}
            >
              Description
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 100, textAlign: "center" }]}
            >
              Priority
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 120, textAlign: "right" }]}
            >
              Status
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={{ padding: 60, alignItems: "center" }}>
                <Loader text="Loading tickets..." />
              </View>
            ) : !tickets || tickets.length === 0 ? (
              <View style={styles.emptyWrap}>
                <LifeBuoy
                  size={48}
                  color={ThemeColors.textMuted}
                  style={{ marginBottom: 16 }}
                />
                <Text weight="semibold" style={styles.emptyTitle}>
                  No Support Tickets Found
                </Text>
                <Text style={styles.emptyDesc}>
                  No tickets match your current filters.
                </Text>
              </View>
            ) : (
              tickets.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.tableRow}
                  activeOpacity={0.7}
                  // onPress={() => openEditModal(item)}
                >
                  <Text
                    style={[
                      styles.col,
                      { width: 130, color: ThemeColors.blue },
                    ]}
                    numberOfLines={1}
                  >
                    {item.ticket_number || item.id?.slice(0, 8).toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.col,
                      { width: 180, color: ThemeColors.textMuted },
                    ]}
                  >
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </Text>
                  <Text
                    weight="semibold"
                    style={[styles.col, { width: 220 }]}
                    numberOfLines={1}
                  >
                    {item.subject || "-"}
                  </Text>
                  <Text
                    style={[
                      styles.col,
                      {
                        flex: 1,
                        minWidth: 200,
                        color: ThemeColors.textSecondary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.description || "-"}
                  </Text>
                  <Text
                    style={[
                      styles.col,
                      {
                        width: 100,
                        textAlign: "center",
                        textTransform: "capitalize",
                      },
                    ]}
                  >
                    {item.priority || "low"}
                  </Text>
                  <View
                    style={[styles.col, { width: 120, alignItems: "flex-end" }]}
                  >
                    {renderStatusBadge(item.status || "open")}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setError("");
          setCreateData({ subject: "", description: "", priority: "low" });
          setCreateModalVisible(true);
        }}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>New Ticket</Text>
      </TouchableOpacity>

      {/* Create Ticket Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text weight="bold" style={styles.modalTitle}>
                Create Support Ticket
              </Text>
              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g. POS Printer not working"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={createData.subject}
                  onChangeText={(text) =>
                    setCreateData({ ...createData, subject: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Priority</Text>
                <Dropdown
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                    { label: "Critical", value: "critical" },
                  ]}
                  value={createData.priority}
                  onChange={(val) =>
                    setCreateData({ ...createData, priority: val })
                  }
                  style={styles.dropdownCustom}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your issue in detail"
                  placeholderTextColor={ThemeColors.textMuted}
                  value={createData.description}
                  onChangeText={(text) =>
                    setCreateData({ ...createData, description: text })
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text weight="semibold" style={styles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleCreateSubmit}
                disabled={createLoading}
              >
                <Text weight="bold" style={styles.saveBtnText}>
                  {createLoading ? "Submitting..." : "Submit Ticket"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Ticket Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text weight="bold" style={styles.modalTitle}>
                Update Support Ticket
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Status</Text>
                    <Dropdown
                      options={[
                        { label: "Open", value: "open" },
                        { label: "In Progress", value: "in_progress" },
                        { label: "Escalated", value: "escalated" },
                        { label: "Resolved", value: "resolved" },
                        { label: "Closed", value: "closed" },
                      ]}
                      value={editData.status}
                      onChange={(val) =>
                        setEditData({ ...editData, status: val })
                      }
                      style={styles.dropdownCustom}
                    />
                  </View>
                </View>
                <View style={styles.flex1}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Priority</Text>
                    <Dropdown
                      options={[
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" },
                        { label: "Critical", value: "critical" },
                      ]}
                      value={editData.priority}
                      onChange={(val) =>
                        setEditData({ ...editData, priority: val })
                      }
                      style={styles.dropdownCustom}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (Append or Change)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Update description..."
                  placeholderTextColor={ThemeColors.textMuted}
                  value={editData.description}
                  onChangeText={(text) =>
                    setEditData({ ...editData, description: text })
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {(editData.status === "resolved" ||
                editData.status === "closed") && (
                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>CSAT Score (1-5)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 4.5"
                        placeholderTextColor={ThemeColors.textMuted}
                        value={editData.csat_score}
                        onChangeText={(text) =>
                          setEditData({ ...editData, csat_score: text })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.flex1}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Resolution Time (Hrs)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 2.5"
                        placeholderTextColor={ThemeColors.textMuted}
                        value={editData.resolution_time_hrs}
                        onChangeText={(text) =>
                          setEditData({
                            ...editData,
                            resolution_time_hrs: text,
                          })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text weight="semibold" style={styles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleEditSubmit}
                disabled={updateLoading}
              >
                <Text weight="bold" style={styles.saveBtnText}>
                  {updateLoading ? "Saving..." : "Update Ticket"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  filterTabs: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  filterTab: {
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
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    width: 200,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  container: {
    width: "100%",
  },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    borderTopLeftRadius: ThemeRadius.md,
    borderTopRightRadius: ThemeRadius.md,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
    backgroundColor: ThemeColors.white,
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeText: { fontSize: 10 },
  emptyWrap: {
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  emptyDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  fab: {
    position: "absolute",
    right: ThemeSpacing.xl,
    bottom: ThemeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: 100,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xl,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  modalTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: { padding: 4 },
  modalContent: {
    padding: ThemeSpacing.xl,
  },
  inputGroup: {
    marginBottom: ThemeSpacing.lg,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: ThemeColors.white,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.md,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  dropdownCustom: {
    height: 44,
    paddingHorizontal: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.white,
    borderColor: ThemeColors.border,
    borderWidth: 1,
  },
  errorText: {
    color: ThemeColors.red,
    marginBottom: ThemeSpacing.md,
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
    gap: ThemeSpacing.md,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: ThemeColors.bg,
  },
  cancelBtnText: {
    color: ThemeColors.textPrimary,
  },
  saveBtn: {
    backgroundColor: ThemeColors.primary,
  },
  saveBtnText: {
    color: ThemeColors.white,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  flex1: { flex: 1 },
});
