/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: {
          brand: {
            primary: "#004080",
            primaryHover: "#134B83",
            secondary: "#265889",
            tertiary: "#52789E",
            quaternary: "#388A80",
          },
          default: {
            primary: "#FFF",
            secondary: "#D9D9D9",
            neutral: "#1E1E1E",
          },
        },
        text: {
          brand: {
            primary: "#004080",
            secondary: "#265889",
            tertiary: "#52789E",
            quaternary: "#388A80",
          },
          default: {
            primary: "#1E1E1E",
            secondary: "#757575",
            tertiary: "#B3B3B3",
            neutral: "#fff",
          },
        },
      },
    },
  },
  plugins: [],
};
