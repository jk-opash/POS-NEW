import { ThemeColors } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";

import { StaffHeader } from "@/components/staff/StaffHeader";
import DirectoryTab from "@/components/staff/tabs/DirectoryTab";
import AttendanceTab from "@/components/staff/tabs/AttendanceTab";
import ShiftsTab from "@/components/staff/tabs/ShiftsTab";
import { StaffFab } from "@/components/staff/StaffFab";
import EmployeeModal from "@/components/staff/EmployeeModal";

export default function StaffScreen() {
  const navigation = useNavigation();
  const { isDesktop , isWebDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState("directory");

  // Hoisted Modal State for Directory
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleFabPress = () => {
    if (activeTab === "directory" || activeTab === "shifts") {
      setSelectedEmployee(null);
      setEmployeeModalVisible(true);
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeModalVisible(true);
  };

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.root}>
      {/* ── Top Header ──────────────────────────── */}
      <StaffHeader
        isDesktop={isWebDesktop}
        navigation={navigation}
        dateString={dateString}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── Content Area ────────────────────────── */}
      <View style={styles.contentArea}>
        {activeTab === "directory" && (
          <DirectoryTab onEditEmployee={handleEditEmployee} />
        )}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "shifts" && <ShiftsTab />}
      </View>

      <StaffFab activeTab={activeTab} onPress={handleFabPress} />

      <EmployeeModal
        visible={employeeModalVisible}
        onClose={() => setEmployeeModalVisible(false)}
        employee={selectedEmployee}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  contentArea: {
    flex: 1,
  },
});
