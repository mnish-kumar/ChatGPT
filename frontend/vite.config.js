import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

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
          // UI libraries & animations
          if (id.includes("framer-motion") || id.includes("gsap")) {
            return "vendor-ui";
          }

          // Redux state management
          if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
            return "vendor-state";
          }

          // Socket.io
          if (id.includes("socket.io-client")) {
            return "vendor-socket";
          }

          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor-react";
          }
        },
      },
    },

    cssCodeSplit: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
  },

  server: {
    middlewareMode: false,
  },
});
