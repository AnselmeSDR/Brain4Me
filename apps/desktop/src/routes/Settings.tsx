import { usePluginStore } from "@/core/plugin-store";

export default function SettingsPage() {
    const { plugins, loading, error, setPluginEnabled } = usePluginStore();

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-lg font-semibold">Settings</h1>
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
