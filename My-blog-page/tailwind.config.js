/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // manual toggle matches your App.jsx
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 🎨 Color System — from App.css
      colors: {
        primary: {
          bg: "#f4f7f9",
          text: "#2d3748",
        },
        secondary: {
          bg: "#ffffff",
          text: "#718096",
        },
        accent: {
          DEFAULT: "#4a90e2",
          dark: "#3a7ac8",
        },
        success: "#48bb78",
        danger: "#e53e3e",
        border: "#e2e8f0",
        shadow: "rgba(45, 55, 72, 0.1)",

        // 🌙 Dark Mode Palette
        dark: {
          bg: "#1a202c",
          surface: "#2d3748",
          text: "#e2e8f0",
          muted: "#a0aec0",
          border: "#4a5568",
          accent: "#63b3ed",
          accentDark: "#4299e1",
        },
      },

      // 🖋 Font Family
      fontFamily: {
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },

      // 💡 Box Shadows
      boxShadow: {
        soft: "0 0 8px rgba(0, 0, 0, 0.08)",
        card: "0 8px 20px rgba(0, 0, 0, 0.08)",
        strong: "0 15px 40px rgba(0, 0, 0, 0.2)",
      },

      // 🎞 Animations
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        scaleUp: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        scaleUp: "scaleUp 0.4s ease-out",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
