/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB23F',
        secondary: '#101722',
        tertiary: '#5F6C7C',
        background: '#F4F6F8',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '12': '3rem',
        '14': '3.5rem',
      },
    },
  },
  plugins: [],
};
