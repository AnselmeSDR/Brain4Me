import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./tests/vitest.setup.ts",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@sdk": path.resolve(__dirname, "../../packages/plugin-sdk/src"),
        },
    },
});
