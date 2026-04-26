import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Aptos", "Segoe UI", "Helvetica Neue", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.45)",
        glow: "0 0 120px color-mix(in srgb, var(--section-glow) 45%, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
