import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const isAnalyze = process.env.ANALYZE === 'true'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    vike(),
    tailwindcss(),
    ...(isAnalyze
      ? [
          visualizer({
            filename: 'dist/bundle-analysis.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  server: {
    host: '0.0.0.0', // Important si Vite tourne depuis WSL !
    port: 3000,
    hmr: {
      port: 24700,
    },
    allowedHosts: true, // ✅ autorise toutes les origines (hôtes)
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'react-query'
            }
            if (id.includes('node_modules/react-icons')) {
              return 'react-icons'
            }
            if (id.includes('node_modules/swiper')) {
              return 'swiper'
            }
            if (id.includes('node_modules/leaflet')) {
              return 'leaflet'
            }
            if (id.includes('node_modules/marked')) {
              return 'marked'
            }
            if (id.includes('node_modules/vike') || id.includes('node_modules/vike-react')) {
              return 'vike'
            }
            if (id.includes('node_modules/axios')) {
              return 'axios'
            }
            if (id.includes('node_modules/zustand')) {
              return 'zustand'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
