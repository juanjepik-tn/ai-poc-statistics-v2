import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_CLIENT_ID': JSON.stringify(process.env.VITE_CLIENT_ID),
    'process.env.VITE_LOGIN_WITH_NEXO': JSON.stringify('false'),
    'process.env.VITE_REACT_APP_AMPLITUDE_API_KEY': JSON.stringify(process.env.VITE_REACT_APP_AMPLITUDE_API_KEY),
    'process.env.VITE_API_URL_WS': JSON.stringify(process.env.VITE_API_URL_WS),
    'process.env.VITE_MAINTENANCE_MODE': JSON.stringify('false'),
    'process.env.VITE_MIN_DISPLAYED_MESSAGES': JSON.stringify(process.env.VITE_MIN_DISPLAYED_MESSAGES),
    'process.env.VITE_AMPLITUDE_ENABLE': JSON.stringify('false'),
    'process.env.VITE_FACEBOOK_APP_ID': JSON.stringify(process.env.VITE_FACEBOOK_APP_ID),
    'process.env.VITE_FACEBOOK_APP_VERSION': JSON.stringify(process.env.VITE_FACEBOOK_APP_VERSION),
    'process.env.VITE_FACEBOOK_CONFIG_ID': JSON.stringify(process.env.VITE_FACEBOOK_CONFIG_ID),
    'process.env.VITE_FACEBOOK_SKIP_HTTPS_CHECK': JSON.stringify(process.env.VITE_FACEBOOK_SKIP_HTTPS_CHECK),
  },
  optimizeDeps: {
    include: [
      '@nimbus-ds/patterns',
      '@nimbus-ds/components',
      '@nimbus-ds/styles',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  plugins: [
    svgr(),
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  esbuild: {
    logOverride: { 'ts(6133)': 'silent' },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Redirect @tiendanube/nexo imports to our mock module
      '@tiendanube/nexo': path.resolve(__dirname, 'src/app/NexoClient/NexoClient.ts'),
    },
  },
});
