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
        'mh-table-mobile': 'calc(8vw * 8)',
        'mh-table-desktop': 'calc(8vh * 8)',
        'mh-table-desktop-sm': 'calc(7vh * 8)',
        'mh-table-desktop-xs': 'calc(6vh * 8)',
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

