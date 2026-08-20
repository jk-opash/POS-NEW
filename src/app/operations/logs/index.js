import { LogsEmptyState } from "@/components/operations/logs/LogsEmptyState";
import { CommonHeader } from "@/components/common/CommonHeader";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { Loader } from "@/components/common/Loader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "@/store/slices/auditLogSlice";
import { Text } from "@/components/ui/Text";

export default function LogsScreen() {
  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.auditLog);
  const activeBranch = useSelector((state) => state.branch?.activeBranch);
  const userBranchId = useSelector((state) => state.auth?.user?.branch_id);
  const currentBranchId =
    activeBranch && activeBranch !== "br-1" ? activeBranch : userBranchId;

  const { isWebDesktop } = useResponsive();

  useEffect(() => {
    if (currentBranchId) {
      dispatch(fetchAuditLogs(currentBranchId));
    }
  }, [dispatch, currentBranchId]);

  return (
    <View style={styles.root}>
      <CommonHeader 
        title="Audit Logs"
        subtitle="Track system actions and security events"
        isDesktop={isWebDesktop} 
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.listContent}
      >
        <View style={{ minWidth: 900, width: "100%" }}>
          <View style={styles.tableHeader}>
            <Text weight="bold" style={[styles.col, { width: 130 }]}>
              Reference
            </Text>
            <Text weight="bold" style={[styles.col, { width: 180 }]}>
              Date
            </Text>
            <Text weight="bold" style={[styles.col, { width: 180 }]}>
              Action
            </Text>
            <Text weight="bold" style={[styles.col, { flex: 1, minWidth: 200 }]}>
              Details
            </Text>
            <Text weight="bold" style={[styles.col, { width: 100, textAlign: "center" }]}>
              Severity
            </Text>
            <Text
              weight="bold"
              style={[styles.col, { width: 120, textAlign: "right" }]}
            >
              User
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={{ padding: 40, alignItems: "center", backgroundColor: ThemeColors.white }}>
                <Loader text="Loading logs..." />
              </View>
            ) : !logs || logs.length === 0 ? (
              <View style={{ padding: 40, alignItems: "center", backgroundColor: ThemeColors.white }}>
                <LogsEmptyState />
              </View>
            ) : (
              logs.map((item) => {
                const getSeverityColor = (severity) => {
                  if (severity === "critical") return ThemeColors.red;
                  if (severity === "warning") return ThemeColors.amber;
                  return ThemeColors.blue;
                };
                const severityColor = getSeverityColor(item.severity);

                return (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.col, { width: 130, color: ThemeColors.blue }]} numberOfLines={1}>
                      {item.id.slice(0, 10).toUpperCase()}
                    </Text>
                    <Text
                      style={[styles.col, { width: 180, color: ThemeColors.textMuted }]}
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </Text>
                    <Text style={[styles.col, { width: 180 }]} numberOfLines={1}>
                      {item.action || "-"}
                    </Text>
                    <Text
                      style={[
                        styles.col,
                        { flex: 1, minWidth: 200, color: ThemeColors.textSecondary },
                      ]}
                    >
                      {item.details || "-"}
                    </Text>

                    <View style={[styles.col, { width: 100, alignItems: "center" }]}>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: severityColor + "20" },
                        ]}
                      >
                        <Text
                          weight="bold"
                          style={[styles.badgeText, { color: severityColor }]}
                        >
                          {item.severity ? item.severity.toUpperCase() : "INFO"}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.col,
                        {
                          width: 120,
                          textAlign: "right",
                          color: ThemeColors.textSecondary,
                        },
                      ]}
                    >
                      {item.actor_name || "System"}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  container: {
    width: "100%",
  },
  listContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    borderTopLeftRadius: ThemeRadius.md,
    borderTopRightRadius: ThemeRadius.md,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
    backgroundColor: ThemeColors.white,
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  badgeText: { fontSize: 10 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
