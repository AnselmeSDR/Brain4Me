import {useEffect, useState} from "react";
import {appLogo} from "@/assets";
import {Skeleton} from "@/components/ui/skeleton";

const DISABLED_JOKE = "";
const FALLBACK_JOKE = "Pas de joke pour le moment — réessaie plus tard.";

async function fetchJoke(force = false): Promise<string | null> {
    if (typeof window === "undefined" || !window.system?.joke) {
        return FALLBACK_JOKE;
    }

    try {
        return await window.system.joke(force);
    } catch (error) {
        console.warn("[topbar] failed to load joke", error);
        return FALLBACK_JOKE;
    }
}

export default function Topbar() {
    const [joke, setJoke] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (typeof window === "undefined") {
            setJoke(FALLBACK_JOKE);
            return;
        }

        const load = async () => {
            const next = await fetchJoke();
            if (!cancelled) {
                if (next === null) {
                    setJoke(DISABLED_JOKE);
                } else {
                    setJoke(next ?? FALLBACK_JOKE);
                }
            }
        };

        void load();
        const interval = window.setInterval(load, 1000 * 60 * 60);
        const handleRefresh = () => {
            void load();
        };
        window.addEventListener("joke:refresh", handleRefresh);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
            window.removeEventListener("joke:refresh", handleRefresh);
        };
    }, []);

    return (
        <header className="bg-card/70 rounded-br-[24px]"
                style={{WebkitAppRegion: "drag"}}>
            <div
                className="glass-surface flex h-[48px] min-h-[48px] shrink-0 items-center gap-[12px] rounded-b-[24px] border-b border-border/70 bg-background/70 px-[20px] pl-[80px] shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
                <div className="flex items-center gap-[8px] text-[14px] font-medium tracking-tight leading-none">
                    <img src={appLogo} alt="" className="h-[24px] w-[24px]" draggable={false} />
                    <span>Brain4Me</span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        console.log("[topbar] joke refresh requested");
                        void fetchJoke(true).then((next) => {
                            if (next === null) {
                                setJoke(DISABLED_JOKE);
                            } else {
                                setJoke(next ?? FALLBACK_JOKE);
                            }
                        });
                    }}
                    className="ml-auto max-w-[448px] text-right text-[12px] text-muted-foreground leading-tight transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    style={{WebkitAppRegion: "no-drag"}}
                >
                    {joke === null ? (
                        <Skeleton className="ml-auto h-[12px] w-[192px]" />
                    ) : joke.length === 0 ? null : (
                        <span className="block whitespace-pre-line">{joke}</span>
                    )}
                </button>
            </div>
        </header>
    );
}
