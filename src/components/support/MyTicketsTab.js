import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Plus, Search, Tag, Calendar } from "lucide-react-native";
import { useSupport } from "@/context/SupportContext";
import { CreateTicketModal } from "./CreateTicketModal";
import { useResponsive } from "@/hooks/useResponsive";

export function MyTicketsTab() {
  const { tickets } = useSupport();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { isDesktop, isTablet, isMiniTab, width } = useResponsive();

  // Responsive columns: desktop 4, tablet 3, mini tab 2, mobile 1
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 1;

  // Calculate explicit card width so last row items don't stretch
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2; // 32
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth = numColumns > 1 ? Math.floor(availableWidth / numColumns) : "100%";

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open": return { bg: ThemeColors.blue + '15', text: ThemeColors.blue };
      case "In Progress": return { bg: ThemeColors.amber + '15', text: ThemeColors.amber };
      case "Resolved": return { bg: ThemeColors.emerald + '15', text: ThemeColors.emerald };
      default: return { bg: ThemeColors.surfaceHighlight, text: ThemeColors.textMuted };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High": return { bg: ThemeColors.red + '15', text: ThemeColors.red };
      case "Medium": return { bg: ThemeColors.amber + '15', text: ThemeColors.amber };
      case "Low": return { bg: ThemeColors.emerald + '15', text: ThemeColors.emerald };
      default: return { bg: ThemeColors.surfaceHighlight, text: ThemeColors.textMuted };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text weight="bold" style={styles.title}>My Support Tickets</Text>
          <Text style={styles.subtitle}>Track and manage your requests.</Text>
        </View>
        <TouchableOpacity 
          style={styles.newBtn}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Plus size={18} color={ThemeColors.white} />
          <Text weight="bold" style={styles.newBtnText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {tickets.length > 0 ? (
          tickets.map((ticket) => {
            const statusStyle = getStatusStyle(ticket.status);
            const priorityStyle = getPriorityStyle(ticket.priority);

            return (
              <TouchableOpacity key={ticket.id} style={[styles.card, { width: cardWidth }]} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text weight="bold" style={styles.ticketId}>{ticket.id}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                    <Text weight="bold" style={[styles.badgeText, { color: statusStyle.text }]}>
                      {ticket.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text weight="bold" style={styles.ticketSubject} numberOfLines={2}>
                  {ticket.subject}
                </Text>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Tag size={14} color={ThemeColors.textMuted} />
                    <Text style={styles.infoText}>{ticket.category}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Calendar size={14} color={ThemeColors.textMuted} />
                    <Text style={styles.infoText}>{ticket.date}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.priorityLabel}>Priority</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                    <Text weight="bold" style={[styles.priorityText, { color: priorityStyle.text }]}>
                      {ticket.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tickets found.</Text>
          </View>
        )}
      </View>

      <CreateTicketModal 
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: ThemeSpacing.sm,
    gap: ThemeSpacing.md,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.blue,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    gap: 8,
  },
  newBtnText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.sm,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  ticketId: {
    fontSize: 14,
    color: ThemeColors.blue,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  ticketSubject: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    lineHeight: 22,
    minHeight: 44,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
  },
  cardBody: {
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 'auto',
    paddingTop: ThemeSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  priorityLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  emptyState: {
    padding: ThemeSpacing.xxl,
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 15,
  }
});
