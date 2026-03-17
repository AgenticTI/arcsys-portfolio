import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-sidebar": "#111118",
        "bg-main": "#F7F7F8",
        "bg-card": "#FFFFFF",
        accent: "#7C3AED",
        "accent-soft": "#EDE9FE",
        "text-primary": "#0D0D12",
        "text-muted": "#6B7280",
        border: "#E5E7EB",
        "priority-high": "#EF4444",
        "priority-medium": "#F59E0B",
        "priority-low": "#10B981",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
