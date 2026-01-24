/**
 * Design System Tokens
 * Centralized design tokens for the Marefat Pilgrimage brand
 */

export const colors = {
  ivory: {
    DEFAULT: "#f7f3eb",
    50: "#fefdfb",
    100: "#fdfbf7",
    200: "#faf7ef",
    300: "#f7f3eb",
    400: "#f5efe5",
    500: "#f2ebdf",
  },
  charcoal: {
    DEFAULT: "#151515",
    900: "#0a0a0a",
    800: "#151515",
    700: "#2a2a2a",
    600: "#3f3f3f",
    500: "#555555",
    400: "#6a6a6a",
    300: "#808080",
    200: "#959595",
    100: "#aaaaaa",
    50: "#bfbfbf",
  },
  gold: {
    DEFAULT: "#c7a56a",
    dark: "#a0844f",
    soft: "#e3cfa0",
    light: "#f0e4c8",
    pale: "#f7f0e0",
  },
  danger: {
    DEFAULT: "#dc2626", // red-600
    light: "#fecaca", // red-200
    dark: "#991b1b", // red-800
  },
} as const;

export const spacing = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
} as const;

export const typography = {
  fontFamily: {
    display: ["var(--font-display)", "system-ui", "sans-serif"],
    sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
    base: ["1rem", { lineHeight: "1.75" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "1.5" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "1.4" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "1.3" }], // 36px
    "5xl": ["3rem", { lineHeight: "1.2" }], // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export const borderRadius = {
  none: "0",
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.75rem", // 28px
  "3xl": "2rem", // 32px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(15, 15, 15, 0.05)",
  md: "0 4px 6px -1px rgba(15, 15, 15, 0.1)",
  lg: "0 10px 15px -3px rgba(15, 15, 15, 0.1)",
  xl: "0 20px 25px -5px rgba(15, 15, 15, 0.1)",
  soft: "0 18px 45px rgba(15, 15, 15, 0.15)",
  "2xl": "0 25px 50px -12px rgba(15, 15, 15, 0.25)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const transitions = {
  fast: "150ms ease-in-out",
  base: "200ms ease-in-out",
  slow: "300ms ease-in-out",
  slower: "500ms ease-in-out",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
