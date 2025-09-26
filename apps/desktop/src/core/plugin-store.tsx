import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { listAll, setEnabled } from "./plugin-state";

export type PluginStoreItem = Awaited<ReturnType<typeof listAll>>[number];

interface PluginStoreValue {
  plugins: PluginStoreItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setPluginEnabled: (id: string, value: boolean) => Promise<void>;
}

export const PluginStoreContext = createContext<PluginStoreValue | null>(null);

export function PluginStoreProvider({ children }: { children: React.ReactNode }) {
  const [plugins, setPlugins] = useState<PluginStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAll();
      setPlugins(data);
      setError(null);
    } catch (err) {
      setError((err as Error)?.message ?? "Refresh failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setPluginEnabled = useCallback(
    async (id: string, value: boolean) => {
      setPlugins((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: value } : item)));
      try {
        await setEnabled(id, value);
      } catch (err) {
        setError((err as Error)?.message ?? "Toggle failed");
        await refresh();
      }
    },
    [refresh]
  );

  const value = useMemo<PluginStoreValue>(
    () => ({ plugins, loading, error, refresh, setPluginEnabled }),
    [plugins, loading, error, refresh, setPluginEnabled]
  );

  return <PluginStoreContext.Provider value={value}>{children}</PluginStoreContext.Provider>;
}

type PluginStatusFilter = "enabled" | "disabled";

export function usePluginStore(options: { status?: PluginStatusFilter } = {}) {
  const ctx = useContext(PluginStoreContext);
  if (!ctx) throw new Error("usePluginStore must be used inside PluginStoreProvider");

  const { status = "all" } = options;
  const { plugins, loading, error, refresh, setPluginEnabled } = ctx;

  const filtered = useMemo(() => {
    if (status === "enabled") return plugins.filter((p) => p.enabled);
    if (status === "disabled") return plugins.filter((p) => !p.enabled);
    return plugins;
  }, [plugins, status]);

  return { plugins: filtered, loading, error, refresh, setPluginEnabled };
}
