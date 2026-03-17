import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'noir-black':     '#090806',
        'noir-white':     '#F0EAE0',
        'noir-ember':     '#1C1510',
        'noir-gold':      '#C9A96E',
        'noir-gray':      '#9A9088',
        'noir-parchment': '#EDE7DB',
        'noir-bronze':    '#8B5E3C',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        caps:      ['var(--font-caps)', 'Georgia', 'serif'],
        script:    ['var(--font-script)', 'cursive'],
        body:      ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
