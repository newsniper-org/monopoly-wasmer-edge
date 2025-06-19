import { defineConfig } from 'vite';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: 'server'
    },
    rollupOptions: {
      external: [
        'express',
        'cors',
        'uuid',
        // Add other external dependencies that shouldn't be bundled
      ],
      output: {
        // Preserve the module structure
        preserveModules: true,
        preserveModulesRoot: '.'
      }
    },
    // Ensure ESM output
    ssr: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  },
  plugins: [
    // Add polyfills for Node.js built-ins
    nodePolyfills()
  ]
});
