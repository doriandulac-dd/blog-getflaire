import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Preserve the browser targets used by Vite 5 during the security upgrade.
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
