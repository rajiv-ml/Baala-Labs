import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "fill-1": "var(--fill-1)",
        "fill-2": "var(--fill-2)",
        "fill-3": "var(--fill-3)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        devanagari: ["var(--font-devanagari)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
