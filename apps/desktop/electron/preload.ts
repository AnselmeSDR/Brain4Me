import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("plugins", {
  list: () => ipcRenderer.invoke("plugin:list") as Promise<Array<{ id: string; name: string; description?: string; enabled: boolean }>>,
  setEnabled: (id: string, value: boolean) => ipcRenderer.invoke("plugin:setEnabled", id, value) as Promise<boolean>,
});

contextBridge.exposeInMainWorld("pluginSettings", {
  get: (pluginId: string) => ipcRenderer.invoke("settings:get", pluginId) as Promise<any>,
  set: (pluginId: string, values: any) => ipcRenderer.invoke("settings:set", pluginId, values) as Promise<boolean>,
});

contextBridge.exposeInMainWorld("bridge", {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
});

contextBridge.exposeInMainWorld("system", {
  metrics: () => ipcRenderer.invoke("system:metrics") as Promise<{ cpuPercent: number; memoryMB: number }>,
  joke: (force = false) => ipcRenderer.invoke("system:joke", force) as Promise<string | null>,
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
    bridge: {
      invoke<T = any>(channel: string, ...args: any[]): Promise<T>;
    };
    system: {
      metrics(): Promise<{ cpuPercent: number; memoryMB: number }>;
      joke(force?: boolean): Promise<string | null>;
    };
  }
}
