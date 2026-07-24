// ─── Petpooja-Style Restaurant POS Theme ──────────────────────────────────────
export const ThemeColors = {
  // Base
  black: "#000000",
  white: "#FFFFFF",
  bg: "#F5F7FA", // Light grey background
  surface: "#FFFFFF",
  surfaceElevated: "#F0F2F5", // Slightly darker for nested containers
  border: "#E2E8F0",
  borderSubtle: "#F1F5F9",

  // Petpooja Branding
  primary: "#1B2838", // Dark navy sidebar
  primaryLight: "#243447",
  accent: "#FF6B35", // Petpooja Orange
  accentDim: "#FFF0E8", // Light orange background
  accentDark: "#E55A2B", // Darker orange for press states

  // Text
  textPrimary: "#0F172A",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Success / Positive
  emerald: "#059669",
  emeraldChart: "#10B981",
  emeraldDim: "#DCFCE7",

  // Danger / Negative
  red: "#DC2626",
  redDim: "#FEE2E2",
  rose: "#E11D48",
  roseDim: "#FFE4E6",

  // Warning
  amber: "#D97706",
  amberDim: "#FEF3C7",

  // Info / Link
  blue: "#2563EB",
  blueDim: "#DBEAFE",

  // Misc
  violet: "#8B5CF6",
  violetDim: "#EDE9FE",
  indigoDim: "#E0E7FF",
  teal: "#0F766E",
  tealDim: "#CCFBF1",
  cyan: "#06B6D4",
  cyanDim: "#CFFAFE",

  // ── Order Status Colors ──────────────────
  statusNew: "#3B82F6", // Blue - new order
  statusAccepted: "#8B5CF6", // Violet - accepted
  statusPreparing: "#F59E0B", // Amber - cooking
  statusReady: "#10B981", // Green - ready to serve
  statusServed: "#059669", // Dark green - served
  statusCompleted: "#6B7280", // Grey - done
  statusCancelled: "#EF4444", // Red - cancelled

  // ── Table Status Colors ──────────────────
  tableAvailable: "#10B981", // Green
  tableOccupied: "#EF4444", // Red
  tableReserved: "#F59E0B", // Yellow/Amber
  tableBilled: "#3B82F6", // Blue - bill generated

  // ── Aggregator Colors ──────────────────
  swiggy: "#FC8019", // Swiggy Orange
  zomato: "#E23744", // Zomato Red
  directOrder: "#059669", // Green for direct

  // ── Veg / Non-Veg ──────────────────
  veg: "#22C55E", // Green dot
  nonVeg: "#EF4444", // Red dot
  egg: "#ffdd00", // Amber dot
  vegan: "#15803D", // Dark Green dot
  jain: "#F97316", // Orange dot

  // ── KOT Timer Colors ──────────────────
  kotFresh: "#10B981", // < 10 min
  kotWarning: "#F59E0B", // 10-20 min
  kotCritical: "#EF4444", // > 20 min

  // Chart palette
  chart: [
    "#FF6B35",
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#8B5CF6",
    "#0E7490",
  ],
};

export const ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const ThemeRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
