/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1917',
        paper: '#F7F2E7',
        gold: '#B8862B',
        rust: '#9C4A32',
        teal: '#1F4B45',
        navy: '#2B3A55'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Karla', 'sans-serif']
      }
    }
  },
  plugins: []
};
