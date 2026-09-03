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
            maxWidth: 'none',
            color: '#374151',
            p: {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            'ul, ol': {
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            h1: { color: '#0D1B2A', fontWeight: '900' },
            h2: { color: '#0D1B2A', fontWeight: '700' },
            h3: { color: '#0D1B2A', fontWeight: '700' },
            blockquote: {
              borderLeftColor: '#E8192C',
              color: '#6B7280',
            },
            a: {
              color: '#E8192C',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
