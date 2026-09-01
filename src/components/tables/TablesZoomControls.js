import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function TablesZoomControls({
  isSmallScreen,
  isEditMode,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
}) {
  return (
    <View
      style={[
        styles.zoomControls,
        {
          bottom: (isSmallScreen ? ThemeSpacing.md : ThemeSpacing.xl) + 70,
          right: isSmallScreen ? ThemeSpacing.md : ThemeSpacing.xxl,
        },
        isSmallScreen && {
          flexDirection: "column",
        },
        isEditMode && {
          bottom: (isSmallScreen ? ThemeSpacing.md : ThemeSpacing.xl) + 140,
        },
      ]}
    >
      {isSmallScreen ? (
        <>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <ZoomIn size={20} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.scaleBtn} onPress={handleResetZoom}>
            <Maximize size={16} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <ZoomOut size={20} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <ZoomOut size={20} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.scaleBtn} onPress={handleResetZoom}>
            <Text style={styles.scaleText}>Reset</Text>
            <Maximize size={16} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <ZoomIn size={20} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  zoomControls: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    right: ThemeSpacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.xs,
    backgroundColor: ThemeColors.surface,
    padding: ThemeSpacing.xs,
    borderRadius: ThemeRadius.full,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  zoomBtn: {
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.full,
  },
  scaleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
  },
  scaleText: {
    fontSize: 12,
    color: ThemeColors.textPrimary,
    fontWeight: "600",
  },
});
