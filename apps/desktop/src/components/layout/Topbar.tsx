import { appLogo } from "@/assets";

export default function Topbar() {
    return (
        <header
            className="h-12 shrink-0 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 glass-surface flex items-center gap-3 px-4 pl-20"
            style={{ WebkitAppRegion: "drag" }}
        >
            <div className="flex items-center gap-2 text-sm font-medium tracking-tight leading-none">
                <img src={appLogo} alt="" className="h-7 w-7" draggable={false} />
                <span>Brain4Me</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground leading-none">
                Dev • Electron + Vite
            </div>
        </header>
    );
}
