/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      colors: {
        ios: {
          blue: '#007AFF',
          pink: '#FF2D55',
          green: '#34C759',
          bg: '#000000',
          card: '#1C1C1E',
          glass: 'rgba(30,30,30,0.75)',
          separator: 'rgba(84,84,88,0.65)'
        }
      }
    },
  },
  plugins: [],
}
