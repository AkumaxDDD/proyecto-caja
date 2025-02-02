import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida para los archivos construidos
    assetsDir: 'assets', // Directorio para los archivos estáticos
  },
  base: './', // Asegura que las rutas sean relativas
});