import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
          DEFAULT: "#dc2626",
          light: "#fecaca",
          dark: "#991b1b",
        },
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.75" }],
        lg: ["1.125rem", { lineHeight: "1.75" }],
        xl: ["1.25rem", { lineHeight: "1.75" }],
        "2xl": ["1.5rem", { lineHeight: "1.5" }],
        "3xl": ["1.875rem", { lineHeight: "1.4" }],
        "4xl": ["2.25rem", { lineHeight: "1.3" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      borderRadius: {
        none: "0",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 15, 15, 0.05)",
        md: "0 4px 6px -1px rgba(15, 15, 15, 0.1)",
        lg: "0 10px 15px -3px rgba(15, 15, 15, 0.1)",
        xl: "0 20px 25px -5px rgba(15, 15, 15, 0.1)",
        soft: "0 18px 45px rgba(15, 15, 15, 0.15)",
        "2xl": "0 25px 50px -12px rgba(15, 15, 15, 0.25)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
      },
    },
  },
  plugins: [],
};

export default config;


