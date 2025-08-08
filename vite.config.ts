import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isGitHubPages = process.env.GITHUB_ACTIONS || process.env.DEPLOY_TARGET === 'github';
  
  return {
    plugins: [react()],
    base: isProduction && isGitHubPages ? '/Student-Management-System/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react']
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
