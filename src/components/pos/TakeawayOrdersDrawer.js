import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { X, Clock, ShoppingBag, User, ChevronRight } from 'lucide-react-native';

const TakeawayKOTCard = ({ kot, onSelect }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const timeValue = kot.time || kot.startTime || kot.createdAt;
      if (!timeValue) return;
      const start = new Date(timeValue).getTime();
      if (isNaN(start)) return;
      setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [kot.time, kot.startTime, kot.createdAt]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0m 0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const customerName = kot.customer?.name || "Walk-in";
  const customerPhone = kot.customer?.contact || "";
  const items = kot.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.sellingPrice ?? item.product?.pricing?.sellingPrice ?? item.product?.price ?? 0;
    return sum + price * (item.quantity || item.qty || 1);
  }, 0);

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onSelect(kot.id)} activeOpacity={0.8}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.platformIconBox, { backgroundColor: ThemeColors.primary + "15" }]}>
          <ShoppingBag size={18} color={ThemeColors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text weight="bold" style={styles.cardKotTitle} numberOfLines={1}>
            KOT #{kot.kotNumber}
          </Text>
          <View style={styles.cardTimeRow}>
            <Clock size={11} color={ThemeColors.textMuted} />
            <Text style={styles.cardTime}>{formatTime(elapsed)} ago</Text>
          </View>
        </View>
        <View style={styles.loadBadge}>
          <Text weight="semibold" style={styles.loadBadgeText}>Load</Text>
          <ChevronRight size={12} color={ThemeColors.primary} />
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.customerSection}>
        <View style={styles.customerRow}>
          <User size={13} color={ThemeColors.textMuted} />
          <Text weight="semibold" style={styles.customerName}>{customerName}</Text>
          {!!customerPhone && (
            <Text style={styles.customerPhone}> · {customerPhone}</Text>
          )}
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsList}>
        {items.slice(0, 4).map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.qtyBadge}>
              <Text weight="bold" style={styles.qtyText}>
                {item.quantity || item.qty || 1}×
              </Text>
            </View>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product?.name || item.name || "Item"}
            </Text>
          </View>
        ))}
        {items.length > 4 && (
          <Text style={styles.moreItems}>+{items.length - 4} more items…</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerLabel}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
        <Text weight="bold" style={styles.footerTotal}>₹{total.toFixed(0)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export function TakeawayOrdersDrawer({ visible, onClose, orders = [], onSelectOrder }) {
  const slideAnim = useRef(new Animated.Value(450)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(450);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 450,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>

            {/* Header */}
            <View style={styles.panelHeader}>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <X size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text weight="bold" style={styles.panelTitle}>Takeaway Orders</Text>
                <Text style={styles.panelSubtitle}>{orders.length} active order{orders.length !== 1 ? "s" : ""}</Text>
              </View>
            </View>

            {/* Hint */}
            {orders.length > 0 && (
              <View style={styles.hintBanner}>
                <Text style={styles.hintText}>Tap a card to load its items to the POS for payment</Text>
              </View>
            )}

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
              {orders.length === 0 ? (
                <View style={styles.emptyState}>
                  <ShoppingBag size={48} color={ThemeColors.borderSubtle} />
                  <Text weight="semibold" style={styles.emptyTitle}>No Active Takeaway Orders</Text>
                  <Text style={styles.emptyText}>Create a KOT for a Takeaway order to see it here.</Text>
                </View>
              ) : (
                orders.map((kot) => (
                  <TakeawayKOTCard
                    key={kot.id}
                    kot={kot}
                    onSelect={onSelectOrder}
                  />
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    width: 420,
    backgroundColor: ThemeColors.bg,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    backgroundColor: ThemeColors.surface,
    gap: ThemeSpacing.md,
  },
  closeBtn: {
    padding: ThemeSpacing.xs,
  },
  panelTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    lineHeight: 22,
  },
  panelSubtitle: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 1,
  },
  hintBanner: {
    backgroundColor: ThemeColors.primary + "12",
    paddingVertical: ThemeSpacing.sm,
    paddingHorizontal: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.primary + "20",
  },
  hintText: {
    fontSize: 12,
    color: ThemeColors.primary,
    textAlign: 'center',
  },
  scroll: {
    padding: ThemeSpacing.lg,
    gap: ThemeSpacing.md,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
    gap: ThemeSpacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
    marginTop: ThemeSpacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    textAlign: 'center',
    paddingHorizontal: ThemeSpacing.xl,
  },

  // Card
  orderCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: ThemeSpacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    gap: ThemeSpacing.md,
  },
  platformIconBox: {
    width: 38,
    height: 38,
    borderRadius: ThemeRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardKotTitle: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  cardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardTime: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
  loadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.full,
    gap: 2,
  },
  loadBadgeText: {
    fontSize: 12,
    color: ThemeColors.primary,
  },
  customerSection: {
    paddingHorizontal: ThemeSpacing.md,
    paddingTop: ThemeSpacing.md,
    paddingBottom: ThemeSpacing.sm,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  customerName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  customerPhone: {
    fontSize: 13,
    color: ThemeColors.textMuted,
  },
  itemsList: {
    paddingHorizontal: ThemeSpacing.md,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.sm,
  },
  qtyBadge: {
    backgroundColor: ThemeColors.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 11,
    color: ThemeColors.textPrimary,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  moreItems: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginTop: 2,
    paddingLeft: 34,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  footerLabel: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  footerTotal: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
});
