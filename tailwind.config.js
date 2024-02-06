/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '0px',
      },
      colors: {
        'chess-board': '#769656',
        'chess-tile-light': '#eeeed2',
        'icterine': '#F5FF71',
        'pear': '#BAD731',
      },
      height: {
        'mobile': '8vw',
        'desktop': '8vh',
        'desktop-sm': '7vh',
        'desktop-xs': '6vh',
      },
      width: {
        'mobile': '8vw',
        'desktop': '8vh',
        'desktop-sm': '7vh',
        'desktop-xs': '6vh',
      },
    },
  },
  plugins: [],
}

