import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, 'apps/web'),
  base: '/NoteTree/',
  build: {
    //outDir: path.resolve(__dirname, '../dist'),
    outDir: 'dist',
    emptyOutDir: true
  }
});
