import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fff7ea",
        parchment: "#fef6e8",
        blush: "#f4c3ca",
        rose: "#c56f82",
        peach: "#edb49d",
        navy: "#11172d",
        midnight: "#0a0f1e",
        charcoal: "#292733",
        gold: "#cfa15f",
        "rose-gold": "#d99a8b",
        lavender: "#b8a9c9"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"]
      },
      boxShadow: {
        tarot: "0 24px 80px rgba(17, 23, 45, 0.24)",
        "tarot-hover": "0 32px 90px rgba(17, 23, 45, 0.32), 0 0 40px rgba(207, 161, 95, 0.12)",
        glow: "0 0 42px rgba(207, 161, 95, 0.28)",
        "glow-strong": "0 0 60px rgba(207, 161, 95, 0.42), 0 0 120px rgba(207, 161, 95, 0.15)",
        "card-float": "0 18px 56px rgba(17, 23, 45, 0.28), 0 4px 16px rgba(17, 23, 45, 0.12)",
        "inner-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.06)",
        "panel-soft": "0 12px 40px rgba(17, 23, 45, 0.08), 0 2px 8px rgba(17, 23, 45, 0.04)"
      },
      borderRadius: {
        tarot: "28px"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        "gentle-bob": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(-1deg)" },
          "66%": { transform: "translateY(-3px) rotate(0.5deg)" }
        },
        "sparkle-pulse": {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "drift-up": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.5)" },
          "20%": { opacity: "1" },
          "80%": { opacity: "0.6" },
          "100%": { opacity: "0", transform: "translateY(-60px) scale(0.2)" }
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(8px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(8px) rotate(-360deg)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "card-fan": {
          "0%, 100%": { transform: "var(--fan-rest)" },
          "40%": { transform: "var(--fan-spread)" },
          "60%": { transform: "var(--fan-spread)" }
        }
      },
      animation: {
        float: "float 4.5s ease-in-out infinite",
        "gentle-bob": "gentle-bob 5s ease-in-out infinite",
        "sparkle-pulse": "sparkle-pulse 2.2s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "drift-up": "drift-up 3s ease-out forwards",
        orbit: "orbit 8s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
