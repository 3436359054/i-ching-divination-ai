import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true,
      },
    },
  },
  build: {
    // 配置构建输出目录
    outDir: 'dist',
    // 配置静态资源的基础路径
    assetsDir: '.',
    rollupOptions: {
      output: {
        // 确保所有静态资源文件直接输出到dist目录，而不是assets子目录
        assetFileNames: '[name]-[hash].[ext]',
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
      },
    },
  },
})
