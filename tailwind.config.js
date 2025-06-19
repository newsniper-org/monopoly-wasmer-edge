/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monopoly: {
          green: '#00A651',
          red: '#E53E3E',
          blue: '#3182CE',
          yellow: '#D69E2E',
          orange: '#DD6B20',
          purple: '#805AD5',
          brown: '#8B4513',
          lightblue: '#63B3ED'
        }
      },
      fontFamily: {
        monopoly: ['Arial Black', 'sans-serif']
      }
    },
  },
  plugins: [],
}
