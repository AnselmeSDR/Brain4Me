import { useEffect, useState } from "react";

// @ts-ignore (exposed by preload)
const { bridge } = window as any;

export default function HelloPlugin() {
    const [cfg, setCfg] = useState<any>({});
    const [name, setName] = useState("");

    useEffect(() => {
        bridge.settings.get("hello").then((c: any) => {
            setCfg(c);
            setName(c.name ?? "");
        });
    }, []);

    return (
        <div className="grid max-w-xl gap-4">
            <p className="text-sm text-muted-foreground">Bonjour depuis le plugin !</p>
            <label className="grid gap-1">
                <span className="text-sm font-medium text-foreground">Ton nom</span>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
            </label>
            <button
                type="button"
                onClick={async () => {
                    await bridge.settings.set("hello", { ...cfg, name });
                    bridge.ui.toast(`Sauvé: ${name}`);
                }}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                Sauvegarder
            </button>
            {name && (
                <p className="text-sm font-medium text-foreground">Salut, {name} 👋</p>
            )}
        </div>
    );
}
