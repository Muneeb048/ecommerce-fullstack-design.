/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0D6EFD',
        'primary-dark': '#0067FF',
        'primary-light': '#127FFF',
        'primary-bg': '#8CB7F5',
        dark: '#1C1C1C',
        'gray-500-custom': '#8B96A5',
        'gray-200-custom': '#DEE2E7',
        'gray-100-custom': '#EFF2F4',
        'gray-bg': '#F7FAFC',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'container': '1440px',
      },
    },
  },
  plugins: [],
}
