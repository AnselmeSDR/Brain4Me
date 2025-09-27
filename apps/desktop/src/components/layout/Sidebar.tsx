import {Link, useLocation} from "react-router-dom";
import {usePluginStore} from "@/core/plugin-store";
import {Button} from "@/components/ui/button";
import {PluginIcon} from "@/components/icons/PluginIcon";

export default function Sidebar() {
    const {plugins, loading} = usePluginStore({status: "enabled"});
    const location = useLocation();

    return (
        <aside className="flex h-full min-h-0 w-full flex-col gap-[16px] overflow-y-auto rounded-tr-[24px] border-r border-border/70 bg-card/70 p-[12px] shadow-[6px_0_18px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all">
            <div className="flex items-center justify-center text-muted-foreground transition-all duration-200 group-hover/sidebar:justify-between">
                <span className="hidden text-[12px] font-semibold uppercase tracking-wide group-hover/sidebar:block">Plugins</span>
                <div className="hidden text-[10px] group-hover/sidebar:block">
                    {plugins.length}
                </div>
                <PluginIcon className="h-[24px] w-[24px] group-hover/sidebar:hidden" />
            </div>

            <ul className="flex flex-1 flex-col items-center gap-[8px] text-[14px] group-hover/sidebar:items-stretch">
                {loading ? (
                    <li className="text-[12px] text-muted-foreground">Chargement…</li>
                ) : (
                    plugins.map((p) => {
                        const active = location.pathname === `/plugin/${p.id}`;
                        return (
                            <li key={p.id}>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={`!flex !h-auto w-full items-center justify-center gap-0 rounded-[24px] px-[8px] py-[8px] font-medium transition-all group-hover/sidebar:justify-start group-hover/sidebar:gap-[12px] border-border/70 text-foreground text-[14px] ${
                                        active
                                            ? "bg-accent"
                                            : "hover:bg-accent/80"
                                    }`}>
                                    <Link to={`/plugin/${p.id}`} className="flex w-full items-center justify-center gap-0 group-hover/sidebar:justify-start group-hover/sidebar:gap-[12px]">
                                        <PluginIcon icon={p.icon} className="h-[20px] w-[20px]" />
                                        <span className="hidden truncate group-hover/sidebar:inline">{p.name}</span>
                                    </Link>
                                </Button>
                            </li>
                        );
                    })
                )}
            </ul>
        </aside>
    );
}
