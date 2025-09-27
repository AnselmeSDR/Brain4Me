import {Switch} from "@/components/ui/switch";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
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
            <section className="mb-8 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                            <CardTitle className="text-sm">Theme</CardTitle>
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
