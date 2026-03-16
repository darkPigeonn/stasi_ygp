import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
	'/api': {
      target: 'https://parokia.imavi.org/api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },
      '/uploads': {
        target: 'https://parokia.imavi.org',
        changeOrigin: true,
      }
    }
  }
})
