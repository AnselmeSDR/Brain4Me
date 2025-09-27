import {Switch} from "@/components/ui/switch";
import {usePluginStore} from "@/core/plugin-store";
import {type Theme} from "@/core/theme-store";
import {useTheme} from "next-themes";

export default function SettingsPage() {
    const {plugins, loading, error, setPluginEnabled} = usePluginStore();
    const {theme: activeTheme, setTheme: applyTheme} = useTheme();
    const themeValue = (activeTheme ?? "system") as Theme;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <section className="mb-8">
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">Appearance</h2>
                <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
                    <label className="flex items-center gap-4 text-sm">
                        <span className="w-32 text-foreground">Theme</span>
                        <select
                            className="min-w-44 rounded-xl border border-border/60 bg-background/90 px-3 py-2 text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                            value={themeValue}
                            onChange={({currentTarget}) => {
                                applyTheme(currentTarget.value as Theme);
                            }}
                        >
                            <option value="system">System</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="tahoe">Tahoe</option>
                        </select>
                    </label>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">Plugins</h2>
                {error && <div className="mb-3 text-xs text-destructive">{error}</div>}
                <div className="space-y-2">
                    {(loading ? [] : plugins).map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm"
                        >
                            <div>
                                <div className="font-medium text-foreground">{p.name}</div>
                                {p.description && (
                                    <div className="text-xs text-muted-foreground">{p.description}</div>
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
                        </div>
                    ))}
                </div>
                {loading && <div className="py-4 text-xs text-muted-foreground">Chargement…</div>}
            </section>
        </div>
    );
}
