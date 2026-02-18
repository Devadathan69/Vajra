/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#bf00ff', // Vivid purple
        'deep-purple': '#2e004f', // Dark purple
        'neon-cyan': '#00f7ff',   // Electric blue/cyan
        'neon-blue': '#00aaff',   // Strong blue
        'black-bg': '#050505',    // Deepest black
        'card-bg': '#0f0f15',     // Slightly lighter for cards
        'surface': '#181820',     // Surface color
      },
      boxShadow: {
        'neon': '0 0 10px rgba(191, 0, 255, 0.5), 0 0 20px rgba(191, 0, 255, 0.3)',
        'neon-strong': '0 0 15px rgba(191, 0, 255, 0.8), 0 0 30px rgba(191, 0, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(191, 0, 255, 0.5)' },
          '50%': { opacity: .8, boxShadow: '0 0 20px rgba(191, 0, 255, 0.8)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
