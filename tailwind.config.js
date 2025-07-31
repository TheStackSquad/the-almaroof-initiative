const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable manual toggle
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4b9ce2",
          DEFAULT: "#1a73e8",
          dark: "#174ea6",
        },
        secondary: "#f5f5f5",
        accent: "#facc15", // yellow-400
        dark: "#111827", // slate-900
        light: "#f9fafb", // gray-50
      },
      fontFamily: {
        display: [
          "var(--font-cinzel-decorative)",
          ...defaultTheme.fontFamily.serif,
        ],
        // 'cinzel' for Cinzel (formal, classic text)
        cinzel: ["var(--font-cinzel)", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
