import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let win = null;
async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    show: false
  });
  const devServer = process.env.VITE_DEV_SERVER_URL;
  const prodIndex = new URL("data:text/html;base64,PCFkb2N0eXBlIGh0bWw+CjxodG1sPgo8aGVhZD4KICAgIDxtZXRhIGNoYXJzZXQ9IlVURi04IiAvPgogICAgPG1ldGEgaHR0cC1lcXVpdj0iQ29udGVudC1TZWN1cml0eS1Qb2xpY3kiCiAgICAgICAgICBjb250ZW50PSJkZWZhdWx0LXNyYyAnc2VsZic7IGltZy1zcmMgJ3NlbGYnIGRhdGE6OyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJzsgc2NyaXB0LXNyYyAnc2VsZic7IiAvPgogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAiIC8+CiAgICA8dGl0bGU+QnJhaW40TWU8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5Pgo8ZGl2IGlkPSJyb290Ij48L2Rpdj4KPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL3NyYy9tYWluLnRzeCI+PC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo=", import.meta.url).toString();
  await win.loadURL(devServer ?? prodIndex);
  win.once("ready-to-show", () => win == null ? void 0 : win.show());
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
const settingsStore = /* @__PURE__ */ new Map();
ipcMain.handle("settings:get", (_e, pluginId) => {
  return settingsStore.get(pluginId) ?? {};
});
ipcMain.handle("settings:set", (_e, pluginId, values) => {
  settingsStore.set(pluginId, values);
  return true;
});
