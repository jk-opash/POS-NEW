import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Menu, ArrowLeft } from "lucide-react-native";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function CommonHeader({
  title,
  rightContent,
  bottomContent,
  showQuickNav = true,
  showNotif = true,
  showBack = false,
  onBack,
}) {
  const navigation = useNavigation();
  const pathname = usePathname();
  const router = useRouter();
  const { isDesktop, isWebDesktop } = useResponsive();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = useSelector((state) => state.notification?.unreadCount || 0);
  
  const isOperationScreen = pathname?.startsWith("/operations/");
  const effectiveShowBack = showBack || isOperationScreen;

  const showMenuBtn = !isDesktop && !isWebDesktop;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (isOperationScreen) {
      router.push("/operations");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showMenuBtn && !effectiveShowBack && (
            <TouchableOpacity
              onPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
              style={styles.menuBtn}
            >
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          {effectiveShowBack && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.menuBtn}
            >
              <ArrowLeft size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          {title && <Text style={styles.pageTitle}>{title}</Text>}
        </View>

        <View style={styles.headerRight}>
          {showQuickNav && <HeaderQuickNav />}
          {rightContent}
          {showNotif && (
            <TouchableOpacity 
              style={styles.notifBtn} 
              onPress={() => setShowNotifications(true)}
            >
              <Bell size={24} color={ThemeColors.textSecondary} />
              {unreadCount > 0 && (
                <View style={styles.notifDot}>
                  <Text style={styles.notifDotText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {bottomContent}

      {showNotif && (
        <NotificationDropdown 
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
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
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  menuBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  notifBtn: { 
    position: "relative", 
    padding: 4 
  },
  notifDot: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notifDotText: {
    color: ThemeColors.white,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
});
