import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// simple settings store in memory for MVP
const settingsStore = new Map<string, any>();

ipcMain.handle("settings:get", (_e, pluginId: string) => {
  return settingsStore.get(pluginId) ?? {};
});

ipcMain.handle("settings:set", (_e, pluginId: string, values: any) => {
  settingsStore.set(pluginId, values);
  return true;
});
