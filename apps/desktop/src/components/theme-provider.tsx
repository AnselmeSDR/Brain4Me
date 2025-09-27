import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from "next-themes";

import { persistTheme, type Theme } from "@/core/theme-store";

const AVAILABLE_THEMES: Theme[] = ["light", "dark", "tahoe"];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
            themes={AVAILABLE_THEMES}
            value={{
                light: "light",
                dark: "dark",
                tahoe: "tahoe",
            }}
            {...props}
        >
            <ThemeSync>{children}</ThemeSync>
        </NextThemesProvider>
    );
}

function ThemeSync({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    React.useEffect(() => {
        if (!theme) {
            return;
        }

        const root = document.documentElement;

        if (theme === "tahoe") {
            root.setAttribute("data-theme", "tahoe");
        } else {
            root.removeAttribute("data-theme");
        }

        void persistTheme(theme as Theme);
    }, [theme]);

    return <>{children}</>;
}
