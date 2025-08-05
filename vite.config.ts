import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'

// Check if HTTPS certificates exist (required for Kontent.ai custom apps)
const httpsConfig = existsSync('./localhost.pem') && existsSync('./localhost-key.pem') 
  ? {
      key: './localhost-key.pem',
      cert: './localhost.pem'
    }
  : false

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    https: httpsConfig,
    headers: {
      'X-Frame-Options': 'ALLOW-FROM https://app.kontent.ai',
      'Content-Security-Policy': "frame-ancestors 'self' https://app.kontent.ai https://*.kontent.ai",
    },
  },
  preview: {
    port: 3000,
    headers: {
      'X-Frame-Options': 'ALLOW-FROM https://app.kontent.ai',
      'Content-Security-Policy': "frame-ancestors 'self' https://app.kontent.ai https://*.kontent.ai",
    },
  },
})