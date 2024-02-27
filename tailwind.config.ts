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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
