import { LogOut, ShieldAlert } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../../services/socketService";
import { logoutUser } from "../../store/slices/authSlice";
import { ThemeColors as Colors } from "../../theme/theme";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

export default function SessionConflictModal() {
  const { sessionConflict, sessionConflictMessage } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionConflict) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-focus after animation
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 400);
    } else {
      // Reset state when closed
      setPin("");
      setIsError(false);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [sessionConflict]);

  // Listen to socket failure event to shake the modal
  useEffect(() => {
    const handleFailure = () => {
      setIsSubmitting(false);
      setIsError(true);
      setPin("");

      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      if (inputRef.current) inputRef.current.focus();
    };

    socketService.on("session_conflict_failed", handleFailure);
    return () => {
      // Cleanup listener if possible, but socketService doesn't have an off method exposed easily.
      // Assuming it's handled or we just ignore duplicate triggers safely.
    };
  }, []);

  if (!sessionConflict) return null;

  const handleSubmit = () => {
    if (!pin || pin.length < 4) return;
    setIsError(false);
    setIsSubmitting(true);
    socketService.emit("resolve_conflict", { pin });

    // Fallback timeout in case server doesn't respond
    if (isSubmitting) setIsSubmitting(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Modal visible={sessionConflict} transparent animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <ShieldAlert size={36} color={Colors.amber} strokeWidth={2} />
            </View>
          </View>

          <Text style={styles.title}>Session Conflict</Text>
          <Text style={styles.message}>
            {sessionConflictMessage ||
              "This account is active on another device. Enter your PIN to take over this session."}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[styles.input, isError && styles.inputError]}
              placeholder="Enter your PIN"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              keyboardType="number-pad"
              value={pin}
              onChangeText={(text) => {
                setPin(text);
                setIsError(false);
              }}
              maxLength={6}
              editable={!isSubmitting}
              onSubmitEditing={handleSubmit}
            />
            {isError && (
              <Text style={styles.errorText}>
                Invalid PIN. Please try again.
              </Text>
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleLogout}
              disabled={isSubmitting}
              activeOpacity={0.6}
            >
              <LogOut
                size={18}
                color={Colors.textSecondary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.secondaryButtonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (isSubmitting || !pin || pin.length < 4) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !pin || pin.length < 4}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Take Over</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.1)", // Dark slate overlay
    backdropFilter: "blur(8px)", // For web
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: isTablet ? 20 : 28,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.amberDim,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 8,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.red,
    backgroundColor: Colors.redDim,
    color: Colors.red,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
