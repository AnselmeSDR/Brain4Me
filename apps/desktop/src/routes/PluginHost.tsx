import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "@/core/plugin-registry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
            <main className="flex flex-1 items-center justify-center p-6">
                <Alert className="max-w-md border-destructive/60 bg-destructive/10 text-destructive">
                    <AlertTitle>Plugin introuvable</AlertTitle>
                    <AlertDescription>
                        Vérifie que le plugin est bien installé et activé dans les paramètres.
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    if (!Component) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full max-w-xl" />
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
