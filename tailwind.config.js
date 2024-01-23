/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chess-board': '#769656',
        'chess-tile': '#eeeed2',
      },
    },
  },
  plugins: [],
}
