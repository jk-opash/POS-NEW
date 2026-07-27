import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { useNavigation } from "expo-router";
import { Bell, Menu, Settings, X, Globe, Shield, Key } from "lucide-react-native";
import { useOnlineIntegration } from "@/context/OnlineIntegrationContext";

export function OnlineOrderConfigScreen() {
  const { isWebDesktop, isMobile } = useResponsive();
  const navigation = useNavigation();
  const { platforms, updatePlatform } = useOnlineIntegration();
  
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal State
  const [storeId, setStoreId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [autoAccept, setAutoAccept] = useState(false);

  const handleOpenConfig = (platform) => {
    setSelectedPlatform(platform);
    setStoreId(platform.storeId);
    setApiKey(platform.apiKey);
    setAutoAccept(platform.autoAccept);
    setModalVisible(true);
  };

  const handleSaveConfig = () => {
    if (selectedPlatform) {
      updatePlatform(selectedPlatform.id, {
        storeId,
        apiKey,
        autoAccept,
      });
    }
    setModalVisible(false);
  };

  const togglePlatformActive = (id, currentStatus) => {
    updatePlatform(id, { isActive: !currentStatus });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
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
            <Text style={styles.pageTitle}>Online Order Configuration</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text weight="bold" style={styles.sectionTitle}>Delivery Integrations</Text>
            <Text style={styles.sectionSubtitle}>Connect and manage third-party delivery platforms.</Text>
          </View>
        </View>

        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {platforms.map((platform) => (
            <View key={platform.id} style={styles.platformCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.platformIcon, { backgroundColor: platform.themeColor }]}>
                  <Text weight="bold" style={styles.platformIconText}>
                    {platform.name.substring(0, 1)}
                  </Text>
                </View>
                <Switch
                  value={platform.isActive}
                  onValueChange={() => togglePlatformActive(platform.id, platform.isActive)}
                  style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
              </View>
              
              <View style={styles.cardBody}>
                <Text weight="bold" style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformStatus}>
                  {platform.isActive ? "Connected" : "Disconnected"}
                </Text>
              </View>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.configBtn}
                  onPress={() => handleOpenConfig(platform)}
                >
                  <Settings size={14} color={ThemeColors.textSecondary} />
                  <Text weight="medium" style={styles.configBtnText}>Configure</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Configuration Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Globe size={20} color={selectedPlatform?.themeColor || ThemeColors.primary} />
                <Text weight="bold" style={styles.modalTitle}>
                  {selectedPlatform?.name} Settings
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text weight="medium" style={styles.label}>Store ID / Merchant ID</Text>
                <View style={styles.inputWrap}>
                  <Shield size={18} color={ThemeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Store ID"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={storeId}
                    onChangeText={setStoreId}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text weight="medium" style={styles.label}>API Key / Secret</Text>
                <View style={styles.inputWrap}>
                  <Key size={18} color={ThemeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter API Key"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={apiKey}
                    onChangeText={setApiKey}
                    secureTextEntry={true}
                  />
                </View>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingContent}>
                  <Text weight="bold" style={styles.settingLabel}>Auto-Accept Orders</Text>
                  <Text style={styles.settingDesc}>Automatically accept and print KOTs when an order arrives from this platform.</Text>
                </View>
                <Switch
                  value={autoAccept}
                  onValueChange={setAutoAccept}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text weight="semibold" style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveConfig}>
                <Text weight="semibold" style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: ThemeSpacing.xs,
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
  notifBtn: { position: "relative", padding: 4 },
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
  scrollContent: {
    padding: ThemeSpacing.xxl,
    paddingBottom: 100,
  },
  sectionHeaderRow: {
    marginBottom: ThemeSpacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.xl,
  },
  gridMobile: {
    flexDirection: "column",
  },
  platformCard: {
    width: 280,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: ThemeSpacing.lg,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  platformIconText: {
    color: ThemeColors.white,
    fontSize: 22,
  },
  cardBody: {
    marginBottom: ThemeSpacing.lg,
  },
  platformName: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  platformStatus: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    paddingTop: ThemeSpacing.md,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  configBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
  },
  configBtnText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: ThemeColors.surface,
    width: "90%",
    maxWidth: 500,
    borderRadius: ThemeRadius.xl,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  modalBody: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.xl,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    paddingHorizontal: ThemeSpacing.md,
    height: 44,
  },
  inputIcon: {
    marginRight: ThemeSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: ThemeColors.textPrimary,
    ...Platform.select({
      web: { outlineStyle: "none" }
    })
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  settingContent: {
    flex: 1,
    paddingRight: ThemeSpacing.lg,
  },
  settingLabel: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: "row",
    padding: ThemeSpacing.xl,
    paddingTop: 0,
    gap: ThemeSpacing.md,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  cancelText: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  saveBtn: {
    backgroundColor: ThemeColors.primary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 10,
    borderRadius: ThemeRadius.md,
  },
  saveText: {
    fontSize: 14,
    color: ThemeColors.white,
  },
});
