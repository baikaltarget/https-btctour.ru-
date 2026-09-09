import type { Config } from "tailwindcss";

/*
  ДИЗАЙН-ТОКЕНЫ — палитра взята из зимнего Байкала (фото на главной):
  глубокая бирюза льда, снежно-белый, тёплое золото рассвета на горизонте.
  Правится здесь и в app/globals.css, контент не трогается.
*/
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.md"],
  theme: {
    extend: {
      colors: {
        ice: {
          50: "#F3F8FA",   // снег
          100: "#E3EEF2",  // тонированная секция
          200: "#C5DCE3",
          400: "#4C93A5",
          600: "#1F6C7D",  // основной (кнопки, ссылки)
          800: "#0F3A4A",  // глубокий лёд (шапка, тёмные секции)
          900: "#0A2733",
        },
        dawn: { 400: "#E9B86C", 500: "#D9A24E", 600: "#B9822F" }, // тёплый акцент
        ink: "#16232A",
      },
      fontFamily: {
        sans: ["'Manrope Variable'", "system-ui", "sans-serif"],
        display: ["'Montserrat Variable'", "system-ui", "sans-serif"],
      },
      maxWidth: { wrap: "1200px", prose: "68ch" },
      borderRadius: { xs: "4px" },
    },
  },
  plugins: [],
};
export default config;
