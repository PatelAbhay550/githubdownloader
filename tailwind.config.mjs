/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D28D9", // Purple
        accent: "#0D9488", // Teal
        background: "#0F172A", // Dark Gray
        card: "#1E293B", // Card Background
      },
    },
  },
  plugins: [],
};
