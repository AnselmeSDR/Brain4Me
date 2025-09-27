import {useEffect, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "@/components/ui/use-toast";
import {usePluginStore} from "@/core/plugin-store";
import {type Theme} from "@/core/theme-store";
import {useTheme} from "next-themes";

const JOKE_LANGUAGES = [
    {value: "fr", label: "Français"},
    {value: "en", label: "English"},
    {value: "de", label: "Deutsch"},
    {value: "es", label: "Español"},
    {value: "pt", label: "Português"},
] as const;

type JokeLanguage = typeof JOKE_LANGUAGES[number]["value"];

const isJokeLanguage = (value: string): value is JokeLanguage =>
    JOKE_LANGUAGES.some((lang) => lang.value === value);

export default function SettingsPage() {
    const {plugins, loading, error, setPluginEnabled} = usePluginStore();
    const {theme: activeTheme, setTheme: applyTheme} = useTheme();
    const themeValue = (activeTheme ?? "system") as Theme;

    const [jokeEnabled, setJokeEnabled] = useState<boolean>(true);
    const [jokeLanguage, setJokeLanguage] = useState<JokeLanguage>("fr");
    const [jokeLoading, setJokeLoading] = useState<boolean>(true);

    useEffect(() => {
        let active = true;

        const loadJokeSettings = async () => {
            if (typeof window === "undefined" || !window.bridge?.invoke) {
                if (active) setJokeLoading(false);
                return;
            }
            try {
                const data = await window.bridge.invoke("settings:app:get", "topbar.joke");
                if (!active) return;
                const enabled = typeof data?.enabled === "boolean" ? data.enabled : true;
                const language = typeof data?.language === "string" && isJokeLanguage(data.language) ? data.language : "fr";
                setJokeEnabled(enabled);
                setJokeLanguage(language);
            } catch (err) {
                console.warn("[settings] failed to load joke settings", err);
            } finally {
                if (active) setJokeLoading(false);
            }
        };

        void loadJokeSettings();
        return () => {
            active = false;
        };
    }, []);

    const persistJokeSettings = async (next: {enabled: boolean; language: JokeLanguage}) => {
        if (typeof window === "undefined" || !window.bridge?.invoke) {
            return;
        }
        try {
            await window.bridge.invoke("settings:app:set", "topbar.joke", next);
            window.dispatchEvent(new Event("joke:refresh"));
        } catch (error) {
            console.error("[settings] failed to save joke settings", error);
            toast({
                variant: "destructive",
                title: "Impossible d'enregistrer les blagues",
                description: "Réessaie dans un instant.",
            });
            throw error;
        }
    };

    const handleJokeToggle = async (nextValue: boolean) => {
        const previous = {enabled: jokeEnabled, language: jokeLanguage};
        setJokeEnabled(nextValue);
        try {
            await persistJokeSettings({enabled: nextValue, language: previous.language});
        } catch {
            setJokeEnabled(previous.enabled);
        }
    };

    const handleJokeLanguageChange = async (value: JokeLanguage) => {
        const previous = {enabled: jokeEnabled, language: jokeLanguage};
        setJokeLanguage(value);
        try {
            await persistJokeSettings({enabled: previous.enabled, language: value});
        } catch {
            setJokeLanguage(previous.language);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <section className="mb-8 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle className="text-sm">Thème</CardTitle>
                            <CardDescription>Choisis comment Brain4Me se présente.</CardDescription>
                        </div>
                        <Select value={themeValue}
                                onValueChange={(value) => {
                                    applyTheme(value as Theme);
                                }}>
                            <SelectTrigger className="min-w-40">
                                <SelectValue placeholder="Sélectionne un thème" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="tahoe">Tahoe</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle className="text-sm">Blague du moment</CardTitle>
                            <CardDescription>Affiche une blague actualisée chaque heure.</CardDescription>
                        </div>
                        <Switch
                            checked={jokeEnabled}
                            onCheckedChange={(value) => {
                                void handleJokeToggle(value);
                            }}
                            disabled={jokeLoading}
                            aria-label="Activer la blague du moment"
                        />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pt-0">
                        <span className="text-xs font-medium text-muted-foreground">Langue</span>
                        {jokeLoading ? (
                            <Skeleton className="h-9 w-40" />
                        ) : (
                            <Select
                                value={jokeLanguage}
                                onValueChange={(value) => {
                                    if (isJokeLanguage(value)) {
                                        void handleJokeLanguageChange(value);
                                    }
                                }}
                            >
                                <SelectTrigger className="min-w-40" disabled={!jokeEnabled}>
                                    <SelectValue placeholder="Choisir une langue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOKE_LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {!jokeEnabled && !jokeLoading && (
                            <span className="text-xxs text-muted-foreground">Les blagues automatiques sont désactivées.</span>
                        )}
                    </CardContent>
                </Card>
            </section>
            <section>
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">Plugins</h2>
                {error && (
                    <Alert className="mb-3 border-destructive/60 bg-destructive/10 text-destructive">
                        <AlertTitle>Une erreur est survenue</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    {loading
                        ? Array.from({length: 3}).map((_, index) => (
                              <Card key={`plugin-skeleton-${index}`} className="px-4 py-3">
                                  <Skeleton className="h-5 w-40" />
                              </Card>
                          ))
                        : plugins.map((p) => (
                              <Card key={p.id} className="px-4 py-3">
                                  <CardContent className="flex items-center justify-between gap-4 p-0">
                                      <div>
                                          <div className="font-medium text-foreground">{p.name}</div>
                                          {p.description && (
                                              <CardDescription className="mt-1 text-xs text-muted-foreground">
                                                  {p.description}
                                              </CardDescription>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-3 text-sm">
                                          <span className="text-muted-foreground">
                                              {p.enabled ? "Activé" : "Désactivé"}
                                          </span>
                                          <Switch
                                              id={`plugin-${p.id}`}
                                              checked={p.enabled}
                                              onCheckedChange={async (nextValue) => {
                                                  await setPluginEnabled(p.id, nextValue);
                                              }}
                                              aria-label={`Activer ${p.name}`}
                                          />
                                      </div>
                                  </CardContent>
                              </Card>
                          ))}
                </div>
            </section>
        </div>
    );
}
