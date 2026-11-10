import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/_core": path.resolve(__dirname, "./src/_core"),
      "three": path.resolve(__dirname, "./node_modules/three/src/Three.js"),
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        ws: true,
      },
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      port: 5173,
    },
  },
  build: {
    outDir: "dist",
    // Production'da kaynak kod haritaları yayınlanmaz (kaynak kod sızıntısı); gerekirse VITE_SOURCEMAP=true
    sourcemap: process.env.VITE_SOURCEMAP === "true",
    rollupOptions: {
      external: ["@mediapipe/tasks-vision"], // MediaPipe derleme dışı bırakıldı
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["wouter"],
          "query-vendor": ["@tanstack/react-query"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-slot",
            "@radix-ui/react-checkbox",
          ],
          "motion-vendor": ["framer-motion", "swiper"],
          "three-vendor": ["three"],
          "r3f-vendor": ["@react-three/fiber"],
          "drei-vendor": ["@react-three/drei"],
          "postprocessing-vendor": ["@react-three/postprocessing"],
          "form-vendor": ["zod"],
          "utils-vendor": ["date-fns", "clsx", "class-variance-authority", "tailwind-merge"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
