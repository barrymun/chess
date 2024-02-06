/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chess-board': '#769656',
        'chess-tile-light': '#eeeed2',
        'icterine': '#F5FF71',
        'pear': '#BAD731',
      },
      height: {
        '100': '100px',
        '800': '800px',
      },
      width: {
        '100': '100px',
      },
      minWidth: {
        '800': '800px',
      },
    },
  },
  plugins: [],
}

