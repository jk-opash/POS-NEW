import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";

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

export function HelpSettings() {
  const [activeTab, setActiveTab] = useState("help_center");

  const renderContent = () => {
    switch (activeTab) {
      case "help_center": return <HelpCenterTab />;
      case "faq": return <FaqTab />;
      case "my_tickets": return <MyTicketsTab />;
      case "contact": return <ContactSupportTab />;
      default: return null;
    }
  };

  return (
    <View style={styles.root}>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Content */}
        <View style={styles.contentSection}>{renderContent()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: ThemeSpacing.md,
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
    paddingTop: ThemeSpacing.md,
    paddingBottom: 40,
  },
  contentSection: {
    minHeight: 400,
  },
});
