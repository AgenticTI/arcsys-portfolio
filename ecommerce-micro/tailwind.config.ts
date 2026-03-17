import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF',
        surface: '#F5F5F7',
        'text-primary': '#1D1D1F',
        'text-secondary': '#6E6E73',
        border: '#D2D2D7',
        'admin-bg': '#0F0F0F',
        accent: 'var(--cor-principal)',
        'dark-surface':   '#0A0A0A',
        'card-dark':      '#141414',
        'card-img-dark':  '#1c1c1c',
      },
      letterSpacing: {
        widest: '0.15em',
      },
    },
  },
  plugins: [],
} satisfies Config
