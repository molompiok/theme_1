import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const config: UserConfig = {
  plugins: [react(), vike(), tailwindcss()],
}

export default config
