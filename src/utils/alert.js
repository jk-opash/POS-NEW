import { Alert, Platform } from "react-native";

/**
 * Cross-platform alert that works on both native (iOS/Android)
 * and web (browser). Drop-in replacement for Alert.alert.
 *
 * @param {string} title
 * @param {string} [message]
 * @param {Array<{text: string, onPress?: () => void, style?: string}>} [buttons]
 */
export function showAlert(title, message = "", buttons) {
  if (Platform.OS !== "web") {
    // Native: use React Native's Alert as-is
    if (buttons && buttons.length > 0) {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert(title, message);
    }
    return;
  }

  // Web fallback
  if (!buttons || buttons.length === 0) {
    // Simple info alert
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
    return;
  }

  // Filter out cancel-style buttons to find confirm/destructive ones
  const cancelBtn = buttons.find((b) => b.style === "cancel");
  const confirmBtn = buttons.find(
    (b) => b.style === "destructive" || b.style !== "cancel"
  );

  if (buttons.length === 1) {
    // Only one button — just alert and call its handler
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
    buttons[0]?.onPress?.();
    return;
  }

  // Two+ buttons — use window.confirm for yes/no style
  const confirmed = window.confirm(
    `${title}${message ? `\n\n${message}` : ""}`
  );

  if (confirmed) {
    confirmBtn?.onPress?.();
  } else {
    cancelBtn?.onPress?.();
  }
}
