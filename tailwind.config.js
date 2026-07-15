/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sky Blue academic palette
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(2, 132, 199, 0.08), 0 1px 2px rgba(2, 132, 199, 0.06)',
        lift: '0 10px 30px -12px rgba(2, 132, 199, 0.35)',
      },
    },
  },
  plugins: [],
};
