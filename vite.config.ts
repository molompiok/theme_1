import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const config: UserConfig = {
  plugins: [react(), vike(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Important si Vite tourne depuis WSL !
    port: 3000,
    hmr: {
      port: 24700,
    },
    allowedHosts: true, // ✅ autorise toutes les origines (hôtes)
  }
}

export default config
