import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Tycia-Generator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        animation: resolve(__dirname, 'text-animation.html'),
        mask: resolve(__dirname, 'text-mask.html')
      }
    }
  }
})
