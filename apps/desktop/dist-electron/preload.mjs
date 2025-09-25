"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("bridge", {
  settings: {
    get: (pluginId) => electron.ipcRenderer.invoke("settings:get", pluginId),
    set: (pluginId, values) => electron.ipcRenderer.invoke("settings:set", pluginId, values)
  },
  ui: {
    toast: (msg) => {
      console.log("[toast]", msg);
    }
  }
});
electron.contextBridge.exposeInMainWorld("plugins", {
  getEnabled: (id) => electron.ipcRenderer.invoke("plugin:getEnabled", id),
  setEnabled: (id, value) => electron.ipcRenderer.invoke("plugin:setEnabled", id, value),
  getEnabledMap: (ids) => electron.ipcRenderer.invoke("plugin:getEnabledMap", ids),
  onEnabledChanged: (cb) => {
    const listener = (_, payload) => cb(payload);
    electron.ipcRenderer.on("plugin-enabled-changed", listener);
    return () => electron.ipcRenderer.removeListener("plugin-enabled-changed", listener);
  }
});
