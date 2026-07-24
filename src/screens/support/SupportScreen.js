import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useResponsive } from "@/hooks/useResponsive";

// Icons
import { 
  Menu, ArrowLeft,
  Bell
} from "lucide-react-native";

// Tabs
import { HelpCenterTab } from "@/components/support/HelpCenterTab";
import { FaqTab } from "@/components/support/FaqTab";
import { MyTicketsTab } from "@/components/support/MyTicketsTab";
import { ContactSupportTab } from "@/components/support/ContactSupportTab";

const TABS = [
  { key: "help_center", label: "Help Center" },
  { key: "faq", label: "FAQs" },
  { key: "my_tickets", label: "My Tickets" },
  { key: "contact", label: "Contact Support" },
];

export default function SupportScreen() {
  const [activeTab, setActiveTab] = useState("help_center");
  const navigation = useNavigation();
  const { isDesktop , isWebDesktop } = useResponsive();

  const renderContent = () => {
    switch (activeTab) {
      case "help_center": return <HelpCenterTab />;
      case "faq": return <FaqTab />;
      case "my_tickets": return <MyTicketsTab />;
      case "contact": return <ContactSupportTab />;
      default: return null;
    }
  };

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.root}>
      {/* ── Top Header ──────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!isWebDesktop && (
              <TouchableOpacity
                onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
                style={styles.menuBtn}
              >
                <Menu size={24} color={ThemeColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageTitle}>Help & Support</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{dateString}</Text>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={20} color={ThemeColors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Toolbar & Tabs ─────────────────────── */}
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
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Content */}
        <View style={styles.contentSection}>{renderContent()}</View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  headerDate: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  notifBtn: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
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
  scrollContent: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingTop: ThemeSpacing.lg,
  },
  contentSection: {
    minHeight: 400,
  },
  bottomPad: { height: 100 },
});
