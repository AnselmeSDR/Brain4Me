export default function Topbar() {
    return (
        <header className="h-12 shrink-0 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 flex items-center px-4">
            <div className="text-sm font-medium tracking-tight">Brain4Me</div>
            <div className="ml-auto text-xs text-muted-foreground">
                Dev • Electron + Vite
            </div>
        </header>
    );
}
