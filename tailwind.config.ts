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
        Theme01: "#E4C8CE",
        Theme02: "#C8D3E4",
        Theme03: "#C8E4C9",
        Theme04: "#E2E4C8",
        Theme05: "#D4C8E4",
        Theme06: "#E4ACB8",
        Theme07: "#98BDE0",
        Theme08: "#AEE6B1",
        Theme09: "#E6EC94",
        Theme10: "#BAAACF",
        Theme11: "#C6B3B2",
        Theme12: "#A6BBA7",
        Theme13: "#C4C796",
        Theme14: "#C3C3C3",
        Theme15: "#333333",
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
    safelist: [
      {
        pattern: /bg-Theme\d{2}/, // bg-ThemeXX の動的クラスを許可
      },
    ],
  },
  plugins: [],
};
export default config;
