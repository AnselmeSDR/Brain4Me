import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "@/core/plugin-registry";

export default function PluginHost() {
    const { pluginId } = useParams<{ pluginId?: string }>();
    const manifest = pluginId ? get(pluginId) : undefined;
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (manifest) {
            manifest.entry().then((mod) => {
                if (!cancelled) setComponent(() => mod.default);
            });
        } else {
            setComponent(null);
        }
        return () => {
            cancelled = true;
        };
    }, [manifest]);

    if (!manifest) {
        return (
            <main className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
                Plugin introuvable
            </main>
        );
    }

    if (!Component) {
        return (
            <main className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
                Chargement du plugin…
            </main>
        );
    }

    return (
        <main className="flex-1 space-y-4 p-6">
            <h1 className="text-2xl font-semibold tracking-tight">{manifest.name}</h1>
            <Component />
        </main>
    );
}
