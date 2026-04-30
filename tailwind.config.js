/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB23F',
        secondary: '#1B263B',
        tertiary: '#778DA9',
        background: '#F7F8FA',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '12': '3rem',
        '14': '3.5rem',
      },
    },
  },
  plugins: [],
};
