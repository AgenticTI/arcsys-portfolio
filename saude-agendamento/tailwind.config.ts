import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#88CD0A",
          light: "rgba(136,205,10,0.12)",
          dark: "#6B9C00",
        },
        dark: {
          bg: "#0f1114",
          card: "#1A1D23",
          border: "#2d3139",
          surface: "#3d4149",
        },
        neutral: {
          900: "#1A1D23",
          800: "#2d3139",
          500: "#6B7280",
          100: "#F4F6F8",
        },
        status: {
          confirmed: "#88CD0A",
          pending: "#F59E0B",
          cancelled: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
