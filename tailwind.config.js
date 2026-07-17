/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sky blue — the primary accent across the whole app.
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
        card: '0 1px 3px rgba(62, 65, 131, 0.08), 0 1px 2px rgba(62, 65, 131, 0.06)',
        lift: '0 10px 30px -12px rgba(62, 65, 131, 0.35)',
      },
    },
  },
  plugins: [],
};
