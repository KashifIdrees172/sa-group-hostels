/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#152A52',
          soft: '#1c3566',
        },
        amber: {
          DEFAULT: '#F0A83C',
          soft: '#f4bc63',
          dark: '#C67A12',
        },
        cream: '#FDFDFC',
        charcoal: '#232323',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
