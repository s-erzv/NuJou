/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Real sky blue — anchored on #8BBCED (the brand sky). Lighter and
        // airier than the previous scale; 400 is the exact brand color, with
        // darker shades kept legible on white for text and buttons.
        sky: {
          50: '#f4f9fe',
          100: '#e7f2fc',
          200: '#cfe6fa',
          300: '#aed3f2',
          400: '#8bbced',
          500: '#62a0e0',
          600: '#3b7dc4',
          700: '#33659f',
          800: '#2e5680',
          900: '#294863',
        },
        // Sienna — the "editor's pen" accent for marginalia, tips, and the
        // handwritten margin-note signature element. Used sparingly.
        sienna: {
          50: '#fbf1ea',
          100: '#f5dfce',
          200: '#e9be9c',
          300: '#d99966',
          400: '#c2793f',
          500: '#a35f2c',
          600: '#854b22',
          700: '#6b3b1b',
        },
        // Moss — a distinct "passed / completed" green, separate from the
        // ink-blue used for active/current states.
        moss: {
          50: '#f1f5ee',
          100: '#dee8d6',
          200: '#bed3ae',
          300: '#98b87f',
          400: '#749a5c',
          500: '#587b43',
          600: '#436233',
          700: '#354e28',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', '"Times New Roman"', 'serif'],
        // Fraunces — a characterful editorial serif reserved for the one or
        // two biggest hero moments (not used for body/section headings).
        display: ['Fraunces', 'Lora', 'Georgia', 'serif'],
        // Kalam — handwriting face for the margin-note signature element.
        hand: ['Kalam', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(59, 125, 196, 0.1), 0 1px 2px rgba(59, 125, 196, 0.07)',
        lift: '0 10px 30px -12px rgba(59, 125, 196, 0.4)',
      },
    },
  },
  plugins: [],
};
