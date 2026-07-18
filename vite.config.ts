import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The 50 course-content JSON files are the largest single weight.
          // Split them into their own chunk so the initial paint (landing,
          // hero) doesn't have to parse all of it inline, and so it caches
          // independently of app code.
          if (id.includes('/src/data/level')) return 'course-data';
          // Split large vendors so they cache separately from app code.
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
