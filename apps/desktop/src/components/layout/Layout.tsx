import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function Layout() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
            <Topbar />
            <div className="flex h-[calc(100vh-3rem)]">
                <div className="w-60 shrink-0">
                    <Sidebar />
                </div>
                <main className="min-w-0 flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
