/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const colors = require('tailwindcss/colors');
const aspectRatio = require('@tailwindcss/aspect-ratio');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      tablet: '768px',
      desktop: '1280px',
    },
    colors,
    fontFamily: {
      sans: [
        'Lato',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
    },
    extend: {
      maxWidth: {
        200: '50rem',
        270: '67.5rem',
      },
      maxHeight: {
        200: '50rem',
      },
    },
  },
  variants: {},
  plugins: [aspectRatio],
};
