import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { listAll, setEnabled } from "../src/core/plugin-state";
import { list as manifestList } from "../src/core/plugin-registry";

declare global {
  interface Window {
    plugins: {
      list: () => Promise<Array<{ id: string; enabled: boolean; name?: string; description?: string }>>;
      setEnabled: (id: string, value: boolean) => Promise<void>;
    };
  }
}

describe("plugin-state", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).window = {
      plugins: {
        list: vi.fn(),
        setEnabled: vi.fn(),
      },
    } as Window;
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  it("merges remote metadata with manifests", async () => {
    const remote = manifestList().map((p, index) => ({ id: p.id, enabled: index % 2 === 0 }));
    window.plugins.list = vi.fn().mockResolvedValue(remote);

    const result = await listAll();

    expect(result).toHaveLength(remote.length);
    result.forEach((plugin, index) => {
      expect(plugin.id).toBe(remote[index].id);
      expect(plugin.enabled).toBe(remote[index].enabled);
      const manifest = manifestList().find((m) => m.id === plugin.id);
      expect(plugin.name).toBe(manifest?.name);
    });
  });

  it("falls back to manifest list when remote list is empty", async () => {
    window.plugins.list = vi.fn().mockResolvedValue([]);

    const result = await listAll();

    expect(result).toHaveLength(manifestList().length);
    result.forEach((plugin) => {
      expect(plugin.enabled).toBe(true);
    });
  });

  it("falls back when remote list rejects", async () => {
    window.plugins.list = vi.fn().mockRejectedValue(new Error("network"));

    const result = await listAll();

    expect(result).toHaveLength(manifestList().length);
    result.forEach((plugin) => {
      expect(plugin.enabled).toBe(true);
    });
  });

  it("delegates enable toggle to bridge", async () => {
    const mock = vi.fn().mockResolvedValue(undefined);
    window.plugins.setEnabled = mock;

    await setEnabled("hello", false);

    expect(mock).toHaveBeenCalledWith("hello", false);
  });
});
