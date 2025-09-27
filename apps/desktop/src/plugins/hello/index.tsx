import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {toast} from "@/components/ui/use-toast";

type HelloSettings = {
    name?: string;
    enabled?: boolean;
};

export default function HelloPlugin() {
    const [name, setName] = useState("");
    const [savedName, setSavedName] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{type: "success" | "error"; message: string} | null>(null);

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

    useEffect(() => {
        if (!feedback) return;
        const timer = window.setTimeout(() => {
            setFeedback(null);
        }, 4000);
        return () => {
            window.clearTimeout(timer);
        };
    }, [feedback]);

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
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    onClick={async () => {
                        try {
                            await window.pluginSettings.set("hello", {name});
                            setSavedName(name);
                            setFeedback({type: "success", message: "Nom sauvegardé avec succès."});
                        } catch (error) {
                            const message = error instanceof Error ? error.message : "Sauvegarde impossible.";
                            setFeedback({type: "error", message});
                        }
                    }}
                >
                    Sauvegarder
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        toast({
                            variant: "success",
                            title: "Succès",
                            description: "Action de démonstration réussie.",
                        });
                    }}
                >
                    Déclencher un succès
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: "Une erreur de démonstration est survenue.",
                        });
                    }}
                >
                    Déclencher une erreur
                </Button>
            </div>
            {feedback && (
                <Alert
                    className={`mt-1 ${
                        feedback.type === "success"
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-700"
                            : "border-destructive/60 bg-destructive/10 text-destructive"
                    }`}
                >
                    <AlertTitle>{feedback.type === "success" ? "Succès" : "Erreur"}</AlertTitle>
                    <AlertDescription>{feedback.message}</AlertDescription>
                </Alert>
            )}
            {savedName && (
                <p className="text-sm font-medium text-foreground">Salut, {savedName} 👋</p>
            )}
        </div>
    );
}
