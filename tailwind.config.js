/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cbp: {
          navy:    '#00416A',
          blue:    '#1460AA',
          success: '#008000',
          warning: '#F09511',
          danger:  '#A00000',
          tint:    '#ECF1F4',
        },
      },
    },
  },
  plugins: [],
}
