import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius } from "@/theme/theme";
import { CheckCircle, Clock } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export function InvoiceStatusBadge({ status }) {
  let color = ThemeColors.textMuted;
  let bg = ThemeColors.bg;
  let Icon = null;

  switch (status) {
    case "Paid":
      color = ThemeColors.emerald;
      bg = ThemeColors.emerald + "15";
      Icon = CheckCircle;
      break;
    case "Pending":
      color = ThemeColors.amber;
      bg = ThemeColors.amber + "15";
      Icon = Clock;
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {/* {Icon && <Icon size={12} color={color} />} */}
      <Text weight="bold" style={[styles.text, { color }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
