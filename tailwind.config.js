/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f0ff', 100: '#d9d6ff', 200: '#b3adff', 300: '#8d84ff',
          400: '#776bff', 500: '#6c63ff', 600: '#5a52e0', 700: '#4842b3',
          800: '#363286', 900: '#242259',
        },
        cyan: {
          50: '#e0faff', 100: '#b3f0ff', 200: '#80e6ff', 300: '#4ddbff',
          400: '#26d1ff', 500: '#00c8ff', 600: '#00a0cc', 700: '#007899',
          800: '#005066', 900: '#003333',
        },
        success: {
          50: '#e0fff4', 100: '#b3ffe0', 200: '#80ffcc', 300: '#4dffb8',
          400: '#26ffa3', 500: '#00e5a0', 600: '#00b880', 700: '#008c60',
          800: '#006040', 900: '#003420',
        },
        warning: {
          50: '#fff5e0', 100: '#ffe6b3', 200: '#ffd780', 300: '#ffc84d',
          400: '#ffb926', 500: '#ffb74d', 600: '#e09f3e', 700: '#b37f30',
          800: '#866024', 900: '#594018',
        },
        danger: {
          50: '#ffe0e0', 100: '#ffb3b3', 200: '#ff8080', 300: '#ff4d4d',
          400: '#ff2626', 500: '#ff5252', 600: '#e04242', 700: '#b33333',
          800: '#862424', 900: '#591818',
        },
        dark: {
          50: '#0f1629', 100: '#141d35', 200: '#1a2540', 300: '#1e2d52',
          400: '#243566', 500: '#2a3d7a', 600: '#30468f', 700: '#374fa4',
          800: '#3e58ba', 900: '#0a0e1a',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '24px',
      },
      boxShadow: {
        'card':      '0 8px 32px rgba(0,0,0,0.4)',
        'card-light':'0 8px 32px rgba(0,0,0,0.08)',
        'glow':      '0 0 32px rgba(108,99,255,0.3)',
        'glow-sm':   '0 0 16px rgba(108,99,255,0.2)',
        'success-glow': '0 4px 24px rgba(0,229,160,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
