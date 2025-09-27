import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Sidebar from "../src/components/layout/Sidebar";
import { PluginStoreContext } from "../src/core/plugin-store";

describe("Sidebar", () => {
  const baseStore = {
    plugins: [],
    loading: false,
    error: null,
    refresh: vi.fn(),
    setPluginEnabled: vi.fn(),
  };

  it("renders only enabled plugins", () => {
    const html = renderToString(
      <StaticRouter location="/plugin/hello">
        <PluginStoreContext.Provider
          value={{
            ...baseStore,
            plugins: [
              { id: "hello", name: "Hello Plugin", description: "", entry: async () => ({ default: () => null }), enabled: true },
              { id: "notes", name: "Notes", description: "", entry: async () => ({ default: () => null }), enabled: false },
            ],
          }}
        >
          <Sidebar />
        </PluginStoreContext.Provider>
      </StaticRouter>
    );

    expect(html).toContain("Hello Plugin");
    expect(html).not.toContain("Notes");
  });

  it("highlights active plugin link", () => {
    const html = renderToString(
      <StaticRouter location="/plugin/hello">
        <PluginStoreContext.Provider
          value={{
            ...baseStore,
            plugins: [
              { id: "hello", name: "Hello Plugin", description: "", entry: async () => ({ default: () => null }), enabled: true },
              { id: "calendar", name: "Calendrier", description: "", entry: async () => ({ default: () => null }), enabled: true },
            ],
          }}
        >
          <Sidebar />
        </PluginStoreContext.Provider>
      </StaticRouter>
    );

    expect(html).toContain("bg-accent");
    expect(html).toContain("Hello Plugin");
  });
});
