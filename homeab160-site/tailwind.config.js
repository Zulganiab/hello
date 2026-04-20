/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: '#00fff0',
        glass: 'rgba(255,255,255,0.06)'
      },
      boxShadow: {
        'neon-md': '0 8px 30px rgba(0,255,240,0.08)'
      }
    },
  },
  plugins: [],
}
