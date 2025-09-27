import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";

export default function Layout() {
    return (
        <div className="flex h-screen w-screen flex-col bg-background text-foreground">
            <Topbar />
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className="group/sidebar w-[64px] shrink-0 min-h-0 overflow-hidden transition-[width] duration-300 ease-out hover:w-[256px]">
                    <Sidebar />
                </div>
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
