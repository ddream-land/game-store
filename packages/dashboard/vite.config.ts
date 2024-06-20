import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(function ({ mode, command }) {
  const envDir = path.resolve(process.cwd(), './env')
  // const env = loadEnv(mode, envDir, '')

  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envDir: envDir,
  }
})
