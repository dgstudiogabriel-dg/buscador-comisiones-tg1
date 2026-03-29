import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cian: { 400: '#00ffff', 700: '#008b8b' },
        magenta: { 400: '#ff00ff', 700: '#c200c2' },
      },
    },
  },
  plugins: [],
}
export default config
