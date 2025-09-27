import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PluginHost from "@/routes/PluginHost";
import SettingsPage from "@/routes/Settings";
import { PluginStoreProvider } from "@/core/plugin-store";
import { Toaster } from "@/components/ui/toaster";
import { FontScaleProvider } from "@/components/providers/FontScaleProvider";

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true }}>
            <FontScaleProvider>
                <PluginStoreProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index
                                   element={
                                       <div className="p-6 text-sm text-muted-foreground">
                                           Bienvenue 👋 Sélectionne un plugin à gauche.
                                       </div>
                                   } />
                            <Route path="/plugin/:pluginId" element={<PluginHost />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                    </Routes>
                    <Toaster />
                </PluginStoreProvider>
            </FontScaleProvider>
        </BrowserRouter>
    );
}
