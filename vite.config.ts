import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    base: mode === 'development' ? '/' : '/unicode-finder/', // Your repository name
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
