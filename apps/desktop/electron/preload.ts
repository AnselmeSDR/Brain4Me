import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("bridge", {
  settings: {
    get: (pluginId: string) => ipcRenderer.invoke("settings:get", pluginId),
    set: (pluginId: string, values: any) => ipcRenderer.invoke("settings:set", pluginId, values),
  },
  ui: {
    toast: (msg: string) => { /* you can later hook a sys notification */ console.log("[toast]", msg); }
  }
});

export type Bridge = typeof window & {
  bridge: {
    settings: { get: (pluginId: string) => Promise<any>; set: (pluginId: string, v: any) => Promise<boolean>; };
    ui: { toast: (msg: string) => void; }
  }
};
