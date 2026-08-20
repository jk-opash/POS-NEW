import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Menu, ArrowLeft } from "lucide-react-native";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { HeaderQuickNav } from "@/components/common/HeaderQuickNav";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";

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
            <TouchableOpacity style={styles.notifBtn}>
              <Bell size={24} color={ThemeColors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {bottomContent}
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
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },
});
