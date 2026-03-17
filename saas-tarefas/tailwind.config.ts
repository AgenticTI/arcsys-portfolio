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
        // Backgrounds
        "bg-app":     "#0C0B07",
        "bg-sidebar": "#080700",
        "bg-card":    "#161410",
        "bg-card-2":  "#1E1C14",
        "bg-input":   "#1A1814",
        // Accents
        accent:             "#E6CE00",
        "accent-dim":       "rgba(230,206,0,0.14)",
        "accent-glow":      "rgba(230,206,0,0.28)",
        "accent-orange":    "#D97820",
        "accent-orange-dim":"rgba(217,120,32,0.14)",
        "accent-green":     "#34C759",
        "accent-red":       "#FF3B30",
        "accent-blue":      "#0A84FF",
        // Text
        "text-primary":   "#F0ECD8",
        "text-secondary": "#A89E7C",
        "text-muted":     "#6A6248",
        "text-label":     "#8A8068",
        // Borders
        border:       "rgba(255,255,255,0.055)",
        "border-soft":"rgba(255,255,255,0.035)",
        // Priority (kept for PriorityBadge compatibility)
        "priority-high":   "#FF3B30",
        "priority-medium": "#D97820",
        "priority-low":    "#0A84FF",
      },
      // Use CSS variables injected by Next.js font optimization (set in layout.tsx)
      fontFamily: {
        sans:    ["var(--font-outfit)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
