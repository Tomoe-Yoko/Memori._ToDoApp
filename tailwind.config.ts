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
      },
      fontFamily: {
        Jost: ["var(--JostFont)"],
      },
    },
  },
  plugins: [],
};
export default config;
