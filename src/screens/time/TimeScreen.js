import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttendanceTab } from "@/components/time/AttendanceTab";
import { TimeHeader } from "@/components/time/TimeHeader";

export default function TimeScreen() {
  const { isDesktop , isWebDesktop } = useResponsive();
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <TimeHeader
          isDesktop={isWebDesktop}
          onMenuPress={() => navigation.openDrawer()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AttendanceTab />
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
  scrollContent: {
    padding: ThemeSpacing.xxl,
  },
});
