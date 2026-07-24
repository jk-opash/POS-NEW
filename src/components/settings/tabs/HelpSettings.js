import React from "react";
import { View, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { styles as commonStyles } from "./BusinessSettings"; 
import { LifeBuoy, FileText, Mail, MessageSquare } from "lucide-react-native";

import { ThemeColors } from "@/theme/theme";
export function HelpSettings() {
  const options = [
    { title: "Documentation", desc: "Read our comprehensive guides.", icon: FileText },
    { title: "Live Chat Support", desc: "Chat with our support team.", icon: MessageSquare },
    { title: "Email Support", desc: "support@posmanager.com", icon: Mail },
    { title: "Community Forum", desc: "Join the discussion.", icon: LifeBuoy },
  ];

  return (
    <View style={commonStyles.container}>
      <Text weight="bold" style={commonStyles.headerTitle}>Help Center</Text>
      <Text style={commonStyles.headerSubtitle}>Get support and answers to your questions.</Text>

      <View style={commonStyles.card}>
        <View style={localStyles.grid}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={localStyles.item} activeOpacity={0.7}>
              <opt.icon size={24} color={ThemeColors.textSecondary} />
              <View style={localStyles.textContainer}>
                <Text weight="semibold" style={localStyles.title}>{opt.title}</Text>
                <Text style={localStyles.desc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  grid: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: ThemeColors.surfaceElevated,
    borderRadius: 8,
    gap: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: ThemeColors.textPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: ThemeColors.textMuted,
    fontSize: 14,
  },
});
