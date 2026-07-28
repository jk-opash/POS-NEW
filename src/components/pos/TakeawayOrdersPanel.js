import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from '@/theme/theme';
import { X, Clock, ShoppingBag, User, Plus } from 'lucide-react-native';
import { usePOS } from '@/context/POSContext';

export function TakeawayOrdersPanel({ visible, onClose }) {
  const { takeawaySessions, activeTakeawayId, setActiveTakeaway, createNewTakeaway } = usePOS();
  
  const sessionsList = Object.keys(takeawaySessions || {}).map(id => ({
    id,
    ...takeawaySessions[id]
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleRestore = (id) => {
    setActiveTakeaway(id);
    onClose();
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.panel}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title} weight="bold">Active Takeaways ({sessionsList.length})</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.newBtn}
                onPress={() => {
                  createNewTakeaway();
                  onClose();
                }}
              >
                <Plus size={16} color="white" />
                <Text style={styles.newBtnText} weight="bold">New</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {sessionsList.length === 0 ? (
            <View style={styles.emptyState}>
              <ShoppingBag size={48} color={ThemeColors.border} />
              <Text style={styles.emptyTitle} weight="medium">No active takeaway orders</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.list}>
              {sessionsList.map((session) => {
                const totalItems = session.cart ? session.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
                const isActive = session.id === activeTakeawayId;
                
                return (
                  <TouchableOpacity
                    key={session.id}
                    style={[styles.card, isActive && styles.cardActive]}
                    onPress={() => handleRestore(session.id)}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.tabName} weight="bold">{session.id}</Text>
                      {session.createdAt && (
                        <View style={styles.timeRow}>
                          <Clock size={14} color={ThemeColors.textMuted} />
                          <Text style={styles.timeText}>{formatTime(session.createdAt)}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.cardBody}>
                      <View style={styles.infoRow}>
                        <User size={16} color={ThemeColors.textSecondary} />
                        <Text style={styles.infoText}>
                          {session.customer ? session.customer.name : 'No Customer Assigned'}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <ShoppingBag size={16} color={ThemeColors.textSecondary} />
                        <Text style={styles.infoText}>
                          {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.resumeBtn}>
                      <Text style={styles.resumeBtnText} weight="bold">
                        {isActive ? 'Currently Open' : 'Resume Order'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    width: 400,
    backgroundColor: ThemeColors.surface,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.md,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    gap: 4,
  },
  newBtnText: {
    color: 'white',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.xs,
  },
  list: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: ThemeSpacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    color: ThemeColors.textMuted,
  },
  card: {
    backgroundColor: ThemeColors.background,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cardActive: {
    borderColor: ThemeColors.primary,
    backgroundColor: ThemeColors.primary + '0A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ThemeSpacing.md,
  },
  tabName: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  cardBody: {
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  resumeBtn: {
    backgroundColor: ThemeColors.primary + '1A',
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    alignItems: 'center',
  },
  resumeBtnText: {
    color: ThemeColors.primary,
    fontSize: 14,
  },
});
