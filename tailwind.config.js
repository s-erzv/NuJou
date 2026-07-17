/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fountain-pen ink blue — the primary accent (kept under the `sky`
        // key so every existing sky-* utility across the app repaints here).
        sky: {
          50: '#f1f1f9',
          100: '#e1e2f1',
          200: '#c4c5e3',
          300: '#9ea0ce',
          400: '#7679b7',
          500: '#52559d',
          600: '#3e4183',
          700: '#30326a',
          800: '#242551',
          900: '#191a3a',
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
