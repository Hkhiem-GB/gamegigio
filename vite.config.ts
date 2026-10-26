import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('hls.js')) return 'hls';
          if (id.includes('gameMedia.json')) return 'steam-media';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
