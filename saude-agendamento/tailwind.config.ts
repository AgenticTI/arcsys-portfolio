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
          DEFAULT: "#3DAA6D",
          light: "#EBF7F0",
        },
        accent: "#5B8CDB",
        neutral: {
          900: "#1A1D23",
          500: "#6B7280",
          100: "#F4F6F8",
        },
        status: {
          confirmed: "#3DAA6D",
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
        card: "0 2px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
