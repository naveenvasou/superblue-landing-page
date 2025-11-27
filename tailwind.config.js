/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin-slow 60s linear infinite',
        'subtle-pulse': 'subtle-pulse 8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

