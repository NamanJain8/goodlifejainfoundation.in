import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
          tiptap: [
            '@tiptap/react', 
            '@tiptap/starter-kit',
            '@tiptap/extension-color',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-underline'
          ],
          icons: ['lucide-react', 'react-icons'],
          utils: ['html2canvas', 'jspdf', 'jszip'],
          ui: ['lity', 'react-simple-keyboard'],
        },
      },
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    host: true,
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  // Define environment variables
  define: {
    'process.env': {},
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js',
  },
  
  // Optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  
  // Public directory
  publicDir: 'public',
})
