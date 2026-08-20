import { Loader } from "@/components/common/Loader";
import { useResponsive } from "@/hooks/useResponsive";
import { fetchTeamMembers } from "@/store/slices/teamMemberSlice";
import { ThemeColors } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import EmployeeModal from "@/components/staff/EmployeeModal";
import { StaffFab } from "@/components/staff/StaffFab";
import { StaffHeader } from "@/components/staff/StaffHeader";
import DirectoryTab from "@/components/staff/tabs/DirectoryTab";

export default function StaffPage() {
  const navigation = useNavigation();
  const { isWebDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState("directory");

  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { loading, teamMembers } = useSelector((state) => state.teamMember);
  const businessId = auth.user?.businesses?.[0]?.id || auth.user?.business_id;

  useEffect(() => {
    if (businessId) {
      dispatch(fetchTeamMembers(businessId));
    }
  }, [businessId, dispatch]);

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

  if (loading && teamMembers.length === 0) {
    return <Loader />;
  }

  return (
    <View style={styles.root}>
      <StaffHeader
        isDesktop={isWebDesktop}
        navigation={navigation}
        dateString={dateString}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <View style={styles.contentArea}>
        <DirectoryTab onEditEmployee={handleEditEmployee} />
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
  root: { flex: 1, backgroundColor: ThemeColors.bg },
  contentArea: { flex: 1 },
});
