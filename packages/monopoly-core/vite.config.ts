import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';


export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MonopolyCore',
      fileName: 'monopoly-core'
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['uuid', 'zod'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          uuid: 'uuid',
          zod: 'zod'
        }
      }
    },
    sourcemap: true,
    // Ensure ESM output
    target: 'esnext'
  },
  plugins: [
		nodePolyfills({
    	// 필요한 shim 설정
      globals: {
      	process: true,
    	},
	  }),
    dts({
      // Generate declaration files
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
