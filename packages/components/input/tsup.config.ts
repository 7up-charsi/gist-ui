import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  target: 'es2022',
  format: ['cjs', 'esm'],
});
