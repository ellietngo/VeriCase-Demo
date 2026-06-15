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
          green:   '#14532d',
          emerald: '#065f46',
          slate:   '#334155',
          warning: '#F09511',
          danger:  '#A00000',
          tint:    '#ECF1F4',
          'tint-green': '#dcfce7',
        },
      },
    },
  },
  plugins: [],
}
