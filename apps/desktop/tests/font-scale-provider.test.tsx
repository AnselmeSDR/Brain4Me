import type { ReactElement } from "react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { FontScaleProvider, useFontScale } from "../src/components/providers/FontScaleProvider";

function flush() {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}

function renderWithProvider(children: ReactElement) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
        root.render(<FontScaleProvider>{children}</FontScaleProvider>);
    });
    return {
        container,
        root,
        unmount() {
            act(() => {
                root.unmount();
            });
            container.remove();
        },
    };
}

function ScaleConsumer({ onReady }: { onReady?: (value: ReturnType<typeof useFontScale>) => void }) {
    const value = useFontScale();
    onReady?.(value);
    return <span data-testid="scale">{value.scale}</span>;
}

describe("FontScaleProvider", () => {
    beforeEach(() => {
        localStorage.clear();
        delete (window as any).bridge;
        document.documentElement.style.removeProperty("--user-font-scale");
    });

    afterEach(() => {
        delete (window as any).bridge;
        document.documentElement.style.removeProperty("--user-font-scale");
    });

    it("loads persisted scale via bridge and applies css variable", async () => {
        const invoke = vi.fn((channel: string) => {
            if (channel === "settings:app:get") return Promise.resolve(1.25);
            return Promise.resolve();
        });
        (window as any).bridge = { invoke };

        const { container, unmount } = renderWithProvider(<ScaleConsumer />);
        await act(async () => {
            await flush();
        });

        const node = container.querySelector("[data-testid=scale]");
        expect(node?.textContent).toBe("1.25");
        expect(document.documentElement.style.getPropertyValue("--user-font-scale")).toBe("1.25");
        expect(invoke).toHaveBeenCalledWith("settings:app:get", "ui.fontScale");

        unmount();
    });

    it("clamps values and persists when setScale is called", async () => {
        const calls: Array<{ channel: string; args: any[] }> = [];
        (window as any).bridge = {
            invoke: vi.fn((channel: string, ...args: any[]) => {
                calls.push({ channel, args });
                if (channel === "settings:app:get") {
                    return Promise.resolve(1);
                }
                return Promise.resolve();
            }),
        };

        let currentContext: ReturnType<typeof useFontScale> | null = null;

        const helpers = renderWithProvider(
            <ScaleConsumer
                onReady={(ctx) => {
                    currentContext = ctx;
                }}
            />
        );
        await act(async () => {
            await flush();
        });

        expect(currentContext).not.toBeNull();
        await act(async () => {
            await currentContext!.setScale(5);
        });
        await act(async () => {
            await flush();
        });

        expect(
            calls.some(
                (entry) =>
                    entry.channel === "settings:app:set" && entry.args[0] === "ui.fontScale" && entry.args[1] === 1.5
            )
        ).toBe(true);
        const cssValue = document.documentElement.style.getPropertyValue("--user-font-scale");
        expect(cssValue).toBe("1.5");

        helpers.unmount();
    });

    it("responds to ctrl+wheel zoom gestures", async () => {
        const helpers = renderWithProvider(<ScaleConsumer />);
        await act(async () => {
            await flush();
        });

        await act(async () => {
            window.dispatchEvent(new WheelEvent("wheel", { deltaY: -120, ctrlKey: true }));
            await flush();
        });

        const value = parseFloat(document.documentElement.style.getPropertyValue("--user-font-scale"));
        expect(value).toBeCloseTo(1.02, 2);

        helpers.unmount();
    });

    it("resets to default on ctrl+0", async () => {
        const helpers = renderWithProvider(<ScaleConsumer />);
        await act(async () => {
            await flush();
        });

        await act(async () => {
            window.dispatchEvent(new WheelEvent("wheel", { deltaY: -120, ctrlKey: true }));
            await flush();
        });

        const preReset = parseFloat(document.documentElement.style.getPropertyValue("--user-font-scale"));
        expect(preReset).toBeGreaterThan(1);

        await act(async () => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "0", ctrlKey: true }));
            await flush();
        });

        const value = parseFloat(document.documentElement.style.getPropertyValue("--user-font-scale"));
        expect(value).toBeCloseTo(1, 2);

        helpers.unmount();
    });
});
