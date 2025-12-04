// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // <-- 1. Import the React plugin

export default defineConfig({
  plugins: [
    react(), // <-- 2. Use the React plugin
    tailwindcss(),
  ],
})