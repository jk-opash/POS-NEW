import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { Menu, MessageSquare, Star, ThumbsDown, ThumbsUp, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_FEEDBACK = [
  { id: "FB-1", customer: "Rahul Sharma", date: "Today, 2:30 PM", overall: 5, food: 5, service: 5, ambience: 4, value: 4, comment: "Excellent food! Butter chicken was amazing. Will definitely come again.", table: "A3" },
  { id: "FB-2", customer: "Priya Patel", date: "Today, 1:15 PM", overall: 4, food: 4, service: 4, ambience: 4, value: 3, comment: "Good food, slightly overpriced for portions.", table: "A1" },
  { id: "FB-3", customer: "Amit Kumar", date: "Today, 12:00 PM", overall: 5, food: 5, service: 4, ambience: 5, value: 5, comment: "Best biryani in town! Service could be a bit faster during peak hours.", table: "B2" },
  { id: "FB-4", customer: "Meena Shah", date: "Yesterday, 8:30 PM", overall: 3, food: 3, service: 2, ambience: 4, value: 3, comment: "Food was okay. Waited too long for our order. Staff seemed overwhelmed.", table: "A5" },
  { id: "FB-5", customer: "Vijay Singh", date: "Yesterday, 7:00 PM", overall: 4, food: 5, service: 4, ambience: 3, value: 4, comment: "Delicious thali! Great value for money.", table: "A6" },
  { id: "FB-6", customer: "Neha Gupta", date: "2 days ago", overall: 5, food: 5, service: 5, ambience: 5, value: 5, comment: "Perfect dinner experience. Everything was outstanding!", table: "A4" },
  { id: "FB-7", customer: "Walk-in", date: "2 days ago", overall: 2, food: 2, service: 3, ambience: 3, value: 2, comment: "Naan was cold and hard. Paneer was not fresh. Disappointed.", table: "B1" },
];

const renderStars = (count) => {
  return Array(5).fill(0).map((_, i) => (
    <Star key={i} size={14} color={i < count ? ThemeColors.amber : ThemeColors.border} fill={i < count ? ThemeColors.amber : "transparent"} />
  ));
};

export function FeedbackScreen() {
  const navigation = useNavigation();
  const { isDesktop , isWebDesktop } = useResponsive();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? MOCK_FEEDBACK :
    activeFilter === "Positive" ? MOCK_FEEDBACK.filter((f) => f.overall >= 4) :
    MOCK_FEEDBACK.filter((f) => f.overall < 4);

  const avgRating = (MOCK_FEEDBACK.reduce((s, f) => s + f.overall, 0) / MOCK_FEEDBACK.length).toFixed(1);
  const positiveCount = MOCK_FEEDBACK.filter((f) => f.overall >= 4).length;
  const negativeCount = MOCK_FEEDBACK.filter((f) => f.overall < 4).length;

  const avgFood = (MOCK_FEEDBACK.reduce((s, f) => s + f.food, 0) / MOCK_FEEDBACK.length).toFixed(1);
  const avgService = (MOCK_FEEDBACK.reduce((s, f) => s + f.service, 0) / MOCK_FEEDBACK.length).toFixed(1);
  const avgAmbience = (MOCK_FEEDBACK.reduce((s, f) => s + f.ambience, 0) / MOCK_FEEDBACK.length).toFixed(1);
  const avgValue = (MOCK_FEEDBACK.reduce((s, f) => s + f.value, 0) / MOCK_FEEDBACK.length).toFixed(1);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                <Menu size={22} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <MessageSquare size={22} color={ThemeColors.accent} />
            <Text weight="bold" style={styles.pageTitle}>Feedback</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.mainStatCard]}>
            <Star size={24} color={ThemeColors.amber} fill={ThemeColors.amber} />
            <Text weight="bold" style={styles.mainStatValue}>{avgRating}</Text>
            <Text style={styles.mainStatLabel}>Average Rating</Text>
            <Text style={styles.mainStatSub}>{MOCK_FEEDBACK.length} reviews</Text>
          </View>
          <View style={styles.statCard}>
            <ThumbsUp size={20} color={ThemeColors.emerald} />
            <Text weight="bold" style={[styles.statValue, { color: ThemeColors.emerald }]}>{positiveCount}</Text>
            <Text style={styles.statLabel}>Positive</Text>
          </View>
          <View style={styles.statCard}>
            <ThumbsDown size={20} color={ThemeColors.red} />
            <Text weight="bold" style={[styles.statValue, { color: ThemeColors.red }]}>{negativeCount}</Text>
            <Text style={styles.statLabel}>Negative</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.breakdownCard}>
          <Text weight="semibold" style={styles.breakdownTitle}>Category Breakdown</Text>
          {[
            { label: "Food Quality", value: avgFood },
            { label: "Service", value: avgService },
            { label: "Ambience", value: avgAmbience },
            { label: "Value for Money", value: avgValue },
          ].map((cat, i) => (
            <View key={i} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{cat.label}</Text>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownFill, { width: `${(cat.value / 5) * 100}%` }]} />
              </View>
              <Text weight="semibold" style={styles.breakdownValue}>{cat.value}</Text>
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {["All", "Positive", "Negative"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text weight={activeFilter === f ? "semibold" : "regular"} style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback List */}
        {filtered.map((fb) => (
          <View key={fb.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackAvatar}>
                <Text weight="bold" style={styles.feedbackAvatarText}>
                  {fb.customer.split(" ").map((n) => n[0]).join("")}
                </Text>
              </View>
              <View style={styles.feedbackMeta}>
                <Text weight="semibold" style={styles.feedbackName}>{fb.customer}</Text>
                <Text style={styles.feedbackDate}>{fb.date} • Table {fb.table}</Text>
              </View>
              <View style={styles.feedbackRating}>
                {renderStars(fb.overall)}
              </View>
            </View>
            <Text style={styles.feedbackComment}>{fb.comment}</Text>
            <View style={styles.feedbackScores}>
              <Text style={styles.feedbackScore}>🍽 Food: {fb.food}</Text>
              <Text style={styles.feedbackScore}>🤝 Service: {fb.service}</Text>
              <Text style={styles.feedbackScore}>✨ Ambience: {fb.ambience}</Text>
              <Text style={styles.feedbackScore}>💰 Value: {fb.value}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  headerSafe: { backgroundColor: ThemeColors.surface, borderBottomWidth: 1, borderBottomColor: ThemeColors.border },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: ThemeSpacing.xxl, paddingVertical: ThemeSpacing.md },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md },
  menuBtn: { padding: 4 },
  pageTitle: { fontSize: 22, color: ThemeColors.textPrimary },
  content: { padding: ThemeSpacing.lg },
  statsRow: { flexDirection: "row", gap: ThemeSpacing.md, marginBottom: ThemeSpacing.lg },
  statCard: { flex: 1, backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, alignItems: "center", gap: 6, borderWidth: 1, borderColor: ThemeColors.border },
  mainStatCard: { flex: 1.5 },
  mainStatValue: { fontSize: 36, color: ThemeColors.textPrimary },
  mainStatLabel: { fontSize: 13, color: ThemeColors.textMuted },
  mainStatSub: { fontSize: 11, color: ThemeColors.textMuted },
  statValue: { fontSize: 28 },
  statLabel: { fontSize: 12, color: ThemeColors.textMuted },
  breakdownCard: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.lg, borderWidth: 1, borderColor: ThemeColors.border },
  breakdownTitle: { fontSize: 15, color: ThemeColors.textPrimary, marginBottom: ThemeSpacing.md },
  breakdownRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  breakdownLabel: { width: 120, fontSize: 13, color: ThemeColors.textSecondary },
  breakdownBar: { flex: 1, height: 8, backgroundColor: ThemeColors.bg, borderRadius: 4, overflow: "hidden" },
  breakdownFill: { height: "100%", backgroundColor: ThemeColors.accent, borderRadius: 4 },
  breakdownValue: { width: 30, fontSize: 14, color: ThemeColors.textPrimary, textAlign: "right" },
  filterRow: { flexDirection: "row", gap: ThemeSpacing.sm, marginBottom: ThemeSpacing.lg },
  filterTab: { paddingHorizontal: ThemeSpacing.lg, paddingVertical: ThemeSpacing.sm, borderRadius: ThemeRadius.xl, borderWidth: 1, borderColor: ThemeColors.border },
  filterTabActive: { backgroundColor: ThemeColors.accent, borderColor: ThemeColors.accent },
  filterTabText: { fontSize: 13, color: ThemeColors.textSecondary },
  filterTabTextActive: { color: ThemeColors.white },
  feedbackCard: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.md, borderWidth: 1, borderColor: ThemeColors.border, gap: ThemeSpacing.sm },
  feedbackHeader: { flexDirection: "row", alignItems: "center", gap: ThemeSpacing.md },
  feedbackAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: ThemeColors.accentDim, justifyContent: "center", alignItems: "center" },
  feedbackAvatarText: { fontSize: 14, color: ThemeColors.accent },
  feedbackMeta: { flex: 1 },
  feedbackName: { fontSize: 14, color: ThemeColors.textPrimary },
  feedbackDate: { fontSize: 12, color: ThemeColors.textMuted },
  feedbackRating: { flexDirection: "row", gap: 2 },
  feedbackComment: { fontSize: 14, color: ThemeColors.textSecondary, lineHeight: 20 },
  feedbackScores: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  feedbackScore: { fontSize: 12, color: ThemeColors.textMuted },
});
