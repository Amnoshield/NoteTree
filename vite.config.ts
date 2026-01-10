import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, 'basic web app/source'),
  build: {
    outDir: path.resolve(__dirname, '../../dist'),
    emptyOutDir: true
  }
});
