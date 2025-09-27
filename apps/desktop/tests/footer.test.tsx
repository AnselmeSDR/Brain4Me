import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

let mockScale = 1;
const mockSetScale = vi.fn();

vi.mock("../src/components/providers/FontScaleProvider", () => ({
    useFontScale: () => ({
        scale: mockScale,
        setScale: mockSetScale,
        min: 0.75,
        max: 1.5,
        step: 0.025,
    }),
}));

import Footer from "../src/components/layout/Footer";

function flush() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

function renderFooter() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
        root.render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
    });
    return {
        container,
        unmount() {
            act(() => root.unmount());
            container.remove();
        },
    };
}

describe("Footer zoom control", () => {
    beforeEach(() => {
        mockSetScale.mockReset();
        mockScale = 1;
        (window as any).system = {
            metrics: vi.fn().mockResolvedValue({ cpuPercent: 12.5, memoryMB: 256 }),
        };
    });

    afterEach(() => {
        delete (window as any).system;
    });

    it("renders without zoom button at 100%", async () => {
        const helpers = renderFooter();
        await act(async () => {
            await flush();
        });

        const button = helpers.container.querySelector('button[title="Réinitialiser le zoom à 100%"]');
        expect(button).toBeNull();
        const text = helpers.container.textContent ?? "";
        expect(text).not.toContain("Zoom");

        helpers.unmount();
    });

    it("shows reset control and calls setScale when zoom differs from 100%", async () => {
        mockScale = 1.2;
        const helpers = renderFooter();
        await act(async () => {
            await flush();
        });

        const button = helpers.container.querySelector('button[title="Réinitialiser le zoom à 100%"]');
        expect(button).not.toBeNull();
        expect(button?.textContent).toBe("120%");

        await act(async () => {
            button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(mockSetScale).toHaveBeenCalledWith(1);

        helpers.unmount();
    });
});
