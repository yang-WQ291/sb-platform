/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "warm-cream": "#fef7ed",
        "zone-amber": { light: "#fef3c7", DEFAULT: "#f59e0b", border: "#fde68a", dark: "#92400e" },
        "zone-indigo": { light: "#e0e7ff", DEFAULT: "#6366f1", border: "#c7d2fe", dark: "#3730a3" },
        "zone-emerald": { light: "#d1fae5", DEFAULT: "#10b981", border: "#a7f3d0", dark: "#065f46" },
      },
    },
  },
  plugins: [],
};
