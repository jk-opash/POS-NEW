import { Text } from "@/components/ui/Text";
import { useStaff } from "@/context/StaffContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  Lock,
  Mail,
  Monitor,
  Package,
  ShoppingCart,
  Store,
} from "lucide-react-native";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <View style={styles.featureCard}>
    <Icon
      size={24}
      color={ThemeColors.emerald}
      style={{ marginBottom: ThemeSpacing.sm }}
    />
    <Text weight="semibold" style={styles.featureTitle}>
      {title}
    </Text>
    <Text weight="regular" style={styles.featureDescription}>
      {description}
    </Text>
  </View>
);

export default function LoginScreen() {
  const [email, setEmail] = useState("anand@dailygrind.co");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useStaff();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const success = login(email, password);
    if (success) {
      setError("");
      router.replace("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const isWide = isTablet || isDesktop;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        <View
          style={[
            styles.splitContainer,
            !isWide && styles.splitContainerMobile,
          ]}
        >
          {/* Left Panel - Branding and Features */}
          {isWide && (
            <ImageBackground
              source={require("../assets/images/pos_bg.png")}
              style={styles.leftPanel}
              resizeMode="cover"
            >
              {/* Dark Overlay for readability */}
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(15, 23, 42, 0.8)" },
                ]}
              />

              {/* Background Decorative Circles */}
              <View style={[styles.decorativeCircle, styles.circleTopLeft]} />
              <View
                style={[styles.decorativeCircle, styles.circleBottomRight]}
              />

              <View style={styles.leftContent}>
                <View style={styles.logoCard}>
                  <View style={styles.logoIconContainer}>
                    <Store size={32} color={ThemeColors.emerald} />
                  </View>
                  <View>
                    <Text weight="extrabold" style={styles.logoTitle}>
                      POS
                    </Text>
                    <Text weight="semibold" style={styles.logoSubtitle}>
                      SOFTWARE
                    </Text>
                  </View>
                </View>

                <View style={styles.featuresGrid}>
                  <FeatureCard
                    icon={ShoppingCart}
                    title="Fast Checkout"
                    description="Streamlined billing & payments"
                  />
                  <FeatureCard
                    icon={Package}
                    title="Inventory Management"
                    description="Real-time stock tracking"
                  />
                  <FeatureCard
                    icon={LayoutGrid}
                    title="Table Management"
                    description="Interactive dine-in floor plans"
                  />
                  <FeatureCard
                    icon={Monitor}
                    title="Kitchen Display"
                    description="Direct KDS order routing"
                  />
                </View>
              </View>
            </ImageBackground>
          )}

          {/* Right Panel - Login Form */}
          <View
            style={[
              styles.rightPanel,
              !isWide && { paddingTop: ThemeSpacing.xl },
            ]}
          >
            <View style={styles.formWrapper}>
              <View style={styles.headerContainer}>
                <Text weight="bold" style={styles.title}>
                  Welcome back
                </Text>
                <Text weight="regular" style={styles.subtitle}>
                  Sign in to your POS account
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Email address
                  </Text>
                  <View style={styles.inputContainer}>
                    <Mail
                      size={18}
                      color={ThemeColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="name@company.com"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError("");
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.passwordHeader}>
                    <Text weight="semibold" style={styles.label}>
                      Password
                    </Text>
                    <TouchableOpacity>
                      <Text weight="medium" style={styles.forgotText}>
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Lock
                      size={18}
                      color={ThemeColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setError("");
                      }}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={ThemeColors.textMuted} />
                      ) : (
                        <Eye size={18} color={ThemeColors.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {error ? (
                  <Text weight="regular" style={styles.errorText}>
                    {error}
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text weight="semibold" style={styles.loginButtonText}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  splitContainer: {
    flex: 1,
    flexDirection: "row",
  },
  splitContainerMobile: {
    flexDirection: "column",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: ThemeSpacing.xxxl,
  },
  decorativeCircle: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: ThemeColors.emerald,
    opacity: 0.15,
  },
  circleTopLeft: {
    top: -150,
    left: -150,
  },
  circleBottomRight: {
    bottom: -150,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: ThemeColors.emerald,
    opacity: 0.1,
  },
  leftContent: {
    width: "100%",
    maxWidth: 480,
    padding: ThemeSpacing.xxxl,
    alignItems: "center",
    zIndex: 1,
  },
  logoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.white,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    marginBottom: 40,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoIconContainer: {
    marginRight: ThemeSpacing.sm,
  },
  logoTitle: {
    fontSize: 24,
    color: ThemeColors.emerald,
    lineHeight: 28,
  },
  logoSubtitle: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    letterSpacing: 2,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: ThemeSpacing.lg,
  },
  featureCard: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.emeraldDim,
    borderWidth: 1,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    width: "46%",
    minWidth: 160,
  },
  featureTitle: {
    fontSize: 13,
    color: ThemeColors.white,
    marginBottom: ThemeSpacing.xs,
  },
  featureDescription: {
    fontSize: 11,
    color: ThemeColors.textMuted,
    lineHeight: 16,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    marginBottom: ThemeSpacing.xxxl,
  },
  title: {
    fontSize: 28,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  formContainer: {
    width: "100%",
    backgroundColor: ThemeColors.white,
    padding: ThemeSpacing.xxxl,
    borderRadius: ThemeRadius.lg,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: ThemeSpacing.xl,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: ThemeSpacing.sm,
  },
  label: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.sm,
  },
  forgotText: {
    fontSize: 12,
    color: ThemeColors.emerald,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceElevated,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
  },
  inputIcon: {
    marginRight: ThemeSpacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  loginButton: {
    backgroundColor: ThemeColors.emerald,
    height: 46,
    borderRadius: ThemeRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: ThemeSpacing.md,
  },
  loginButtonText: {
    fontSize: 15,
    color: ThemeColors.white,
  },
  errorText: {
    color: ThemeColors.red,
    fontSize: 13,
    marginBottom: ThemeSpacing.md,
    textAlign: "center",
  },
});
