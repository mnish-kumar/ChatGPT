import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {

          // Icons
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }

          // UI libraries & animations
          if (
            id.includes("framer-motion") ||
            id.includes("gsap")
          ) {
            return "vendor-ui";
          }

          // Redux state management
          if (
            id.includes("@reduxjs/toolkit") ||
            id.includes("react-redux")
          ) {
            return "vendor-state";
          }

          // Socket.io
          if (id.includes("socket.io-client")) {
            return "vendor-socket";
          }
        },
      },
    },

    // Split CSS into separate files
    cssCodeSplit: true,

    // Faster production minification
    minify: "esbuild",

    // Chunk warning limit
    chunkSizeWarningLimit: 500,
  },

  server: {
    middlewareMode: false,
  },
});