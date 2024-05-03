/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8e0000",
        secondary: "#f5f5dc",
        highlightRed: "#aa0000",
        highlightGreen: "#009020",
      },
      fontSize: {
        'xxs': '0.65rem'  // Example size, you can adjust as needed
      }
    },
  },
  plugins: [],
};
