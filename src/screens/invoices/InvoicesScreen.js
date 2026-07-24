import { InvoicesHeader } from "@/components/invoices/InvoicesHeader";
import { InvoicesListTab } from "@/components/invoices/InvoicesListTab";
import { InvoicesSummaryCards } from "@/components/invoices/InvoicesSummaryCards";
import { useInvoices } from "@/context/InvoicesContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function InvoicesScreen() {
  const [isTodaySelected, setIsTodaySelected] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigation = useNavigation();
  const { isDesktop, isWebDesktop } = useResponsive();
  const { metrics } = useInvoices();

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.root}>
      <InvoicesHeader
        isDesktop={isWebDesktop}
        navigation={navigation}
        dateString={dateString}
        isTodaySelected={isTodaySelected}
        setIsTodaySelected={setIsTodaySelected}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InvoicesSummaryCards metrics={metrics} />

        <InvoicesListTab
          isTodaySelected={isTodaySelected}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

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
  scrollContent: {
    padding: ThemeSpacing.md,
  },
  contentSection: {
    minHeight: 400,
  },
  bottomPad: { height: 100 },
});
