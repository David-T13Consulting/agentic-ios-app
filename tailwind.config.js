/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Core palette
        background: "#FAFAFA",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F5F5F5",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
        },
        border: "#F3F4F6",

        // Accent
        accent: {
          DEFAULT: "#6366F1",
          light: "#EEF2FF",
          dark: "#4F46E5",
        },

        // Semantic
        error: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      fontSize: {
        display: ["34px", { lineHeight: "40px", fontWeight: "700" }],
        "heading-lg": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        heading: ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "heading-sm": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-medium": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "caption-medium": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        tiny: ["11px", { lineHeight: "14px", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
