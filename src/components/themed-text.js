import { ThemeColors } from "@/theme/theme";
import { StyleSheet, Text } from "react-native";

/**
 * ThemedText — the project-wide text component.
 *
 * Use the `type` prop to pick the correct Outfit variant instead of fontWeight:
 *
 *   type="default"    → Outfit_400Regular  (body text)
 *   type="medium"     → Outfit_500Medium
 *   type="semibold"   → Outfit_600SemiBold
 *   type="bold"       → Outfit_700Bold     (headings, labels)
 *   type="extrabold"  → Outfit_800ExtraBold (totals, big numbers)
 *   type="black"      → Outfit_900Black
 *   type="small"      → Outfit_400Regular  (12–13px secondary text)
 *   type="smallBold"  → Outfit_700Bold     (12–13px bold labels)
 *   type="title"      → Outfit_700Bold     (page titles)
 *   type="subtitle"   → Outfit_600SemiBold (section headings)
 *   type="label"      → Outfit_600SemiBold (uppercase labels)
 *   type="muted"      → Outfit_400Regular  (muted / placeholder)
 *   type="link"       → Outfit_500Medium
 *   type="linkPrimary"→ Outfit_500Medium + blue color
 */
export function ThemedText({
  style,
  type = "default",
  color,
  ...rest
}) {
  return (
    <Text
      style={[
        styles.base,
        styles[type] || styles.default,
        color ? { color } : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // ── Base ─────────────────────────────────────────────
  base: {
    fontFamily: "Outfit_400Regular",
    color: ThemeColors.textPrimary,
  },

  // ── Weight Variants ───────────────────────────────────
  default: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },
  medium: {
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },
  semibold: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },
  bold: {
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },
  extrabold: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },
  black: {
    fontFamily: "Outfit_900Black",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textPrimary,
  },

  // ── Semantic Variants ─────────────────────────────────
  small: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: ThemeColors.textSecondary,
  },
  smallBold: {
    fontFamily: "Outfit_700Bold",
    fontSize: 12,
    lineHeight: 18,
    color: ThemeColors.textPrimary,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 26,
    lineHeight: 34,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 18,
    lineHeight: 26,
    color: ThemeColors.textPrimary,
  },
  label: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    lineHeight: 16,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  muted: {
    fontFamily: "Outfit_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: ThemeColors.textMuted,
  },
  link: {
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.textSecondary,
  },
  linkPrimary: {
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
    lineHeight: 22,
    color: ThemeColors.blue,
  },
});
