import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/public',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html')
      }
    }
  }
})
