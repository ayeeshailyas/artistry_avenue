/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6F1",
        "paper-dim": "#F3EAE2",
        blush: "#F3E3DD",
        wine: {
          DEFAULT: "#5C1420",
          dark: "#430E17",
          light: "#7A2230",
        },
        plum: "#2B1B1D",
        gold: {
          DEFAULT: "#B08A4E",
          light: "#D8BD8B",
        },
        hairline: "#E4D6CC",
        stone: "#8A7B72",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Outfit'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      borderRadius: {
        soft: "4px",
        pill: "9999px",
      },
      boxShadow: {
        whisper: "0 10px 40px rgba(43, 27, 29, 0.06)",
        lift: "0 18px 50px rgba(43, 27, 29, 0.12)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        container: "1400px",
      },
    },
  },
  plugins: [],
};
