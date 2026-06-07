import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        gold:  "#D4A017",
        teal:  "#0F9D8D",
        danger: "#E05252",
      },
      animation: {
        "float-a":   "floatA 6s ease-in-out infinite",
        "float-b":   "floatB 7s ease-in-out 1s infinite",
        "float-c":   "floatC 5s ease-in-out 2s infinite",
        "shimmer":   "shimmer 4s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        floatA: {
          "0%, 100%": { transform: "translateY(0px) rotate(-0.5deg)" },
          "50%":      { transform: "translateY(-14px) rotate(0.5deg)" },
        },
        floatB: {
          "0%, 100%": { transform: "translateY(0px) rotate(0.5deg)" },
          "50%":      { transform: "translateY(-10px) rotate(-0.5deg)" },
        },
        floatC: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
