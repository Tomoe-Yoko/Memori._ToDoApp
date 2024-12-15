import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "001": "#E4C8CE",
        "002": "#C8D3E4",
        "003": "#C8E4C9",
        "004": "#E2E4C8",
        "005": "#D4C8E4",
        "006": "#E4ACB8",
        "007": "#98BDE0",
        "008": "#AEE6B1",
        "009": "#E6EC94",
        "010": "#BAAACF",
        "011": "#C6B3B2",
        "012": "#A6BBA7",
        "013": "#C4C796",
        "014": "#C3C3C3",
        "015": "#333333",
        text_button: "#787878",
        trash_bg: "#C86262",
      },
      fontFamily: {
        sans: ["Jost"],
        // sans: ["Jost", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        fadeout: {
          "0%": { opacity: " 1" },
          "95%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeout: "fadeout 1.8s both",
      },
      backgroundImage: {
        "tether-line": "url('/img/tether_line.svg')",
      },
      borderRadius: {
        "custom-rounded": "1rem 1rem 0 0", // 上だけ角丸
      },
    },
  },
  plugins: [],
};
export default config;
