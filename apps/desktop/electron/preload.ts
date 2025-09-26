import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("plugins", {
  list: () => ipcRenderer.invoke("plugin:list") as Promise<Array<{ id: string; name: string; description?: string; enabled: boolean }>>,
  setEnabled: (id: string, value: boolean) => ipcRenderer.invoke("plugin:setEnabled", id, value) as Promise<boolean>,
});

contextBridge.exposeInMainWorld("pluginSettings", {
  get: (pluginId: string) => ipcRenderer.invoke("settings:get", pluginId) as Promise<any>,
  set: (pluginId: string, values: any) => ipcRenderer.invoke("settings:set", pluginId, values) as Promise<boolean>,
});

declare global {
  interface Window {
    plugins: {
      list(): Promise<Array<{ id: string; name: string; description?: string; enabled: boolean }>>;
      setEnabled(id: string, value: boolean): Promise<boolean>;
    };
    pluginSettings: {
      get(pluginId: string): Promise<any>;
      set(pluginId: string, values: any): Promise<boolean>;
    };
  }
}
