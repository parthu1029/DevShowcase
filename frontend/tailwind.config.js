/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables .dark HTML toggle

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          soft: "var(--background-soft)",
          softer: "var(--background-softer)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          soft: "var(--border-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
      },

      boxShadow: {
        card: "0 4px 12px var(--shadow-color)",
        smooth: "0 6px 20px var(--shadow-color)",
        deep: "0 12px 32px var(--shadow-color)",
        soft: "0 2px 10px var(--tw-shadow-color)",
        md: "0 4px 20px var(--tw-shadow-color)",
        lg: "0 10px 40px var(--tw-shadow-color)",
      },
    },
  },

  plugins: [],
};
