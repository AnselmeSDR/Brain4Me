import { useEffect, useState } from "react";

type HelloSettings = {
    name?: string;
    enabled?: boolean;
};

export default function HelloPlugin() {
    const [name, setName] = useState("");
    const [savedName, setSavedName] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        window.pluginSettings.get("hello").then((data: HelloSettings) => {
            if (!alive) return;
            if (data?.name) {
                setName(data.name);
                setSavedName(data.name);
            }
        });
        return () => {
            alive = false;
        };
    }, []);

    return (
        <div className="grid max-w-xl gap-4">
            <p className="text-sm text-muted-foreground">Bonjour depuis le plugin !</p>
            <label className="grid gap-1">
                <span className="text-sm font-medium text-foreground">Ton nom</span>
                <input
                    value={name}
                    onChange={e => {
                        setName(e.target.value);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
            </label>
            <button
                type="button"
                onClick={async () => {
                    setSavedName(name);
                    await window.pluginSettings.set("hello", { name });
                }}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                Sauvegarder
            </button>
            {savedName && (
                <p className="text-sm font-medium text-foreground">Salut, {savedName} 👋</p>
            )}
        </div>
    );
}
