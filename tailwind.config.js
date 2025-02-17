/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-gray': '#889aa4',
        'login-bg': '#283443'
      }
    },
  },
  plugins: [],
}

