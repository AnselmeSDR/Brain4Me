import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";

export default function Layout() {
    return (
        <div className="flex h-screen w-screen flex-col bg-background text-foreground">
            <Topbar />
            <div className="flex flex-1">
                <div className="w-60 shrink-0">
                    <Sidebar />
                </div>
                <main className="min-w-0 flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
