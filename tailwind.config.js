import { mauve, violet, red, blackA } from '@radix-ui/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        leaf: '#324320',
        dew: '#A49F67',
        neutral: '#E3D6C5',
        mustard: '#CD8C0B',
        clay: '#8B4D14',

        ['gray-400']: '#A3AED0',
        ['gray-500']: '#707EAE',

        ['green-300']: '#779F4C',
        ['green-500']: '#41572A',
        ['green-600']: '#324320',
        ['green-700']: '#243117',
        ['green-800']: '#1B2512',

        ...mauve,
        ...violet,
        ...red,
        ...blackA,
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      screens: {
        xs: '320px',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  important: true,
};
