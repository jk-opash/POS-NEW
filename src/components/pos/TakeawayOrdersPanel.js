import { orderApi } from "@/api/services";
import { Text } from "@/components/ui/Text";
import {
  fetchActiveOrders,
  setActiveOrder,
  setCustomer,
  setOrderType,
} from "@/store/slices/posSlice";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { ArrowRight, Clock, ShoppingBag, X } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export function TakeawayOrdersPanel({ visible, onClose, branchId }) {
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.pos) || {};
  const activeOrders = posState.activeOrders || [];
  const activeTakeawayId = posState.activeOrderId;

  const takeawaySessions = activeOrders.filter(
    (order) => order.order_type === "Takeaway" && order.status !== "Completed",
  );

  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible, slideAnim]);

  const handleClosePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const sessionsList = takeawaySessions.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const handleRestore = (order) => {
    dispatch(setActiveOrder(order));
    dispatch(setOrderType("Takeaway"));
    if (order.customer_info) {
      dispatch(setCustomer(order.customer_info));
    }
    handleClosePanel();
  };

  const handleCloseOrder = async (orderId) => {
    try {
      await orderApi.update(orderId, { status: "Completed" });
      dispatch(fetchActiveOrders(branchId));
    } catch (error) {
      console.error("Failed to close order", error);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getOrderStatus = (runningOrder) => {
    if (!runningOrder || runningOrder.length === 0) return "Pending";
    const allServed = runningOrder.every((item) => item.status === "Served");
    if (allServed) return "Ready";
    const anyPreparing = runningOrder.some(
      (item) => item.status === "Preparing" || item.status === "Served",
    );
    if (anyPreparing) return "Preparing";
    return "Accepted";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClosePanel}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleClosePanel}
          activeOpacity={1}
        />

        <Animated.View
          style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title} weight="bold">
                Active Takeaways ({sessionsList.length})
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleClosePanel}
                style={styles.closeBtn}
              >
                <X size={24} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {sessionsList.length === 0 ? (
            <View style={styles.emptyState}>
              <ShoppingBag size={48} color={ThemeColors.border} />
              <Text style={styles.emptyTitle} weight="medium">
                No active takeaway orders
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.list}>
              {sessionsList.map((session) => {
                const totalItems = session.running_order
                  ? session.running_order.reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0,
                    )
                  : 0;
                const isActive = session.id === activeTakeawayId;

                return (
                  <View
                    key={session.id}
                    style={[styles.card, isActive && styles.cardActive]}
                  >
                    {/* Top Badge */}
                    <View
                      style={{
                        marginBottom: 12,
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              getOrderStatus(session.running_order) === "Ready"
                                ? ThemeColors.emeraldDim
                                : ThemeColors.blueDim,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color:
                                getOrderStatus(session.running_order) ===
                                "Ready"
                                  ? ThemeColors.emerald
                                  : ThemeColors.blue,
                            },
                          ]}
                          weight="bold"
                        >
                          {getOrderStatus(session.running_order)}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              session.payment_status === "Paid"
                                ? ThemeColors.emeraldDim
                                : ThemeColors.amberDim,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color:
                                session.payment_status === "Paid"
                                  ? ThemeColors.emerald
                                  : ThemeColors.amber,
                            },
                          ]}
                          weight="bold"
                        >
                          {session.payment_status === "Paid"
                            ? "Paid"
                            : "Unpaid"}
                        </Text>
                      </View>
                    </View>

                    {/* Title & Subtitle */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text
                        style={styles.tabName}
                        weight="bold"
                        numberOfLines={1}
                      >
                        {session.customer_info?.name || "Walk-in Customer"}
                      </Text>
                      <Text style={styles.subTitle} numberOfLines={2}>
                        {session.customer_info?.phone
                          ? " • " + session.customer_info.phone
                          : ""}
                      </Text>
                    </View>
                    <Text
                      style={[styles.subTitle, { fontSize: 11, marginTop: 4 }]}
                      numberOfLines={2}
                    >
                      {session.order_number}
                    </Text>

                    {/* Bottom Row */}
                    <View style={styles.bottomRow}>
                      <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                          <Clock size={13} color={ThemeColors.textSecondary} />
                          <Text style={styles.statText} weight="medium">
                            {formatTime(session.created_at) || "--:--"}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <ShoppingBag
                            size={13}
                            color={ThemeColors.textSecondary}
                          />
                          <Text style={styles.statText} weight="medium">
                            {totalItems} item{totalItems !== 1 ? "s" : ""}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          {
                            backgroundColor: session.payment_status === "Paid" 
                              ? ThemeColors.emerald 
                              : ThemeColors.primary + "10"
                          }
                        ]}
                        onPress={() => {
                          if (session.payment_status === "Paid") {
                            handleCloseOrder(session.id);
                          } else {
                            handleRestore(session);
                          }
                        }}
                      >
                        <Text 
                          style={[
                            styles.actionBtnText,
                            {
                              color: session.payment_status === "Paid" ? "white" : ThemeColors.primary
                            }
                          ]} 
                          weight="bold"
                        >
                          {session.payment_status === "Paid"
                            ? "Mark Served"
                            : "Pre-pay"}
                        </Text>
                        <ArrowRight 
                          size={14} 
                          color={session.payment_status === "Paid" ? "white" : ThemeColors.primary} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    width: 400,
    backgroundColor: ThemeColors.surface,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    gap: 4,
  },
  newBtnText: {
    color: "white",
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
    justifyContent: "center",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    color: ThemeColors.textMuted,
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    padding: ThemeSpacing.md,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  cardActive: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
    shadowOpacity: 0.1,
  },
  tabName: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    color: ThemeColors.textMuted,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: ThemeRadius.full,
  },
  actionBtnText: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ThemeRadius.full,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
