import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Bind to all interfaces (required for Tailscale access)
    port: 5173,
    strictPort: true,  // Fail if port is already in use (don't silently pick another)
  }
})

