import { getIpc } from "./ipc";

export type Theme = "system" | "light" | "dark" | "tahoe";

const LEGACY_STORAGE_KEY = "app.theme";
const NEXT_THEME_STORAGE_KEY = "theme";

let initialised = false;
let cachedTheme: Theme = "system";

function resolveTheme(theme: Theme): "light" | "dark" {
    if (theme === "system") {
        return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    if (theme === "tahoe") {
        return "light";
    }

    return theme;
}

function applyThemeTokens(theme: Theme) {
    const root = document.documentElement;
    const resolved = resolveTheme(theme);

    root.classList.toggle("dark", resolved === "dark");

    if (theme === "tahoe") {
        root.setAttribute("data-theme", "tahoe");
    } else {
        root.removeAttribute("data-theme");
    }
}

async function fetchPersistedTheme(): Promise<Theme | null> {
    try {
        const ipc = getIpc();
        if (ipc) {
            const stored = await ipc.invoke("settings:app:get", "theme");
            if (stored === "system" || stored === "light" || stored === "dark" || stored === "tahoe") {
                return stored;
            }
        }
    } catch (error) {
        console.warn("[theme] failed to read persisted theme", error);
    }

    const local = localStorage.getItem(LEGACY_STORAGE_KEY) ?? localStorage.getItem(NEXT_THEME_STORAGE_KEY);
    if (local === "system" || local === "light" || local === "dark" || local === "tahoe") {
        return local;
    }

    return null;
}

export async function initThemeStore(): Promise<Theme> {
    if (initialised) {
        applyThemeTokens(cachedTheme);
        return cachedTheme;
    }

    initialised = true;
    cachedTheme = (await fetchPersistedTheme()) ?? "system";
    applyThemeTokens(cachedTheme);

    persistThemeLocally(cachedTheme);

    return cachedTheme;
}

function persistThemeLocally(theme: Theme) {
    localStorage.setItem(LEGACY_STORAGE_KEY, theme);
    localStorage.setItem(NEXT_THEME_STORAGE_KEY, theme);
}

export async function persistTheme(theme: Theme) {
    cachedTheme = theme;
    persistThemeLocally(theme);

    try {
        const ipc = getIpc();
        if (ipc) {
            await ipc.invoke("settings:app:set", "theme", theme);
        }
    } catch (error) {
        console.warn("[theme] failed to persist theme", error);
    }
}
