import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { X, Clock, ShoppingCart, User } from 'lucide-react-native';
import { usePOS } from '@/context/POSContext';

export function ParkedSalesModal({ visible, onClose }) {
  const { parkedSales, restoreParkedSale, deleteParkedSale } = usePOS();

  const handleRestore = (tabId) => {
    restoreParkedSale(tabId);
    onClose();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Parked Sales ({parkedSales.length})</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {parkedSales.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color={ThemeColors.border} />
              <Text style={styles.emptyText}>No parked sales</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.list}>
              {parkedSales.map((tab) => (
                <View key={tab.id} style={styles.tabCard}>
                  <View style={styles.tabHeader}>
                    <Text style={styles.tabName}>{tab.name}</Text>
                    <Text style={styles.tabTime}>{formatTime(tab.time)}</Text>
                  </View>
                  
                  <View style={styles.tabDetails}>
                    <View style={styles.detailRow}>
                      <User size={14} color={ThemeColors.textMuted} />
                      <Text style={styles.detailText}>
                        {tab.customer ? tab.customer.name : 'Walk-in'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <ShoppingCart size={14} color={ThemeColors.textMuted} />
                      <Text style={styles.detailText}>
                        {(tab.cart?.length || 0) + (tab.runningOrder?.length || 0)} items • ₹{tab.totals?.grandTotal ? tab.totals.grandTotal.toFixed(2) : "0.00"}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.restoreBtn}
                    onPress={() => handleRestore(tab.id)}
                  >
                    <Text style={styles.restoreBtnText}>Resume Sale</Text>
                  </TouchableOpacity>
                </View>
              ))}
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "80%",
    backgroundColor: ThemeColors.surface,
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ThemeSpacing.md,
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 16,
  },
  list: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.md,
  },
  tabCard: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ThemeSpacing.sm,
  },
  tabName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ThemeColors.textPrimary,
  },
  tabTime: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  tabDetails: {
    gap: ThemeSpacing.xs,
    marginBottom: ThemeSpacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  restoreBtn: {
    backgroundColor: ThemeColors.emerald,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    alignItems: 'center',
  },
  restoreBtnText: {
    color: ThemeColors.white,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
