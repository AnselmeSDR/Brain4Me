import {Link, useLocation} from "react-router-dom";
import {usePluginStore} from "@/core/plugin-store";

export default function Sidebar() {
    const {plugins, loading} = usePluginStore({status: "enabled"});
    const location = useLocation();

    return (
        <aside
            className="h-full rounded-tr-3xl border-r border-border/70 bg-card/70 p-4 shadow-[6px_0_18px_rgba(15,23,42,0.05)] backdrop-blur-sm">
            <h3 className="flex items-center justify-between pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plugins
                <div className="text-xxs">
                    {plugins.length}
                </div>
            </h3>

            <ul className="flex flex-col gap-2 text-sm">
                {loading ? (
                    <li className="text-xs text-muted-foreground">Chargement…</li>
                ) : (
                    plugins.map((p) => {
                        const active = location.pathname === `/plugin/${p.id}`;
                        return (
                            <li key={p.id}>
                                <Link to={`/plugin/${p.id}`}
                                    className={`block px-3 py-2 font-medium transition-all ${
                                        active
                                            ? "text-primary"
                                            : "text-foreground hover:text-primary"
                                    }`}>
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
