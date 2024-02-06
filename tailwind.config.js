/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '300px',
      },
      colors: {
        'chess-board': '#769656',
        'chess-tile-light': '#eeeed2',
        'icterine': '#F5FF71',
        'pear': '#BAD731',
      },
      height: {
        '100': '8vw',
      },
      width: {
        '100': '8vw',
      },
    },
  },
  plugins: [],
}

