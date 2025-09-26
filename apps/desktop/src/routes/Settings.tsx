import { usePluginStore } from "@/core/plugin-store";
import { getTheme, initThemeStore, setTheme, subscribe, type Theme } from "@/core/theme-store";
import { useEffect, useSyncExternalStore } from "react";

export default function SettingsPage() {
    const { plugins, loading, error, setPluginEnabled } = usePluginStore();

    // subscribe to theme store
    useEffect(() => {
        void initThemeStore();
    }, []);
    const theme = useSyncExternalStore(subscribe, getTheme, getTheme);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <section className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Appearance</h2>
                <div className="rounded-md border bg-card p-3">
                    <label className="flex items-center gap-3 text-sm">
                        <span className="w-28 text-muted-foreground">Theme</span>
                        <select
                            className="min-w-40 rounded border bg-background px-2 py-1 text-foreground"
                            value={theme}
                            onChange={async ({ currentTarget }) => {
                                await setTheme(currentTarget.value as Theme);
                            }}
                        >
                            <option value="system">System</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="tahoe">Tahoe</option>
                        </select>
                    </label>
                </div>
            </section>
            <section>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Plugins</h2>
                {error && <div className="mb-3 text-xs text-destructive">{error}</div>}
                <ul className="divide-y rounded-md border bg-card">
                    {(loading ? [] : plugins).map((p) => (
                        <li key={p.id} className="flex items-center justify-between px-3 py-2">
                            <div>
                                <div className="font-medium text-foreground">{p.name}</div>
                                {p.description && (
                                    <div className="text-xs text-muted-foreground">{p.description}</div>
                                )}
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={p.enabled}
                                    onChange={async ({ currentTarget }) => {
                                        const nextChecked = currentTarget.checked;
                                        await setPluginEnabled(p.id, nextChecked);
                                    }}
                                />
                                Enabled
                            </label>
                        </li>
                    ))}
                </ul>
                {loading && <div className="py-4 text-xs text-muted-foreground">Chargement…</div>}
            </section>
        </div>
    );
}
