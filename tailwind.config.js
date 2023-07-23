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
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      screens: {
        mobile: '320px',
      },
    },
  },
  plugins: [],
};
