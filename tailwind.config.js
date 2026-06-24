/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores neutras do app baseadas no tema claro
        brand: {
          bg: "#F4F9F4",       
          success: "#2B8A3E",  
          text: "#1C1F1C",
        },
        // Variáveis dinâmicas injetadas via runtime por trilha
        theme: {
          primary: "var(--theme-primary)",
          accent: "var(--theme-accent)",
          glow: "var(--theme-glow)",
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}