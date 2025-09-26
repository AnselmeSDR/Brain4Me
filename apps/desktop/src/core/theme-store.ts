import { getIpc } from "./ipc";

/* Theme store: system | light | dark | tahoe
   - Persists to SQL through IPC channels: "settings:app:get" / "settings:app:set"
   - Falls back to localStorage if IPC not available
   - Applies data-theme on <html> and toggles .dark for Tailwind dark tokens
*/
export type Theme = "system" | "light" | "dark" | "tahoe";

// Minimal pub/sub store (no external deps)
type Listener = (theme: Theme) => void;
let currentTheme: Theme = "system";
const listeners = new Set<Listener>();
let isInitialized = false;
let systemMedia: MediaQueryList | null = null;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;

  root.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark));

  if (theme === "tahoe") {
    root.setAttribute("data-theme", "tahoe");
  } else {
    root.removeAttribute("data-theme");
  }
}

async function loadInitial(): Promise<Theme> {
  try {
    const ipc = getIpc();
    if (ipc) {
      const value = await ipc.invoke("settings:app:get", "theme");
      if (value === "system" || value === "light" || value === "dark" || value === "tahoe") {
        return value;
      }
    }
  } catch {}

  const stored = localStorage.getItem("app.theme");
  if (stored === "system" || stored === "light" || stored === "dark" || stored === "tahoe") {
    return stored;
  }

  return "system";
}

async function persist(theme: Theme) {
  try {
    const ipc = getIpc();
    if (ipc) {
      await ipc.invoke("settings:app:set", "theme", theme);
      return;
    }
  } catch {}

  localStorage.setItem("app.theme", theme);
}

export async function initThemeStore() {
  if (isInitialized) {
    applyTheme(currentTheme);
    return;
  }

  isInitialized = true;
  currentTheme = await loadInitial();
  applyTheme(currentTheme);

  systemMedia = matchMedia("(prefers-color-scheme: dark)");
  systemMedia.addEventListener("change", () => {
    if (currentTheme === "system") {
      applyTheme(currentTheme);
    }
  });
}

export function getTheme(): Theme {
  return currentTheme;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setTheme(next: Theme) {
  if (next === currentTheme) {
    return;
  }

  currentTheme = next;
  applyTheme(currentTheme);
  listeners.forEach((listener) => listener(currentTheme));
  await persist(currentTheme);
}
