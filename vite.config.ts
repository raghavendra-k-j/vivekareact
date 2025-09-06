import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    base: env.VITE_BASE,
    resolve: {
      alias: { '~': path.resolve(__dirname, './src') },
    },
    server: {
      host: true,
      allowedHosts: ['test.rklocal.com', 'rklocal.com', 'localhost'],
    },
    build: {
      outDir: path.resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
    },
  }
})
