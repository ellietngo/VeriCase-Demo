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
          navy:        '#00416A',
          blue:        '#1460AA',
          green:       '#1a5c30',
          success:     '#008000',
          warning:     '#F09511',
          danger:      '#A00000',
          tint:        '#ECF1F4',
          'tint-green':'#e6f0e8',
        },
      },
    },
  },
  plugins: [],
}
