import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: "0.5rem",
      sm: "0.75rem",
      base: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
      "2xl": "1.25rem",
      "3xl": "1.5rem",
      "4xl": "1.875rem",
      "5xl": "2.25rem",
      "6xl": "3rem",
      "7xl": "4rem",
    },
    extend: {
      colors: {
        primary: {
          100: "#025D9C",
          500: "#01385E",
          900: "#001A2B",
        },
        secondary: {
          100: "#00BEC4",
          500: "#00999E",
          900: "#006063",
        },
        accent: {
          100: "#FF00AC",
          500: "#E10098",
          900: "#A5006F",
        },
      },
      maxWidth: {
        container: "1400px",
      },
      width: {
        modal: "600px",
      },
    },
    boxShadow: {
      none: "0 0 #000",
      dark1: [
        "0px 2px 1px -1px rgba(0,0,0,0.2)",
        "0px 1px 1px 0px rgba(0,0,0,0.14)",
        "0px 1px 3px 0px rgba(0,0,0,0.12)",
      ].join(", "),
      dark2: [
        "0px 3px 1px -2px rgba(0,0,0,0.2)",
        "0px 2px 2px 0px rgba(0,0,0,0.14)",
        "0px 1px 5px 0px rgba(0,0,0,0.12)",
      ].join(", "),
      dark3: [
        "0px 3px 3px -2px rgba(0,0,0,0.2)",
        "0px 3px 4px 0px rgba(0,0,0,0.14)",
        "0px 1px 8px 0px rgba(0,0,0,0.12)",
      ].join(", "),
      dark4: [
        "0px 2px 4px -1px rgba(0,0,0,0.2)",
        "0px 4px 5px 0px rgba(0,0,0,0.14)",
        "0px 1px 10px 0px rgba(0,0,0,0.12)",
      ].join(", "),
      dark5: [
        "0px 3px 5px -1px rgba(0,0,0,0.2)",
        "0px 5px 8px 0px rgba(0,0,0,0.14)",
        "0px 1px 14px 0px rgba(0,0,0,0.12)",
      ].join(", "),
      dark6: [
        "0px 4px 5px -2px rgba(0,0,0,0.2)",
        "0px 7px 10px 1px rgba(0,0,0,0.14)",
        "0px 2px 16px 1px rgba(0,0,0,0.12)",
      ].join(", "),
      dark7: [
        "0px 6px 6px -3px rgba(0,0,0,0.2)",
        "0px 10px 14px 1px rgba(0,0,0,0.14)",
        "0px 4px 18px 3px rgba(0,0,0,0.12)",
      ].join(", "),
      dark8: [
        "0px 8px 9px -5px rgba(0,0,0,0.2)",
        "0px 15px 22px 2px rgba(0,0,0,0.14)",
        "0px 6px 28px 5px rgba(0,0,0,0.12)",
      ].join(", "),
      dark9: [
        "0px 10px 13px -6px rgba(0,0,0,0.2)",
        "0px 20px 31px 3px rgba(0,0,0,0.14)",
        "0px 8px 38px 7px rgba(0,0,0,0.12)",
      ].join(", "),
      dark10: [
        "0px 11px 15px -7px rgba(0,0,0,0.2)",
        "0px 24px 38px 3px rgba(0,0,0,0.14)",
        "0px 9px 46px 8px rgba(0,0,0,0.12)",
      ].join(", "),
      success: [
        "0px 6px 6px -3px rgba(28,182,81,0.2)",
        "0px 10px 14px 1px rgba(28,182,81,0.14)",
        "0px 4px 18px 3px rgba(28,182,81,0.12)",
      ].join(", "),
      error: [
        "0px 6px 6px -3px rgba(234,53,14,0.2)",
        "0px 10px 14px 1px rgba(234,53,14,0.14)",
        "0px 4px 18px 3px rgba(234,53,14,0.12)",
      ].join(", "),
      warning: [
        "0px 6px 6px -3px rgba(242,200,88,0.2)",
        "0px 10px 14px 1px rgba(242,200,88,0.14)",
        "0px 4px 18px 3px rgba(242,200,88,0.12)",
      ].join(", "),
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
