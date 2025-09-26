import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          build: {
            rollupOptions: {
              external: ["better-sqlite3"],
            },
          },
        },
        onstart({ startup }) {
          startup();
        },
      },
      preload: { input: { preload: "electron/preload.ts" } },
    }),
  ],
  server: {
    port: 0, // pick any free port so multiple dev instances can coexist
    strictPort: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@sdk": path.resolve(__dirname, "../../packages/plugin-sdk/src"),
    },
  },
  root: ".", // keep default
});
