/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      
      colors: {
        primary: {
          light: '#3490dc', // color para tema claro
          dark: '#1e3a8a', // color para tema oscuro
        },
        secondary: {
          light: '#ffed4a',
          dark: '#f59e0b',
        },
        background: {
          light: '#f9fafb',
          dark: '#1b1a1d',
        },
        panel_bg: {
          light: '#ffffff',
          dark: '#222124',
        },
        subpanel_bg:{
          light: '#f9fafb',
          dark: '#2c2b2f',
        },
        text: {
          light: '#333333',
          dark: '#ffffff',
        },
        sub_text:{
          light: '#a0a2a9',
          dark: '#a0a2a9',
        },
        border: {
          light: '#d1d5db',
          dark: '#555764',
        },
        slate: {
            800: '#1b1a1d', // Cambia '#your-new-color-code' por el color que prefieras
            600: '#545663'
          },
      },
    },
  },
  darkMode: 'class', // Activar modo oscuro basado en clase
  plugins: [],
}

