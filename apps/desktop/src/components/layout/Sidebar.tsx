import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {listEnabled, onEnabledChanged} from "@/core/plugin-state";

export default function Sidebar() {
    const [plugins, setPlugins] = useState<Awaited<ReturnType<typeof listEnabled>>>([]);

    useEffect(() => {
        let alive = true;

        (async () => {
            const items = await listEnabled();
            if (alive) setPlugins(items);
        })();

        const off = onEnabledChanged(async () => {
            const items = await listEnabled();
            if (alive) setPlugins(items);
        });

        return () => {
            alive = false;
            off && off();
        };
    }, []);

    return (
        <aside className="h-full border-r border-border bg-muted/10 p-2">
            <div className="mb-3">
                <Link to="/settings" className="text-xs text-muted-foreground hover:underline">
                    ⚙︎ Settings
                </Link>
            </div>

            <h3 className="flex justify-between py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plugins
                <div className="text-xxs">
                    {plugins.length}
                </div>
            </h3>

            <ul className="grid gap-2 text-sm">
                {plugins.map(p => (
                    <li key={p.id}>
                        <Link to={`/plugin/${p.id}`}
                              className="block rounded-md p-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                            {p.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
