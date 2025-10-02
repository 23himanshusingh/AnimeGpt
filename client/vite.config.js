import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { BACKEND_URL } from './src/utils/constants'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': BACKEND_URL,
    },
  },
})
