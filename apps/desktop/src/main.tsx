import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initThemeStore } from "@/core/theme-store";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

const root = createRoot(el);
void (async () => {
    try {
        await initThemeStore();
    } catch (err) {
        console.error("[theme] failed to initialise", err);
    }
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
})();
