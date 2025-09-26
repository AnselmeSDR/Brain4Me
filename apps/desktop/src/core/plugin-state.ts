import { get, list as manifestList } from "./plugin-registry";

export type PluginRecord = ReturnType<typeof manifestList>[number] & { enabled: boolean };

export async function listAll(): Promise<PluginRecord[]> {
  const manifests = manifestList();
  try {
    const remote = await window.plugins.list();
    if (!remote || remote.length === 0) {
      throw new Error("remote plugin list empty");
    }
    return remote.map((item) => {
      const manifest = get(item.id);
      if (manifest) {
        return { ...manifest, enabled: item.enabled };
      }
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        entry: async () => ({ default: () => null }),
        enabled: item.enabled,
      } as PluginRecord;
    });
  } catch (err) {
    console.warn("[plugin-state] falling back to manifest list", err);
    return manifests.map((manifest) => ({ ...manifest, enabled: true }));
  }
}

export async function setEnabled(id: string, value: boolean) {
  await window.plugins.setEnabled(id, value);
}
