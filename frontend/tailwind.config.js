/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "pages/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        headerColor: "#0D0D0D",
        backgroundColor: "#1A1A1A",
        customBlue: "#4EA8DE",
        customPurple: "#5E60CE",
        customBtn: "#1E6F9F",
        customBadge: "#333333",
        customBadgeText: "#D9D9D9",
        noTaskText: "#808080",
      },
      spacing: {
        "16px": "16px",
        "48px": "48px",
      },
      fontWeight: {
        middle: "400",
        bold: "700",
        extraHeavy: "900",
      },
    },
  },
  plugins: [],
};


