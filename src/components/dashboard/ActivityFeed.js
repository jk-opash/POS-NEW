import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const TYPE_CONFIG = {
  sale:      { icon: "💳", color: ThemeColors.emerald },
  customer:  { icon: "👤", color: ThemeColors.blue },
  order:     { icon: "📦", color: ThemeColors.amber },
  inventory: { icon: "🏭", color: ThemeColors.purple },
  loyalty:   { icon: "⭐", color: ThemeColors.cyan },
  alert:     { icon: "⚠️", color: ThemeColors.red },
};

function ActivityRow({ item, index }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 300, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.sale;
  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateX }] }]}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        {index < 7 && <View style={styles.line} />}
      </View>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text weight="regular" style={styles.eventIcon}>{config.icon}</Text>
          <Text weight="semibold" style={[styles.eventName, { color: config.color }]}>
            {item.event}
          </Text>
          <Text weight="regular" style={styles.time}>{item.time}</Text>
        </View>
        <Text weight="regular" style={styles.detail}>{item.detail}</Text>
      </View>
    </Animated.View>
  );
}

export function ActivityFeed({ activities }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>⚡ Real-Time Activity</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text weight="extrabold" style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      {activities.map((item, i) => (
        <ActivityRow key={item.id} item={item} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.lg,
  },
  title:    { fontSize: 15, color: ThemeColors.textPrimary },
  liveBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: ThemeColors.emeraldDim,
    paddingHorizontal: ThemeSpacing.sm, paddingVertical: 4, borderRadius: 20,
  },
  liveDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: ThemeColors.emerald },
  liveText: { fontSize: 10, color: ThemeColors.emerald, letterSpacing: 1 },
  row:      { flexDirection: "row", gap: ThemeSpacing.md, minHeight: 52 },
  timeline: { alignItems: "center", width: 14, paddingTop: 4 },
  dot:      { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  line:     { flex: 1, width: 1, backgroundColor: ThemeColors.border, marginBottom: 4 },
  content:  { flex: 1, paddingBottom: ThemeSpacing.md },
  contentHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  eventIcon: { fontSize: 13 },
  eventName: { fontSize: 13, flex: 1 },
  time:     { fontSize: 11, color: ThemeColors.textMuted },
  detail:   { fontSize: 12, color: ThemeColors.textSecondary, marginLeft: 20 },
});
