import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Clock, ShoppingCart, User, X, Play, Trash2, CalendarDays } from "lucide-react-native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 768;

export function ParkedSalesModal({ visible, onClose, parkedSales = [], onRestore, onDelete }) {
  const handleRestore = (tabId) => {
    onRestore(tabId);
    onClose();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isSmallScreen && styles.modalContainerMobile]}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Parked Sales</Text>
              <Text style={styles.subtitle}>
                {parkedSales.length} {parkedSales.length === 1 ? 'order' : 'orders'} on hold
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {parkedSales.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Clock size={48} color={ThemeColors.border} />
              </View>
              <Text style={styles.emptyTitle}>No Parked Sales</Text>
              <Text style={styles.emptyText}>Orders put on hold will appear here.</Text>
            </View>
          ) : (
            <ScrollView 
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.grid}>
                {parkedSales.map((tab) => (
                  <View key={tab.id} style={[styles.tabCard, isSmallScreen && styles.tabCardMobile]}>
                    <View style={styles.cardHeader}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{tab.name}</Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <CalendarDays size={14} color={ThemeColors.textMuted} />
                        <Text style={styles.timeText}>{formatDate(tab.time)} • {formatTime(tab.time)}</Text>
                      </View>
                    </View>

                    <View style={styles.cardBody}>
                      <View style={styles.detailItem}>
                        <User size={16} color={ThemeColors.textSecondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {tab.customer ? tab.customer.name : "Walk-in Customer"}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <ShoppingCart size={16} color={ThemeColors.textSecondary} />
                        <Text style={styles.detailText}>
                          {(tab.cart?.length || 0) + (tab.runningOrder?.length || 0)} items
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <View style={styles.cardFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total Amount</Text>
                        <Text style={styles.priceValue}>
                          ₹{tab.totals?.grandTotal ? tab.totals.grandTotal.toFixed(2) : "0.00"}
                        </Text>
                      </View>
                      
                      <View style={styles.actionGroup}>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => onDelete(tab.id)}
                        >
                          <Trash2 size={18} color={ThemeColors.red} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.restoreBtn}
                          onPress={() => handleRestore(tab.id)}
                        >
                          <Play size={16} color={ThemeColors.white} fill={ThemeColors.white} />
                          <Text style={styles.restoreBtnText}>Resume</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.md,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 900,
    height: "85%",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  modalContainerMobile: {
    height: "95%",
    marginTop: "10%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    backgroundColor: ThemeColors.bg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    marginTop: 4,
    fontWeight: "500",
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ThemeColors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.xl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: ThemeColors.bg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ThemeSpacing.xl,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 16,
    textAlign: "center",
  },
  list: {
    padding: ThemeSpacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.lg,
  },
  tabCard: {
    width: "48%", // 2 columns with gap
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tabCardMobile: {
    width: "100%", // 1 column on mobile
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.lg,
  },
  badge: {
    backgroundColor: ThemeColors.primary + "15",
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.primary + "30",
  },
  badgeText: {
    color: ThemeColors.primary,
    fontWeight: "bold",
    fontSize: 13,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
  cardBody: {
    gap: ThemeSpacing.md,
    marginBottom: ThemeSpacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginBottom: ThemeSpacing.lg,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "900",
    color: ThemeColors.textPrimary,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.red + "10",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.red + "30",
  },
  restoreBtn: {
    flexDirection: "row",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.lg,
    height: 44,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    gap: 8,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restoreBtnText: {
    color: ThemeColors.white,
    fontWeight: "bold",
    fontSize: 15,
  },
});
