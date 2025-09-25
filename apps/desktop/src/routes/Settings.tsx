import { useEffect, useState } from "react";
import { setEnabled, listAll, onEnabledChanged } from "@/core/plugin-state";

export default function SettingsPage() {
    const [items, setItems] = useState<Awaited<ReturnType<typeof listAll>>>([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            const all = await listAll();
            if (alive) setItems(all);
        })();
        const off = onEnabledChanged(async () => {
            const all = await listAll();
            if (alive) setItems(all);
        });
        return () => {
            alive = false;
            off && off();
        };
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <section>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Plugins</h2>
                <ul className="divide-y">
                    {items.map((p) => (
                        <li key={p.id} className="flex items-center justify-between py-2">
                            <div>
                                <div className="font-medium">{p.name}</div>
                                {p.description && (
                                    <div className="text-xs text-muted-foreground">{p.description}</div>
                                )}
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={p.enabled}
                                    onChange={async (e) => {
                                        await setEnabled(p.id, e.currentTarget.checked);
                                        // rafraîchi via l'évènement onEnabledChanged
                                    }}
                                />
                                Enabled
                            </label>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
