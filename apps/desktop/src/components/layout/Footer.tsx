import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { getIpc } from "@/core/ipc";

type Metrics = {
    cpuPercent: number;
    memoryMB: number;
};

function useSystemMetrics() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);

    useEffect(() => {
        let cancelled = false;
        let timer: ReturnType<typeof setInterval> | null = null;
        let inFlight = false;

        const load = async () => {
            if (inFlight) return;
            inFlight = true;
            try {
                const bridge = getIpc();
                const anyWin = window as any;
                let data: Metrics | null = null;

                if (anyWin.system?.metrics) {
                    data = await anyWin.system.metrics();
                } else if (bridge) {
                    data = await bridge.invoke<Metrics>("system:metrics");
                }

                if (!data) return;
                if (!cancelled) {
                    setMetrics(data);
                }
            } catch {
                /* swallow transient errors */
            } finally {
                inFlight = false;
            }
        };

        void load();
        timer = setInterval(load, 5000);

        return () => {
            cancelled = true;
            if (timer) clearInterval(timer);
        };
    }, []);

    return metrics;
}

export default function Footer() {
    const metrics = useSystemMetrics();

    return (
        <footer className="h-8 shrink-0 border-t border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-4 px-4 text-xs" style={{ WebkitAppRegion: "no-drag" }}>
            <Link to="/settings" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Cog6ToothIcon aria-hidden className="h-4 w-4" />
                <span>Settings</span>
            </Link>
            <div className="ml-auto flex items-center gap-4 text-muted-foreground">
                <span>RAM {metrics ? `${metrics.memoryMB} MB` : "--"}</span>
                <span>CPU {metrics ? `${metrics.cpuPercent}%` : "--"}</span>
            </div>
        </footer>
    );
}
