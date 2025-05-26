/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all component files
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi-Regular', 'sans-serif'],
        'sans-italic': ['Satoshi-Italic', 'sans-serif'],
        mono: ['SpaceMono', 'monospace'],
      },
    },
  },
  plugins: [],
}; 