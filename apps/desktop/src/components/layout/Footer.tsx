import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { getIpc } from "@/core/ipc";
import { useFontScale } from "@/components/providers/FontScaleProvider";

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
    const { scale, setScale } = useFontScale();
    const zoomPercent = Math.round(scale * 100);
    const isDefaultZoom = Math.abs(scale - 1) <= 0.001;

    return (
        <footer className="bg-card/70 rounded-tr-[24px]"
            style={{ WebkitAppRegion: "no-drag" }}>
            <div
                className="flex h-[40px] min-h-[40px] shrink-0 items-center gap-[16px] rounded-t-[24px] border-t border-border/70 bg-background/70 px-[20px] text-[12px] shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
                <Link to="/settings"
                    className="flex items-center gap-[8px] text-muted-foreground transition-colors hover:text-foreground">
                    <Cog6ToothIcon aria-hidden className="h-[16px] w-[16px]" />
                    <span>Settings</span>
                </Link>
                <div className="ml-auto flex items-center gap-[16px] text-muted-foreground">
                    <span>RAM {metrics ? `${metrics.memoryMB} MB` : "--"}</span>
                    <span>CPU {metrics ? `${metrics.cpuPercent}%` : "--"}</span>
                    {!isDefaultZoom &&
                        <button
                            type="button"
                            className="rounded px-0 text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            onClick={() => {
                                void setScale(1);
                            }}
                            title="Réinitialiser le zoom à 100%"
                        >
                            {zoomPercent}%
                        </button>}
                </div>
            </div>
        </footer>
    );
}
