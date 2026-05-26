import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#E8192C',
          dark: '#C01020',
        },
        navy: {
          DEFAULT: '#0D1B2A',
          mid: '#162234',
          light: '#1E2F44',
        },
        offwhite: '#F5F4F0',
      },
      fontFamily: {
        headline: ['var(--font-finlandica-headline)', 'sans-serif'],
        body: ['var(--font-finlandica-text)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-finlandica-text)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
