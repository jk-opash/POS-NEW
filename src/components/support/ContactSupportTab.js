import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { MessageCircle, Mail, Phone, Server, CheckCircle, Clock } from "lucide-react-native";

export function ContactSupportTab() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>Contact & Status</Text>
        <Text style={styles.subtitle}>Get in touch with our support team.</Text>
      </View>

      <View style={styles.grid}>
        {/* Contact Options */}
        <View style={styles.card}>
          <Text weight="bold" style={styles.cardTitle}>Support Channels</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={() => {}}>
            <View style={[styles.iconBox, { backgroundColor: ThemeColors.blue + '15' }]}>
              <MessageCircle size={24} color={ThemeColors.blue} />
            </View>
            <View style={styles.contactInfo}>
              <Text weight="bold" style={styles.contactName}>Live Chat</Text>
              <Text style={styles.contactDesc}>Typical reply in under 5 minutes</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@macburguer.com')}>
            <View style={[styles.iconBox, { backgroundColor: ThemeColors.emerald + '15' }]}>
              <Mail size={24} color={ThemeColors.emerald} />
            </View>
            <View style={styles.contactInfo}>
              <Text weight="bold" style={styles.contactName}>Email Support</Text>
              <Text style={styles.contactDesc}>support@macburguer.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:18001234567')}>
            <View style={[styles.iconBox, { backgroundColor: ThemeColors.amber + '15' }]}>
              <Phone size={24} color={ThemeColors.amber} />
            </View>
            <View style={styles.contactInfo}>
              <Text weight="bold" style={styles.contactName}>Phone Support</Text>
              <Text style={styles.contactDesc}>1-800-123-4567</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* System Status */}
        <View style={styles.card}>
          <Text weight="bold" style={styles.cardTitle}>System Status</Text>
          
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Server size={20} color={ThemeColors.textSecondary} />
              <Text style={styles.statusName}>Core Services</Text>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle size={14} color={ThemeColors.emerald} />
              <Text weight="bold" style={styles.statusBadgeText}>Operational</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Clock size={20} color={ThemeColors.textSecondary} />
              <Text style={styles.statusName}>Payment Gateway</Text>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle size={14} color={ThemeColors.emerald} />
              <Text weight="bold" style={styles.statusBadgeText}>Operational</Text>
            </View>
          </View>

          <View style={styles.maintenanceBox}>
            <Text weight="bold" style={styles.maintenanceTitle}>Scheduled Maintenance</Text>
            <Text style={styles.maintenanceDesc}>
              No scheduled maintenance in the next 7 days. Systems are running optimally.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: ThemeSpacing.xl,
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
  grid: {
    gap: ThemeSpacing.xl,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: 320,
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.xl,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cardTitle: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xl,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  statusName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ThemeColors.emerald + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
  },
  statusBadgeText: {
    fontSize: 12,
    color: ThemeColors.emerald,
  },
  maintenanceBox: {
    marginTop: ThemeSpacing.xl,
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  maintenanceTitle: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  maintenanceDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 20,
  }
});
