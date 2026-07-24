import { Text } from "@/components/ui/Text";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import {
  Gift,
  Heart,
  Menu,
  Phone,
  Plus,
  Search,
  Star,
  TrendingUp,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_CUSTOMERS = [
  { id: "C-1001", name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul@email.com", visits: 24, totalSpent: 18500, points: 450, label: "VIP", lastVisit: "2 days ago", birthday: "15 Mar", favourites: ["Butter Chicken", "Garlic Naan"] },
  { id: "C-1002", name: "Priya Patel", phone: "+91 98765 43211", email: "priya@email.com", visits: 12, totalSpent: 9200, points: 220, label: "Regular", lastVisit: "5 days ago", birthday: "22 Jul", favourites: ["Paneer Tikka", "Dal Makhani"] },
  { id: "C-1003", name: "Amit Kumar", phone: "+91 98765 43212", email: "amit@email.com", visits: 42, totalSpent: 34000, points: 820, label: "VIP", lastVisit: "Today", birthday: "08 Nov", favourites: ["Chicken Biryani", "Cold Coffee"] },
  { id: "C-1004", name: "Meena Shah", phone: "+91 98765 43213", email: "", visits: 3, totalSpent: 1800, points: 45, label: "New", lastVisit: "2 weeks ago", birthday: "", favourites: ["Masala Dosa"] },
  { id: "C-1005", name: "Vijay Singh", phone: "+91 98765 43214", email: "vijay@email.com", visits: 8, totalSpent: 6400, points: 150, label: "Regular", lastVisit: "1 week ago", birthday: "30 Jan", favourites: ["Veg Thali", "Mango Lassi"] },
  { id: "C-1006", name: "Neha Gupta", phone: "+91 98765 43215", email: "neha@email.com", visits: 18, totalSpent: 14200, points: 340, label: "VIP", lastVisit: "3 days ago", birthday: "12 Sep", favourites: ["Paneer Butter Masala", "Gulab Jamun"] },
];

const LABEL_COLORS = {
  VIP: { bg: ThemeColors.amberDim, text: ThemeColors.amber },
  Regular: { bg: ThemeColors.blueDim, text: ThemeColors.blue },
  New: { bg: ThemeColors.emeraldDim, text: ThemeColors.emerald },
};

export function CRMScreen() {
  const navigation = useNavigation();
  const { isDesktop , isWebDesktop } = useResponsive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const stats = {
    total: MOCK_CUSTOMERS.length,
    vip: MOCK_CUSTOMERS.filter((c) => c.label === "VIP").length,
    totalPoints: MOCK_CUSTOMERS.reduce((s, c) => s + c.points, 0),
    avgSpend: Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / MOCK_CUSTOMERS.length),
  };

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
            <Heart size={22} color={ThemeColors.accent} />
            <Text weight="bold" style={styles.pageTitle}>CRM & Loyalty</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={16} color={ThemeColors.white} />
            <Text weight="semibold" style={styles.addBtnText}>Add Customer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Stats Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
        {[
          { label: "Total Customers", value: stats.total, icon: User, color: ThemeColors.blue },
          { label: "VIP Customers", value: stats.vip, icon: Star, color: ThemeColors.amber },
          { label: "Total Points", value: stats.totalPoints, icon: Gift, color: ThemeColors.violet },
          { label: "Avg. Spend", value: `₹${stats.avgSpend}`, icon: TrendingUp, color: ThemeColors.emerald },
        ].map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <stat.icon size={20} color={stat.color} />
            <Text weight="bold" style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={ThemeColors.textMuted} />
          <TextInput
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={ThemeColors.textMuted}
          />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.customerList} showsVerticalScrollIndicator={false}>
          {filtered.map((customer) => {
            const labelCfg = LABEL_COLORS[customer.label] || LABEL_COLORS.Regular;
            return (
              <TouchableOpacity
                key={customer.id}
                style={[styles.customerCard, selectedCustomer?.id === customer.id && styles.customerCardSelected]}
                onPress={() => setSelectedCustomer(customer)}
              >
                <View style={styles.customerAvatar}>
                  <Text weight="bold" style={styles.avatarText}>
                    {customer.name.split(" ").map((n) => n[0]).join("")}
                  </Text>
                </View>
                <View style={styles.customerInfo}>
                  <View style={styles.customerNameRow}>
                    <Text weight="semibold" style={styles.customerName}>{customer.name}</Text>
                    <View style={[styles.labelBadge, { backgroundColor: labelCfg.bg }]}>
                      <Text weight="semibold" style={[styles.labelText, { color: labelCfg.text }]}>{customer.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.customerPhone}>{customer.phone}</Text>
                  <View style={styles.customerStats}>
                    <Text style={styles.customerStat}>{customer.visits} visits</Text>
                    <Text style={styles.customerStat}>₹{customer.totalSpent}</Text>
                    <Text style={[styles.customerStat, { color: ThemeColors.accent }]}>⭐ {customer.points} pts</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Detail Panel */}
        {isDesktop && selectedCustomer && (
          <View style={styles.detailPanel}>
            <View style={styles.detailAvatar}>
              <Text weight="bold" style={styles.detailAvatarText}>
                {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <Text weight="bold" style={styles.detailName}>{selectedCustomer.name}</Text>
            <View style={[styles.labelBadge, { backgroundColor: (LABEL_COLORS[selectedCustomer.label] || LABEL_COLORS.Regular).bg, alignSelf: "center" }]}>
              <Text weight="semibold" style={[styles.labelText, { color: (LABEL_COLORS[selectedCustomer.label] || LABEL_COLORS.Regular).text }]}>{selectedCustomer.label} Customer</Text>
            </View>

            <View style={styles.detailSection}>
              <Text weight="semibold" style={styles.detailSectionTitle}>CONTACT</Text>
              <Text style={styles.detailText}>📞 {selectedCustomer.phone}</Text>
              {selectedCustomer.email ? <Text style={styles.detailText}>📧 {selectedCustomer.email}</Text> : null}
              {selectedCustomer.birthday ? <Text style={styles.detailText}>🎂 {selectedCustomer.birthday}</Text> : null}
            </View>

            <View style={styles.detailSection}>
              <Text weight="semibold" style={styles.detailSectionTitle}>STATS</Text>
              <View style={styles.detailStatsGrid}>
                <View style={styles.detailStatBox}>
                  <Text weight="bold" style={styles.detailStatValue}>{selectedCustomer.visits}</Text>
                  <Text style={styles.detailStatLabel}>Visits</Text>
                </View>
                <View style={styles.detailStatBox}>
                  <Text weight="bold" style={styles.detailStatValue}>₹{selectedCustomer.totalSpent}</Text>
                  <Text style={styles.detailStatLabel}>Total Spent</Text>
                </View>
                <View style={styles.detailStatBox}>
                  <Text weight="bold" style={[styles.detailStatValue, { color: ThemeColors.accent }]}>{selectedCustomer.points}</Text>
                  <Text style={styles.detailStatLabel}>Points</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text weight="semibold" style={styles.detailSectionTitle}>FAVOURITES</Text>
              <View style={styles.favRow}>
                {selectedCustomer.favourites.map((f, i) => (
                  <View key={i} style={styles.favChip}>
                    <Text style={styles.favChipText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.lastVisitText}>Last visit: {selectedCustomer.lastVisit}</Text>
          </View>
        )}
      </View>
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
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: ThemeColors.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: ThemeRadius.md },
  addBtnText: { color: ThemeColors.white, fontSize: 13 },
  statsRow: { paddingHorizontal: ThemeSpacing.lg, paddingVertical: ThemeSpacing.md, gap: ThemeSpacing.md },
  statCard: { backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, alignItems: "center", gap: 6, minWidth: 130, borderWidth: 1, borderColor: ThemeColors.border },
  statValue: { fontSize: 20, color: ThemeColors.textPrimary },
  statLabel: { fontSize: 11, color: ThemeColors.textMuted },
  searchRow: { paddingHorizontal: ThemeSpacing.lg, paddingBottom: ThemeSpacing.md },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.md, paddingHorizontal: ThemeSpacing.md, borderWidth: 1, borderColor: ThemeColors.border, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: ThemeColors.textPrimary },
  body: { flex: 1, flexDirection: "row" },
  customerList: { flex: 1, paddingHorizontal: ThemeSpacing.lg },
  customerCard: { flexDirection: "row", backgroundColor: ThemeColors.surface, borderRadius: ThemeRadius.lg, padding: ThemeSpacing.lg, marginBottom: ThemeSpacing.sm, borderWidth: 1, borderColor: ThemeColors.border, gap: ThemeSpacing.md },
  customerCardSelected: { borderColor: ThemeColors.accent, borderWidth: 2 },
  customerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: ThemeColors.accentDim, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 16, color: ThemeColors.accent },
  customerInfo: { flex: 1, gap: 4 },
  customerNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customerName: { fontSize: 15, color: ThemeColors.textPrimary },
  labelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  labelText: { fontSize: 10 },
  customerPhone: { fontSize: 13, color: ThemeColors.textSecondary },
  customerStats: { flexDirection: "row", gap: 12, marginTop: 4 },
  customerStat: { fontSize: 12, color: ThemeColors.textMuted },
  detailPanel: { width: 340, backgroundColor: ThemeColors.surface, borderLeftWidth: 1, borderLeftColor: ThemeColors.border, padding: ThemeSpacing.xl, alignItems: "center" },
  detailAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: ThemeColors.accentDim, justifyContent: "center", alignItems: "center", marginBottom: ThemeSpacing.md },
  detailAvatarText: { fontSize: 24, color: ThemeColors.accent },
  detailName: { fontSize: 20, color: ThemeColors.textPrimary, marginBottom: 8 },
  detailSection: { width: "100%", marginTop: ThemeSpacing.xl },
  detailSectionTitle: { fontSize: 11, color: ThemeColors.textMuted, letterSpacing: 1, marginBottom: ThemeSpacing.sm },
  detailText: { fontSize: 14, color: ThemeColors.textSecondary, marginBottom: 6 },
  detailStatsGrid: { flexDirection: "row", gap: ThemeSpacing.sm },
  detailStatBox: { flex: 1, backgroundColor: ThemeColors.bg, borderRadius: ThemeRadius.md, padding: ThemeSpacing.md, alignItems: "center", gap: 4 },
  detailStatValue: { fontSize: 16, color: ThemeColors.textPrimary },
  detailStatLabel: { fontSize: 10, color: ThemeColors.textMuted },
  favRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  favChip: { backgroundColor: ThemeColors.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: ThemeColors.border },
  favChipText: { fontSize: 12, color: ThemeColors.textSecondary },
  lastVisitText: { fontSize: 12, color: ThemeColors.textMuted, marginTop: ThemeSpacing.xl },
});
