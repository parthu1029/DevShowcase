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
    DEFAULT: "#1a1a1a",
    soft: "#111113",
    softer: "#0c0c0d",
  },
  text: {
    primary: "#fafafa",
    secondary: "#b4b4b4",
    muted: "#808080",
  },
  border: {
    DEFAULT: "#2a2a2a",
    soft: "#333333",
  },
  accent: {
    DEFAULT: "#7f5af0",  // Linear purple
    hover: "#6d4ae8",
  },
},


  }
}
,
  plugins: [],
};
