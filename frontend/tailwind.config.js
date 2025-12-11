/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      background: {
        DEFAULT: "#000000",
        soft: "#111111",
        softer: "#1A1A1A",
      },
      text: {
        primary: "#ffffff",
        secondary: "#A1A1AA",
        muted: "#71717A",
      },
      border: {
        DEFAULT: "#262626",
        soft: "#2F2F2F",
      },
      accent: {
        DEFAULT: "#6366F1", // indigo-500
        hover: "#4F46E5",   // indigo-600
      },
    },
  }
}
,
  plugins: [],
};
