import type { ReactNode } from "react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";

let mockScale = 1;
const mockSetScale = vi.fn();

vi.mock("../src/core/plugin-store", () => ({
    usePluginStore: () => ({
        plugins: [],
        loading: false,
        error: null,
        setPluginEnabled: vi.fn(),
    }),
    PluginStoreContext: {
        Provider: ({ children }: { children: ReactNode }) => <>{children}</>,
    },
}));

vi.mock("../src/components/ui/switch", () => ({
    Switch: ({ ...props }: any) => <input type="checkbox" {...props} />,
}));

vi.mock("../src/components/ui/button", () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("../src/components/ui/card", () => {
    const Wrapper = ({ children }: any) => <div>{children}</div>;
    return {
        Card: Wrapper,
        CardContent: Wrapper,
        CardDescription: ({ children }: any) => <p>{children}</p>,
        CardHeader: Wrapper,
        CardTitle: ({ children }: any) => <h3>{children}</h3>,
    };
});

vi.mock("../src/components/ui/alert", () => {
    const Wrapper = ({ children }: any) => <div>{children}</div>;
    return {
        Alert: Wrapper,
        AlertDescription: Wrapper,
        AlertTitle: Wrapper,
    };
});

vi.mock("../src/components/ui/select", () => {
    const Wrapper = ({ children, ...props }: any) => <div {...props}>{children}</div>;
    return {
        Select: Wrapper,
        SelectContent: Wrapper,
        SelectItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        SelectTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        SelectValue: Wrapper,
    };
});

vi.mock("../src/components/ui/skeleton", () => ({
    Skeleton: () => <div data-testid="skeleton" />,
}));

vi.mock("../src/components/ui/slider", () => ({
    Slider: ({ children }: any) => <div data-testid="slider">{children}</div>,
}));

vi.mock("../src/components/ui/use-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("../src/components/icons/PluginIcon", () => ({
    PluginIcon: () => null,
}));

vi.mock("next-themes", () => ({
    useTheme: () => ({
        theme: "light",
        setTheme: vi.fn(),
    }),
}));

vi.mock("../src/components/providers/FontScaleProvider", () => ({
    useFontScale: () => ({
        scale: mockScale,
        setScale: mockSetScale,
        min: 0.75,
        max: 1.5,
        step: 0.025,
    }),
}));

import SettingsPage from "../src/routes/Settings";

function flush() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

function renderSettings() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
        root.render(<SettingsPage />);
    });
    return {
        container,
        async flushAsync() {
            await act(async () => {
                await flush();
            });
        },
        unmount() {
            act(() => root.unmount());
            container.remove();
        },
    };
}

describe("Settings font scale controls", () => {
    beforeEach(() => {
        mockScale = 1;
        mockSetScale.mockReset();
        (window as any).bridge = {
            invoke: vi.fn().mockResolvedValue({ enabled: true, language: "fr" }),
        };
    });

    afterEach(() => {
        delete (window as any).bridge;
    });

    it("shows reset icon even when scale is 100%", async () => {
        const helpers = renderSettings();
        await helpers.flushAsync();

        const resetButton = helpers.container.querySelector('[aria-label="Réinitialiser le zoom"]');
        expect(resetButton).not.toBeNull();

        helpers.unmount();
    });

    it("calls setScale when reset icon is clicked", async () => {
        mockScale = 1.2;
        const helpers = renderSettings();
        await helpers.flushAsync();

        const resetButton = helpers.container.querySelector('[aria-label="Réinitialiser le zoom"]') as HTMLButtonElement | null;
        expect(resetButton).not.toBeNull();

        await act(async () => {
            resetButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(mockSetScale).toHaveBeenCalledWith(1);

        helpers.unmount();
    });
});
