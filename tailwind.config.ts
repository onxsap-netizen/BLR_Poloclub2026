import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0A0B",
          elevated: "#141416",
          panel: "#1C1C1F",
          border: "#2A2A2E",
        },
        accent: {
          DEFAULT: "#E30613",
          dim: "#A30410",
          glow: "#FF1A2B",
        },
        silver: {
          DEFAULT: "#8B8D91",
          light: "#C4C6C9",
        },
        off: "#F5F5F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        carbon:
          "repeating-linear-gradient(45deg, #161618 0px, #161618 2px, #101011 2px, #101011 4px), repeating-linear-gradient(-45deg, #161618 0px, #161618 2px, #101011 2px, #101011 4px)",
        "red-glow":
          "radial-gradient(circle at 50% 0%, rgba(227,6,19,0.15), transparent 60%)",
      },
      keyframes: {
        "chevron-slide": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "56px 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "chevron-slide": "chevron-slide 1.2s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
