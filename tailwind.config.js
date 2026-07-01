/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'rotate(-8deg)' },
          '20%, 40%, 60%, 80%': { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        shake: 'shake 0.6s ease-in-out infinite',
      },
      colors: {
        'steam-bg': '#1b2838',
        'steam-bg-hover': '#2a3f5a',
        'steam-panel': '#16202d',
        'steam-card': '#1e2d3f',
        'steam-nav': '#171a21',
        'steam-border': '#2a475e',
        'steam-text': '#c6d4df',
        'steam-text-dim': '#8f98a0',
        'steam-accent': '#66c0f4',
        'steam-green': '#a4d007',
        'steam-green-btn': '#5c7e10',
        'steam-green-btn-hover': '#6c9018',
        'steam-blue-btn': '#1a5099',
        'steam-blue-btn-hover': '#1e5fba',
        'steam-positive': '#6dc849',
        'steam-negative': '#d9414e',
        'steam-mixed': '#c29843',
      },
      fontFamily: {
        steam: ['Inter', '"Motiva Sans"', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
