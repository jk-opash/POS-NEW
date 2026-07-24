import { ThemeColors } from "@/theme/theme";
import { Text as RNText } from "react-native";

/**
 * Lightweight Text used across Dashboard components.
 * Use the `weight` prop instead of fontWeight in styles.
 *
 *   weight="regular"   → Outfit_400Regular  (default)
 *   weight="medium"    → Outfit_500Medium
 *   weight="semibold"  → Outfit_600SemiBold
 *   weight="bold"      → Outfit_700Bold
 *   weight="extrabold" → Outfit_800ExtraBold
 *   weight="black"     → Outfit_900Black
 */

const FONT_MAP = {
  regular:   "Outfit_400Regular",
  medium:    "Outfit_500Medium",
  semibold:  "Outfit_600SemiBold",
  bold:      "Outfit_700Bold",
  extrabold: "Outfit_800ExtraBold",
  black:     "Outfit_900Black",
};

export function Text({ style, weight = "regular", ...props }) {
  const fontFamily = FONT_MAP[weight] || "Outfit_400Regular";

  return (
    <RNText
      {...props}
      style={[
        { fontFamily, color: ThemeColors.textPrimary },
        style,
      ]}
    />
  );
}
