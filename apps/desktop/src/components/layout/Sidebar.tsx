import {Link, useLocation} from "react-router-dom";
import {usePluginStore} from "@/core/plugin-store";
import {Button} from "@/components/ui/button";

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
                {loading 
                ? <li className="text-xs text-muted-foreground">Chargement…</li>
                : plugins.map((p) => {
                        const active = location.pathname === `/plugin/${p.id}`;
                        return (
                            <li key={p.id}>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={`!flex !h-auto w-full items-center justify-start gap-2 rounded-xl px-3 py-2 font-medium transition-all ${
                                        active
                                            ? "border-accent text-primary"
                                            : "border-border/70 text-foreground hover:border-accent/60 hover:bg-accent/80"
                                    }`}>
                                    <Link to={`/plugin/${p.id}`}>
                                        {p.name}
                                    </Link>
                                </Button>
                            </li>
                        );
                    })
                }
            </ul>
        </aside>
    );
}
