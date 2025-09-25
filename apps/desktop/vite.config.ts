import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: { entry: "electron/main.ts" },
      preload: { input: { preload: "electron/preload.ts" } }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@sdk": path.resolve(__dirname, "../../packages/plugin-sdk/src"),
    },
  },
  root: ".", // keep default
});
