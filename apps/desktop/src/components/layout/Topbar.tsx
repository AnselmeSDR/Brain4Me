import {appLogo} from "@/assets";

export default function Topbar() {
    return (
        <header className="bg-card/70 rounded-br-3xl"
                style={{WebkitAppRegion: "drag"}}>
            <div
                className="h-12 shrink-0 glass-surface flex items-center gap-3 rounded-b-3xl border-b border-border/70 bg-background/70 px-5 pl-20 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
                <div className="flex items-center gap-2 text-sm font-medium tracking-tight leading-none">
                    <img src={appLogo} alt="" className="h-6 w-6" draggable={false} />
                    <span>Brain4Me</span>
                </div>
                <div className="ml-auto text-xs text-muted-foreground leading-none">
                    Dev • Electron + Vite
                </div>
            </div>
        </header>
    );
}
