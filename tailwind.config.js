const colors = require('tailwindcss/colors')

module.exports = {
  corePlugins: {
    preflight: false,
  },
  prefix: 'tw-',
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'teal': colors.teal
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
