import { Sidebar } from "@/components/Sidebar";
import { useStaff } from "@/context/StaffContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors } from "@/theme/theme";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
  useFonts,
} from "@expo-google-fonts/outfit";
import { usePathname, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  const {
    width,
    isMobile,
    isMiniTab,
    isTablet,
    isDesktop,
    isLaptop,
    isWebDesktop,
  } = useResponsive();

  const segments = useSegments();
  const pathname = usePathname();
  const isCustomerScreen = segments[0] === "order";
  const isLoginScreen = segments[0] === "login";
  const hideDrawer = isCustomerScreen || isLoginScreen;

  const drawerType = hideDrawer
    ? "front"
    : isWebDesktop
      ? "permanent"
      : "front";
  const drawerWidth = hideDrawer ? 0 : 230;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthGuard>
            <View
              style={{
                flex: 1,
                backgroundColor: ThemeColors.bg,
              }}
            >
              <Drawer
                drawerContent={(props) => (
                  <Sidebar
                    {...props}
                    isCollapsed={false}
                  />
                )}
                screenOptions={{
                  headerShown: false,
                  drawerType: drawerType,
                  drawerStyle: hideDrawer
                    ? { display: "none", width: 0 }
                    : {
                        width: drawerWidth,
                        backgroundColor:
                          "transparent",
                        borderRightWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                      },
                  sceneContainerStyle: {
                    backgroundColor: ThemeColors.bg,
                  },
                  overlayColor: "rgba(0,0,0,0.5)",
                }}
              />
            </View>
          </AuthGuard>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

function AuthGuard({ children }) {
  const { currentUser } = useStaff();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inOrderGroup = segments[0] === "order";
    const inLoginGroup = segments[0] === "login";

    if (!currentUser && !inLoginGroup && !inOrderGroup) {
      router.replace("/login");
    }
  }, [currentUser, segments]);

  return children;
}
