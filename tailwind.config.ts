import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          gold: "#C8A84B",
          "gold-dim": "#8F7A3A",
          cream: "#F4EFE3",
          gray: "#1C1C1C",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        label: ["Barlow Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
