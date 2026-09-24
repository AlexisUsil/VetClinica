import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'node:path'

// `npm run build` produce dist/index.html autocontenido (JS, CSS, fuentes y datos inline)
// para abrirlo con doble click. `npm run build:multi` genera el build normal por chunks.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'multi' ? [] : [viteSingleFile({ removeViteModuleLoader: true })])],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: {
    outDir: mode === 'multi' ? 'dist-multi' : 'dist',
    chunkSizeWarningLimit: 8000,
    assetsInlineLimit: 100_000_000,
  },
}))
