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
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        messi: {
          primary: "#5BC0EB", // Argentina sky blue
          secondary: "#FFFFFF",
          accent: "#FFD700", // gold accent
          neutral: "#1B1F23",
          "base-100": "#FFFFFF",
          info: "#93C5FD",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      "light",
    ],
  },
};
