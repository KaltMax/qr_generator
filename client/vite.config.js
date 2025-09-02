import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: '../client-build',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/generate-qr': 'http://localhost:3000'
    }
  }
})
