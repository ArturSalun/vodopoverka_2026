import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/' , 
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true
}
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['@emailjs/browser', 'date-fns', 'lucide-react', 'react-datepicker', 'react-helmet-async']
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    dedupe: ['@supabase/supabase-js', 'react', 'react-dom']
  },
  optimizeDeps: {
    include: ['@emailjs/browser', 'date-fns', 'lucide-react', 'react-datepicker', 'react-helmet-async']
  }
});