import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, ipcMain, BrowserWindow } from "electron";
import { eq, inArray } from "drizzle-orm";
import { getDb, pluginSettings } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disableHardwareAcceleration();

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
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
  await win.loadURL(devServer ?? prodIndex);
  win.once("ready-to-show", () => win?.show());
}

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

app.whenReady().then(createWindow).catch((err) => {
  console.error("[main] failed to create window", err);
});

process.on("unhandledRejection", (err) => {
  console.error("[main] unhandledRejection", err);
});

function broadcastEnabledChanged(payload: { id: string; value: boolean }) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send("plugin-enabled-changed", payload);
  }
}

ipcMain.handle("plugin:getEnabled", async (_e, id: string) => {
  const db = getDb();
  const rows = await db.select().from(pluginSettings).where(eq(pluginSettings.pluginId, id));
  if (rows.length === 0) return true; // défaut: activé
  return rows[0].enabled === 1;
});

ipcMain.handle("plugin:setEnabled", async (_e, id: string, value: boolean) => {
  const db = getDb();
  const enabled = value ? 1 : 0;
  await db
    .insert(pluginSettings)
    .values({ pluginId: id, enabled })
    .onConflictDoUpdate({ target: pluginSettings.pluginId, set: { enabled } });
  broadcastEnabledChanged({ id, value });
  return true;
});

ipcMain.handle("plugin:getEnabledMap", async (_e, ids: string[]) => {
  const db = getDb();
  if (!ids || ids.length === 0) return {} as Record<string, boolean>;
  const rows = await db.select().from(pluginSettings).where(inArray(pluginSettings.pluginId, ids));
  const map: Record<string, boolean> = {};
  for (const id of ids) map[id] = true; // par défaut, true
  for (const r of rows) map[r.pluginId] = r.enabled === 1;
  return map;
});

// simple settings store in memory for MVP
const settingsStore = new Map<string, any>();

ipcMain.handle("settings:get", (_e, pluginId: string) => {
  return settingsStore.get(pluginId) ?? {};
});

ipcMain.handle("settings:set", (_e, pluginId: string, values: any) => {
  settingsStore.set(pluginId, values);
  return true;
});
