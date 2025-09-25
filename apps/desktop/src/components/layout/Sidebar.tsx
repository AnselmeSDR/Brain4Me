import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { list } from "@/core/plugin-registry";

export default function Sidebar() {
    const [plugins, setPlugins] = useState(() => list());
    useEffect(() => { setPlugins(list()); }, []);
    return (
        <aside className="h-full border-r border-border bg-muted/10 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plugins
            </h3>
            <ul className="grid gap-2 text-sm">
                {plugins.map(p => (
                    <li key={p.id}>
                        <Link
                            to={`/plugin/${p.id}`}
                            className="block rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            {p.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
