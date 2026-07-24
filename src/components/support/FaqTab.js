import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search, ChevronDown, ChevronUp } from "lucide-react-native";
import { useSupport } from "@/context/SupportContext";

export function FaqTab() {
  const { faqs } = useSupport();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>Quick answers to common questions.</Text>
      </View>

      <View style={styles.searchWrap}>
        <Search size={20} color={ThemeColors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          placeholderTextColor={ThemeColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity 
                style={styles.faqHeader} 
                onPress={() => setExpandedId(isExpanded ? null : faq.id)}
              >
                <Text weight="bold" style={styles.questionText}>{faq.question}</Text>
                {isExpanded ? (
                  <ChevronUp size={20} color={ThemeColors.textMuted} />
                ) : (
                  <ChevronDown size={20} color={ThemeColors.textMuted} />
                )}
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqBody}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
        {filteredFaqs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No FAQs found.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacing.xl,
  },
  header: {
    marginBottom: ThemeSpacing.sm,
  },
  title: {
    fontSize: 24,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.lg,
    paddingHorizontal: ThemeSpacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: ThemeSpacing.sm,
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  listContainer: {
    gap: ThemeSpacing.md,
  },
  faqCard: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.lg,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  faqBody: {
    padding: ThemeSpacing.lg,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    padding: ThemeSpacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    color: ThemeColors.textMuted,
    fontSize: 15,
  }
});
