// apps/desktop/src/core/plugin-state.ts
import { list as baseList } from "./plugin-registry";
export type PluginRecord = ReturnType<typeof baseList>[number] & { enabled: boolean };

let cache: Record<string, boolean> | null = null;
let timer: any = null;

function setCache(map: Record<string, boolean>) {
  cache = map;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => (cache = null), 2000);
}

export async function listAll(): Promise<PluginRecord[]> {
  const all = baseList();
  const ids = all.map(p => p.id);
  try {
    let map: Record<string, boolean>;
    if (cache && ids.every(id => id in cache)) {
      map = cache;
    } else {
      map = await window.plugins.getEnabledMap(ids);
      setCache(map);
    }
    return all.map(p => ({ ...p, enabled: map[p.id] ?? true }));
  } catch (e) {
    console.warn("[plugin-state] fallback enabled=true", e);
    return all.map(p => ({ ...p, enabled: true }));
  }
}

export async function listEnabled() {
  const all = await listAll();
  return all.filter(p => p.enabled);
}

export function onEnabledChanged(cb: (id: string, v: boolean) => void) {
  return window.plugins.onEnabledChanged(({ id, value }) => {
    cache = null; // invalide le cache
    cb(id, value);
  });
}

export async function setEnabled(id: string, value: boolean) {
    await window.plugins.setEnabled(id, value);
    cache = null; // invalide le cache
}
