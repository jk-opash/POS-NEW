import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Eye } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const getMockAnalytics = (tableName) => {
  const hash = tableName.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return {
    scans: (hash % 20) + 1,
    orders: (hash % 10) + 1,
  };
};

export function TableQRCard({
  table,
  isSelected,
  onSelect,
  onPreview,
  onDownload,
  qrRefs,
}) {
  const baseUrl = process.env.EXPO_PUBLIC_QR_ORDERING_URL || "https://your-ordering-site.com/order";
  const url = `${baseUrl}?table=${table.name}`;
  const analytics = getMockAnalytics(table.name);

  return (
    <View style={[styles.qrCard, isSelected && styles.qrCardSelected]}>
      <View style={styles.qrCodeContainer}>
        <QRCode
          getRef={(c) => {
            if (qrRefs) {
              qrRefs.current[table.name] = c;
            }
          }}
          value={url}
          size={100}
          color={ThemeColors.primary}
          backgroundColor={ThemeColors.white}
        />
      </View>
      <Text weight="bold" style={styles.qrTableName}>
        Table {table.name}
      </Text>

      <TouchableOpacity
        style={styles.qrActionBtn}
        onPress={() => onPreview(table)}
      >
        <Eye size={14} color={ThemeColors.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  qrCardSelected: { borderColor: ThemeColors.accent, borderWidth: 2 },
  qrCodeContainer: {
    padding: 8,
    backgroundColor: ThemeColors.white,
    borderRadius: ThemeRadius.md,
  },
  qrTableName: { fontSize: 16, color: ThemeColors.textPrimary },
  qrStats: { flexDirection: "row", gap: 12 },
  qrStat: { fontSize: 11, color: ThemeColors.textMuted },
  qrActions: { flexDirection: "row", gap: 8 },
  qrActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ThemeColors.bg,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: ThemeSpacing.lg,
    right: ThemeSpacing.lg,
  },
});
