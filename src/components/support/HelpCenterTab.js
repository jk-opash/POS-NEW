import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Search, BookOpen, ChevronRight } from "lucide-react-native";
import { useSupport } from "@/context/SupportContext";

export function HelpCenterTab() {
  const { articles } = useSupport();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>Find guides, tutorials, and documentation.</Text>
      </View>

      <View style={styles.searchWrap}>
        <Search size={20} color={ThemeColors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor={ThemeColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {filteredArticles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <View style={styles.iconBox}>
              <BookOpen size={24} color={ThemeColors.emerald} />
            </View>
            <View style={styles.articleInfo}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
              <Text weight="bold" style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDesc} numberOfLines={2}>{article.description}</Text>
            </View>
            <ChevronRight size={20} color={ThemeColors.border} />
          </TouchableOpacity>
        ))}
        {filteredArticles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No articles found.</Text>
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
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emeraldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  articleInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  articleDesc: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
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
