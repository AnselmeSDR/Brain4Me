import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain, nativeImage, type NativeImage } from "electron";
import { eq, inArray } from "drizzle-orm";
import { getDb, pluginSettings, settings } from "./db";
import { getJoke, invalidateJokeCache } from "./jokes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(globalThis as any).__filename = __filename;
(globalThis as any).__dirname = __dirname;

let cachedAppIcon: NativeImage | null | undefined;

function resolveAssetPath(filename: string) {
  const devPath = path.resolve(__dirname, "../electron/assets", filename);
  if (!app.isPackaged && fs.existsSync(devPath)) {
    return devPath;
  }

  const packagedPath = path.join(process.resourcesPath, "assets", filename);
  if (fs.existsSync(packagedPath)) {
    return packagedPath;
  }

  if (fs.existsSync(devPath)) {
    return devPath;
  }

  return null;
}

function loadAppIcon() {
  if (cachedAppIcon !== undefined) return cachedAppIcon;
  const assetPath = resolveAssetPath("app-icon.png");
  if (!assetPath) {
    console.warn("[main] app icon file not found");
    cachedAppIcon = null;
    return cachedAppIcon;
  }

  try {
    const icon = nativeImage.createFromPath(assetPath);
    if (icon.isEmpty()) {
      console.warn("[main] app icon is empty", assetPath);
      cachedAppIcon = null;
    } else {
      cachedAppIcon = icon;
    }
  } catch (error) {
    console.warn("[main] failed to load app icon", assetPath, error);
    cachedAppIcon = null;
  }
  return cachedAppIcon;
}

let win: BrowserWindow | null = null;
const defaultPlugins = [
  { id: "hello", name: "Hello Plugin", description: "Plugin de démonstration" },
  { id: "notes", name: "Notes", description: "Bloc-notes local (exemple)" },
  { id: "calendar", name: "Calendrier", description: "Aperçu calendrier statique" },
];

async function ensurePluginRows() {
  const db = getDb();
  await db
    .insert(pluginSettings)
    .values(defaultPlugins.map((p) => ({ pluginId: p.id, enabled: 1, settings: "{}" })))
    .onConflictDoNothing({ target: pluginSettings.pluginId });
}

async function createWindow() {
  const windowIcon = loadAppIcon();

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 16 },
    vibrancy: "under-window",
    visualEffectState: "followWindow",
    roundedCorners: true,
    backgroundColor: "#00000000",
    icon: windowIcon ?? undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    show: false,
  });

  const devServer = process.env.VITE_DEV_SERVER_URL;
  const prodIndex = new URL("../index.html", import.meta.url).toString();
  const loadTarget = devServer ?? prodIndex;

  const ensureVisible = () => {
    if (win && !win.isDestroyed() && !win.isVisible()) {
      win.show();
    }
  };

  win.once("ready-to-show", ensureVisible);
  win.webContents.on("did-finish-load", ensureVisible);

  await win.loadURL(loadTarget);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady()
  .then(async () => {
    await ensurePluginRows();
    if (process.platform === "darwin") {
      const appIcon = loadAppIcon();
      if (appIcon) {
        app.dock.setIcon(appIcon);
      }
    }
    await createWindow();
  })
  .catch((err) => {
    console.error("[main] failed to create window", err);
  });

ipcMain.handle("plugin:list", async () => {
  const db = getDb();
  const ids = defaultPlugins.map((p) => p.id);
  const rows = await db.select().from(pluginSettings).where(inArray(pluginSettings.pluginId, ids));
  const enabledMap = new Map<string, boolean>(rows.map((row) => [row.pluginId, row.enabled === 1]));
  return defaultPlugins.map((p) => ({ ...p, enabled: enabledMap.get(p.id) ?? true }));
});

ipcMain.handle("plugin:setEnabled", async (_e, id: string, value: boolean) => {
  const db = getDb();
  const enabled = value ? 1 : 0;
  const existing = await db.select().from(pluginSettings).where(eq(pluginSettings.pluginId, id));
  const payload = existing.length && existing[0].settings ? existing[0].settings : "{}";
  await db
    .insert(pluginSettings)
    .values({ pluginId: id, enabled, settings: payload })
    .onConflictDoUpdate({ target: pluginSettings.pluginId, set: { enabled } });
  return true;
});

ipcMain.handle("settings:get", async (_e, pluginId: string) => {
  const db = getDb();
  const rows = await db.select().from(pluginSettings).where(eq(pluginSettings.pluginId, pluginId));
  if (!rows.length) return { enabled: true };
  const row = rows[0];
  let data: any = {};
  if (row.settings) {
    try {
      data = JSON.parse(row.settings);
    } catch (err) {
      console.warn("[main] failed to parse settings JSON", err);
    }
  }
  return { ...data, enabled: row.enabled === 1 };
});

ipcMain.handle("settings:set", async (_e, pluginId: string, values: any) => {
  const db = getDb();
  const rows = await db.select().from(pluginSettings).where(eq(pluginSettings.pluginId, pluginId));
  const current = rows.length ? rows[0] : null;
  const { enabled: enabledInput, ...rest } = values ?? {};
  const enabled = typeof enabledInput === "boolean" ? (enabledInput ? 1 : 0) : current?.enabled ?? 1;
  const payload = JSON.stringify(rest ?? {});
  await db
    .insert(pluginSettings)
    .values({ pluginId: pluginId, enabled, settings: payload })
    .onConflictDoUpdate({ target: pluginSettings.pluginId, set: { enabled, settings: payload } });
  return true;
});

// Global application settings stored as simple key/value pairs
ipcMain.handle("settings:app:get", async (_e, key: string) => {
  const db = getDb();
  const rows = await db.select().from(settings).where(eq(settings.key, key));
  if (!rows.length) return null;
  try {
    return JSON.parse(rows[0].value ?? "null");
  } catch {
    return rows[0].value;
  }
});

ipcMain.handle("settings:app:set", async (_e, key: string, value: any) => {
  const db = getDb();
  const payload = typeof value === "string" ? value : JSON.stringify(value);
  await db
    .insert(settings)
    .values({ key, value: payload })
    .onConflictDoUpdate({ target: settings.key, set: { value: payload } });
  if (key === "topbar.joke") {
    invalidateJokeCache();
  }
  return true;
});

ipcMain.handle("system:metrics", async () => {
  const metrics = app.getAppMetrics ? app.getAppMetrics() : [];
  const cpuPercent = metrics.reduce((sum, metric) => sum + (metric.cpu?.percentCPUUsage ?? 0), 0);
  const memoryKB = metrics.reduce((sum, metric) => sum + (metric.memory?.workingSetSize ?? 0), 0);
  return {
    cpuPercent: Number(cpuPercent.toFixed(1)),
    memoryMB: Math.round(memoryKB / 1024),
  };
});

ipcMain.handle("system:joke", async (_event, force?: boolean) => {
  return getJoke(Boolean(force));
});
