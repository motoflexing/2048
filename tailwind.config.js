/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#101114',
        surface: '#191B20',
        'surface-secondary': '#22252B',
        accent: '#EF4444',
        'text-main': '#F5F5F5',
        'text-muted': '#9296A0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}