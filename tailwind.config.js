/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#10090B",
          sub: "#190B0F",
          card: "#211014",
          cardHover: "#2C141B",
          border: "#3B2027",
          borderHover: "#5C2833",
          subtle: "rgba(229, 46, 69, 0.05)"
        },
        brand: {
          red: "#E61C39",
          white: "#F5F1EC",
          burgundy: "#9C1328",
          redBright: "#FF4359",
          redDark: "#9C1328",
          redGlow: "rgba(230, 28, 57, 0.35)",
          redSubtle: "rgba(230, 28, 57, 0.12)"
        },
        text: {
          primary: "#F5F3F4",
          secondary: "#A8A0A3",
          muted: "#756D70"
        },
        tier: {
          gray: {
            DEFAULT: "#71717A",
            border: "#52525B",
            bg: "rgba(113, 113, 122, 0.15)",
            glow: "rgba(113, 113, 122, 0.3)"
          },
          purple: {
            DEFAULT: "#A855F7",
            border: "#9333EA",
            bg: "rgba(168, 85, 247, 0.15)",
            glow: "rgba(168, 85, 247, 0.35)"
          },
          gold: {
            DEFAULT: "#F59E0B",
            border: "#D97706",
            bg: "rgba(245, 158, 11, 0.15)",
            glow: "rgba(245, 158, 11, 0.35)"
          },
          red: {
            DEFAULT: "#E52E45",
            border: "#FF4359",
            bg: "rgba(229, 46, 69, 0.18)",
            glow: "rgba(229, 46, 69, 0.5)"
          }
        }
      },
      fontFamily: {
        brand: [
          '"Montserrat"',
          '"Chakra Petch"',
          'Inter',
          'sans-serif'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        'card': '0 8px 30px rgba(0, 0, 0, 0.7)',
        'red-glow': '0 0 25px rgba(229, 46, 69, 0.35)',
        'red-glow-lg': '0 0 45px rgba(229, 46, 69, 0.55)',
        'pointer': '0 0 16px rgba(255, 67, 89, 0.9), 0 0 32px rgba(229, 46, 69, 0.5)'
      }
    },
  },
  plugins: [],
}
