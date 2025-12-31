/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F97316",
        dark: "#1E293B",
        light: "#F8FAFC",
      },
      fontFamily: {
        sans: ['Mulish', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px', // 4K displays
        '6xl': '5120px', // 5K displays (5120x2880)
      },
      spacing: {
        // Universal spacing that scales with screen size
        'screen-padding': 'clamp(1rem, 2vw, 4rem)',
        'section-padding': 'clamp(2rem, 4vw, 6rem)',
      },
      maxWidth: {
        // Universal max-widths for consistent layout
        'container-sm': '1280px',
        'container-md': '1440px',
        'container-lg': '1600px',
        'container-xl': '1920px',
        'container-2xl': '2560px',
        'container-3xl': '3200px', // For 5K screens
      },
    },
  },
  plugins: [],
}
