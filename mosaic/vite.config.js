import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_STORAGE_API_URL, // Backend API URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
