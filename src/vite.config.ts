import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
cacheDir: 'node_modules/.vite-cache',
  server: {
    port: 8100, // default port
    strictPort: false, // if port is taken, find another
    open: true, // auto open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // helpful for debugging
    emptyOutDir: true, // clears dist before build
  },
  resolve: {
    alias: {
      '@': '/src', // allows imports like "@/components/..."
    },
  },
})
