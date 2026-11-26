import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
      },
      colors: {
        ghost: "#FEFFFA",
        coolgray: "#3A3F47",
        freezing: "#0E4D6B",
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        messi: {
          primary: "#0E4D6B", // Freezing Blue
          secondary: "#FEFFFA", // Ghost White
          accent: "#3A3F47", // Cool Gray
          neutral: "#3A3F47",
          "base-100": "#FEFFFA",
          info: "#0E4D6B",
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
      "light",
    ],
  },
};
