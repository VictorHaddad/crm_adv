import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // No GitHub Pages o app é servido em /<repo>/ — o workflow de deploy
  // define BASE_PATH; localmente fica na raiz.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // O three.js (cenas 3D) é isolado num chunk próprio e carregado sob
    // demanda (lazy) apenas no Login e no Dashboard — por isso elevamos o
    // limite do aviso: o tamanho é intencional e não afeta o carregamento inicial.
    chunkSizeWarningLimit: 900,
  },
})
