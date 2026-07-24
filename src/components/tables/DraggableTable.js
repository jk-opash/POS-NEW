import { ThemeColors } from "@/theme/theme";
import { Edit2, RotateCw } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TableItem } from "./TableItem";

export function DraggableTable({
  table,
  isEditMode,
  onPositionChange,
  onRotationChange,
  onEdit,
  onPress,
}) {
  const translateX = useSharedValue(table.x);
  const translateY = useSharedValue(table.y);
  const rotation = useSharedValue(table.rotation || 0);
  const isDragging = useSharedValue(false);

  // Keep in sync with context if it changes from outside
  useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withTiming(table.x, { damping: 20, stiffness: 200 });
      translateY.value = withTiming(table.y, { damping: 20, stiffness: 200 });
      rotation.value = withTiming(table.rotation || 0, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [table.x, table.y, table.rotation]);

  const panGesture = Gesture.Pan()
    .enabled(isEditMode)
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      translateX.value = table.x + e.translationX;
      translateY.value = table.y + e.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      // Snap to a grid of 25 (easier for neat layouts)
      const snappedX = Math.round(translateX.value / 25) * 25;
      const snappedY = Math.round(translateY.value / 25) * 25;
      translateX.value = withTiming(snappedX, { duration: 100 });
      translateY.value = withTiming(snappedY, { duration: 100 });

      if (onPositionChange) {
        runOnJS(onPositionChange)(table.id, snappedX, snappedY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: 0,
    top: 0,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: isDragging.value ? withSpring(1.05) : withSpring(1) },
    ],
    zIndex: isDragging.value ? 100 : 1,
    opacity: isEditMode ? (isDragging.value ? 0.8 : 1) : 1,
  }));
  const handleRotate = () => {
    const newRot = (table.rotation || 0) + 90;
    if (onRotationChange) {
      onRotationChange(table.id, newRot);
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={panGesture}>
        <View>
          <TableItem table={table} onPress={isEditMode ? undefined : onPress} />
        </View>
      </GestureDetector>

      {isEditMode && (
        <>
          <TouchableOpacity
            style={styles.rotateBtn}
            onPress={handleRotate}
            activeOpacity={0.7}
          >
            <RotateCw size={14} color={ThemeColors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit && onEdit(table)}
            activeOpacity={0.7}
          >
            <Edit2 size={14} color={ThemeColors.white} />
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rotateBtn: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: ThemeColors.emerald,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  editBtn: {
    position: "absolute",
    top: -10,
    left: -10,
    backgroundColor: ThemeColors.blue,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
});
