import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig({
  base: '/',
  publicDir: 'public',
  resolve: {
    alias: [
      {
        find: '/@',
        replacement: pathResolve('src') + '/',
      },
    ],
  },
  plugins: [vue()],
  server: {
    hmr: { overlay: false },
    port: 8080,
    open: false,
    cors: true,
    host: '0.0.0.0',
  },
});
