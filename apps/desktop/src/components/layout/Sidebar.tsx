import { Link, useLocation } from "react-router-dom";
import { usePluginStore } from "@/core/plugin-store";

export default function Sidebar() {
    const { plugins, loading } = usePluginStore({ status: "enabled" });
    const location = useLocation();

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
                {loading ? (
                    <li className="text-xs text-muted-foreground">Chargement…</li>
                ) : (
                    plugins.map((p) => {
                        const active = location.pathname === `/plugin/${p.id}`;
                        return (
                            <li key={p.id}>
                                <Link
                                    to={`/plugin/${p.id}`}
                                    className={`block rounded-md p-2 font-medium transition-colors ${
                                        active
                                            ? "bg-accent text-accent-foreground"
                                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                >
                                    {p.name}
                                </Link>
                            </li>
                        );
                    })
                )}
            </ul>
        </aside>
    );
}
