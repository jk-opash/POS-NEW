import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Eye } from "lucide-react-native";

export function TableItem({ table, onPress, onLongPress }) {
  const hasOrder = table.order && (Array.isArray(table.order) ? table.order.length > 0 : Object.keys(table.order).length > 0);
  const isOccupied = table.status === "Occupied" || hasOrder;
  const isReserved = table.status === "Reserved" && !hasOrder;
  const isAvailable = (!table.status || table.status === "Available") && !hasOrder;

  const isCircle = table.shape === "circle" || table.shape === "round";
  const isSquare = table.shape === "square";
  const isOval = table.shape === "oval";

  let containerWidth = 80;
  let bodyHeight = 60;
  let borderRadius = ThemeRadius.lg;

  // Use the table's span to scale up the UI dynamically
  const spanScale = Math.max(0, (table.span || 1) - 1);

  if (isSquare || isCircle) {
    // Square/circle grows symmetrically
    containerWidth = 80 + spanScale * 40;
    bodyHeight = containerWidth;
  } else {
    // Rectangle/oval grows mainly in width
    containerWidth = 80 + spanScale * 100;
    bodyHeight = 60;
  }

  if (isCircle || isOval) {
    borderRadius = 1000;
  }

  // Determine text and background colors based on status
  let textColor = ThemeColors.textPrimary;
  let bgColor = ThemeColors.white;
  let borderColor = ThemeColors.border;
  let chairColor = ThemeColors.white;
  let chairBorderColor = ThemeColors.border;

  if (isOccupied) {
    textColor = ThemeColors.blue;
    bgColor = ThemeColors.blueDim;
    borderColor = ThemeColors.blue;
    chairColor = ThemeColors.blue;
    chairBorderColor = ThemeColors.blue;
  } else if (isReserved) {
    textColor = ThemeColors.red;
    bgColor = ThemeColors.redDim;
    borderColor = ThemeColors.red;
    chairColor = ThemeColors.red;
    chairBorderColor = ThemeColors.red;
  }

  const chairsPerRow = Math.ceil(table.capacity / 2);
  const chairArray = Array.from({ length: chairsPerRow });

  const renderChairs = () => (
    <View style={styles.chairRow}>
      {chairArray.map((_, i) => (
        <View
          key={i}
          style={[
            styles.chair,
            {
              backgroundColor: chairColor,
              borderColor: chairBorderColor,
              borderWidth: 1,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderRadialChairs = () => {
    const chairCount = table.capacity;
    const tableRadius = containerWidth / 2;
    // Distance from center of table to center of chair
    const radius = tableRadius + 14;

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: "center", justifyContent: "center", zIndex: -1 },
        ]}
        pointerEvents="none"
      >
        {Array.from({ length: chairCount }).map((_, i) => {
          // Calculate angle for each chair, starting from top
          const angle = (i * 2 * Math.PI) / chairCount - Math.PI / 2;

          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          // Rotate chair to point inward
          const rotation = (angle * 180) / Math.PI + 90;

          return (
            <View
              key={i}
              style={[
                styles.chair,
                {
                  backgroundColor: chairColor,
                  borderColor: chairBorderColor,
                  position: "absolute",
                  transform: [
                    { translateX: x },
                    { translateY: y },
                    { rotate: `${rotation}deg` },
                  ],
                  marginVertical: 0,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderSquareChairs = () => {
    const count = table.capacity;

    // Distribute chairs among 4 sides
    const topCount = Math.ceil(count / 4);
    const rightCount = Math.ceil((count - topCount) / 3);
    const bottomCount = Math.ceil((count - topCount - rightCount) / 2);
    const leftCount = count - topCount - rightCount - bottomCount;

    const halfWidth = containerWidth / 2;
    const offset = halfWidth + 14; // distance from center to chair

    const renderSide = (sideCount, side) => {
      if (sideCount === 0) return null;

      return Array.from({ length: sideCount }).map((_, i) => {
        // Space chairs along the side. If 1 chair, center it (fraction = 0.5)
        const fraction = sideCount === 1 ? 0.5 : i / (sideCount - 1);

        // 30 padding so chairs don't overlap exactly at the corners
        const sideLength = Math.max(0, containerWidth - 36);
        const pos = (fraction - 0.5) * sideLength;

        let x = 0,
          y = 0,
          rotation = 0;

        switch (side) {
          case "top":
            x = pos;
            y = -offset;
            rotation = 0;
            break;
          case "right":
            x = offset;
            y = pos;
            rotation = 90;
            break;
          case "bottom":
            x = -pos;
            y = offset;
            rotation = 180;
            break;
          case "left":
            x = -offset;
            y = -pos;
            rotation = 270;
            break;
        }

        return (
          <View
            key={`${side}-${i}`}
            style={[
              styles.chair,
              {
                backgroundColor: chairColor,
                borderColor: chairBorderColor,
                position: "absolute",
                transform: [
                  { translateX: x },
                  { translateY: y },
                  { rotate: `${rotation}deg` },
                ],
                marginVertical: 0,
              },
            ]}
          />
        );
      });
    };

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: "center", justifyContent: "center", zIndex: -1 },
        ]}
        pointerEvents="none"
      >
        {renderSide(topCount, "top")}
        {renderSide(rightCount, "right")}
        {renderSide(bottomCount, "bottom")}
        {renderSide(leftCount, "left")}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(table)}
      onLongPress={() => onLongPress && onLongPress(table)}
      style={[
        styles.container,
        {
          width: containerWidth,
          height: isCircle || isSquare ? containerWidth : undefined,
          justifyContent: "center",
        },
      ]}
    >
      {/* Top Chairs (Rect/Oval only) */}
      {!(isCircle || isSquare) && renderChairs()}

      {/* Table Body */}
      <View
        style={[
          styles.tableBody,
          {
            backgroundColor: bgColor,
            height: bodyHeight,
            borderRadius,
            borderColor: textColor,
            flexDirection: isOccupied ? "row" : "column",
            gap: isOccupied ? 6 : 0,
          },
        ]}
      >
        <Text weight="bold" style={[styles.tableText, { color: textColor }]}>
          {table.name}
        </Text>
        {isOccupied && <Eye size={18} color={textColor} />}
      </View>

      {/* Bottom Chairs (Rect/Oval only) */}
      {!(isCircle || isSquare) && renderChairs()}

      {/* Radial Chairs (Circle only) */}
      {isCircle && renderRadialChairs()}

      {/* Square Chairs (Square only) */}
      {isSquare && renderSquareChairs()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chairRow: {
    flexDirection: "row",
    gap: 12,
  },
  chair: {
    width: 24,
    height: 8,
    backgroundColor: ThemeColors.surface,
    borderRadius: 4,
    marginVertical: 4,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tableBody: {
    width: "100%",
    height: 60,
    borderRadius: ThemeRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderColor: ThemeColors.border,
  },
  tableText: {
    fontSize: 16,
  },
});
