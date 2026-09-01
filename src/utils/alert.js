import { Alert, Platform } from "react-native";
import Toast from "react-native-toast-message";

/**
 * Cross-platform alert that works on both native (iOS/Android)
 * and web (browser). Drop-in replacement for Alert.alert.
 *
 * @param {string} title
 * @param {string} [message]
 * @param {Array<{text: string, onPress?: () => void, style?: string}>} [buttons]
 */
export function showAlert(title, message = "", buttons) {
  // Helper to figure out the Toast type based on context
  const getToastType = () => {
    const combined = `${title || ""} ${message || ""}`.toLowerCase();
    if (
      combined.includes("error") ||
      combined.includes("empty") ||
      combined.includes("required") ||
      combined.includes("no active") ||
      combined.includes("not allowed") ||
      combined.includes("please add") ||
      combined.includes("cannot") ||
      combined.includes("failed")
    ) {
      return "error";
    }
    if (combined.includes("cancel") || combined.includes("restored")) {
      return "info";
    }
    return "success"; // Default for "Payment Successful", "Sent to Kitchen", etc.
  };

  if (Platform.OS !== "web") {
    // Native: use React Native's Alert as-is if there are interactive buttons
    if (
      buttons &&
      buttons.length > 0 &&
      !(buttons.length === 1 && buttons[0].text === "OK" && !buttons[0].onPress)
    ) {
      Alert.alert(title, message, buttons);
      return;
    }

    // Otherwise, show Toast!
    Toast.show({
      type: getToastType(),
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
    return;
  }

  // Web fallback
  if (
    !buttons ||
    buttons.length === 0 ||
    (buttons.length === 1 && buttons[0].text === "OK" && !buttons[0].onPress)
  ) {
    // Show Toast for Web as well!
    Toast.show({
      type: getToastType(),
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
    return;
  }

  // Filter out cancel-style buttons to find confirm/destructive ones
  const cancelBtn = buttons.find((b) => b.style === "cancel");
  const confirmBtn = buttons.find(
    (b) => b.style === "destructive" || b.style !== "cancel",
  );

  if (buttons.length === 1) {
    // Only one button — just alert and call its handler
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
    buttons[0]?.onPress?.();
    return;
  }

  // Two+ buttons — use window.confirm for yes/no style
  const confirmed = window.confirm(
    `${title}${message ? `\n\n${message}` : ""}`,
  );

  if (confirmed) {
    confirmBtn?.onPress?.();
  } else {
    cancelBtn?.onPress?.();
  }
}
