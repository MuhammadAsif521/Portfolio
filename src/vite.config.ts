import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: 'node_modules/.vite',

  server: {
    port: 8100,
    strictPort: false,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 8101,
    },
  },

  build: {
    target: 'esnext',
    sourcemap: true,
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  optimizeDeps: {
    // ✅ Angular / Firebase don’t play nice with Vite optimizer → exclude them
    exclude: [
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/platform-browser/animations',
      '@angular/router',
      '@ionic/angular',
      '@angular/fire',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'swiper/element/bundle',
    ],
    // ✅ Keep only the ones Vite really needs to optimize
    include: ['rxjs', 'zone.js'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
