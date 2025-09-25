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

contextBridge.exposeInMainWorld("plugins", {
  getEnabled: (id: string) => ipcRenderer.invoke("plugin:getEnabled", id) as Promise<boolean>,
  setEnabled: (id: string, value: boolean) => ipcRenderer.invoke("plugin:setEnabled", id, value) as Promise<void>,
  getEnabledMap: (ids: string[]) => ipcRenderer.invoke("plugin:getEnabledMap", ids) as Promise<Record<string, boolean>>,
  onEnabledChanged: (cb: (p: { id: string; value: boolean }) => void) => {
    const listener = (_: any, payload: { id: string; value: boolean }) => cb(payload);
    ipcRenderer.on("plugin-enabled-changed", listener);
    return () => ipcRenderer.removeListener("plugin-enabled-changed", listener);
  },
});

declare global {
  interface Window {
    plugins: {
      getEnabled(id: string): Promise<boolean>;
      setEnabled(id: string, value: boolean): Promise<void>;
      getEnabledMap(ids: string[]): Promise<Record<string, boolean>>;
      onEnabledChanged(cb: (p: { id: string; value: boolean }) => void): () => void;
    };
  }
}
