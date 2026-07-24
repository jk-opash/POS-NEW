import { useWindowDimensions, Platform } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  // Define breakpoints
  const isDesktop = width >= 1200;
  const isLaptop = width >= 1024;
  const isTablet = width >= 768 && width < 1200;
  const isMiniTab = width >= 500 && width < 768;
  const isMobile = width < 500;

  const isWebDesktop = Platform.OS === "web" && (isDesktop || isLaptop);

  return {
    width,
    height,
    isDesktop,
    isTablet,
    isMiniTab,
    isMobile,
    isLaptop,
    isWebDesktop,
  };
}
