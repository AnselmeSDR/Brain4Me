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
