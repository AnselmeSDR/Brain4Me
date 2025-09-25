import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PluginHost from "@/routes/PluginHost";
import SettingsPage from "@/routes/Settings";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index
                           element={
                               <div className="p-6 text-sm text-muted-foreground">
                                   Bienvenue 👋 Sélectionne un plugin à gauche.
                               </div>
                           } />
                    <Route path="/plugin/:id" element={<PluginHost />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
