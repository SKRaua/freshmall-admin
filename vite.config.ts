import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // const env = loadEnv(mode, process.cwd(), '');
  return {
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
      port: Number(env.VITE_DEV_PORT || 8090),
      open: env.VITE_DEV_OPEN === 'true',
      cors: true,
      host: env.VITE_DEV_HOST || '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:9100',
          changeOrigin: true,
        },
      },
    },
  };
});
