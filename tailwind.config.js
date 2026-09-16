/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        'arabic-display': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        'arabic-body': ['Noto Sans Arabic', 'Cairo', 'sans-serif'],
      },
      fontSize: {
        'arabic-sm': ['14px', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'arabic-base': ['16px', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'arabic-lg': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'arabic-xl': ['20px', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
        'arabic-2xl': ['24px', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        'arabic-3xl': ['30px', { lineHeight: '1.4', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
};
