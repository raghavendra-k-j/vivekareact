import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    visualizer({ open: true }),
  ],
  base: "/web",
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['test.rklocal.com', 'rklocal.com', 'localhost'],
    port: 5173,
  },
})