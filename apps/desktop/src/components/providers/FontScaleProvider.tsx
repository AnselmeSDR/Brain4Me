import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

type SetScaleOptions = {
    persist?: boolean;
};

type FontScaleContextValue = {
    scale: number;
    setScale: (value: number, options?: SetScaleOptions) => Promise<void>;
    min: number;
    max: number;
    step: number;
};

const FontScaleContext = createContext<FontScaleContextValue | undefined>(undefined);

const MIN_SCALE = 0.75;
const MAX_SCALE = 1.5;
const STEP = 0.05;

const STORAGE_KEY = "ui.fontScale";

function clamp(value: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(value.toFixed(2))));
}

function applyScale(value: number) {
    document.documentElement.style.setProperty("--user-font-scale", value.toString());
}

async function persistScale(value: number) {
    if (window.bridge?.invoke) {
        try {
            await window.bridge.invoke("settings:app:set", STORAGE_KEY, value);
            return;
        } catch (error) {
            console.warn("[font-scale] failed to persist via bridge", error);
        }
    }
    localStorage.setItem(STORAGE_KEY, value.toString());
}

async function loadInitialScale(): Promise<number> {
    if (window.bridge?.invoke) {
        try {
            const stored = await window.bridge.invoke("settings:app:get", STORAGE_KEY);
            if (typeof stored === "number") {
                return clamp(stored);
            }
        } catch (error) {
            console.warn("[font-scale] failed to load via bridge", error);
        }
    }
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
        const parsed = Number.parseFloat(local);
        if (!Number.isNaN(parsed)) {
            return clamp(parsed);
        }
    }
    return 1;
}

export function FontScaleProvider({children}: {children: React.ReactNode}) {
    const [scale, setScaleState] = useState(1);
    const scaleRef = useRef(scale);

    const internalSetScale = useCallback(async (value: number, options: SetScaleOptions = {}) => {
        const {persist = true} = options;
        const next = clamp(value);
        setScaleState(next);
        scaleRef.current = next;
        applyScale(next);
        if (persist) {
            await persistScale(next);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        void loadInitialScale().then((initial) => {
            if (!mounted) return;
            setScaleState(initial);
            scaleRef.current = initial;
            applyScale(initial);
        });
        return () => {
            mounted = false;
            document.documentElement.style.removeProperty("--user-font-scale");
        };
    }, []);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (!event.ctrlKey) return;
            event.preventDefault();
            const direction = event.deltaY < 0 ? 1 : -1;
            const next = clamp(scaleRef.current + direction * STEP);
            if (next !== scaleRef.current) {
                void internalSetScale(next);
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (!event.ctrlKey) return;
            if (event.key === "0") {
                event.preventDefault();
                void internalSetScale(1);
            }
        };

        window.addEventListener("wheel", handleWheel, {passive: false});
        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKey);
        };
    }, [internalSetScale]);

    const value: FontScaleContextValue = {
        scale,
        setScale: internalSetScale,
        min: MIN_SCALE,
        max: MAX_SCALE,
        step: STEP,
    };

    return (
        <FontScaleContext.Provider value={value}>
            {children}
        </FontScaleContext.Provider>
    );
}

export function useFontScale() {
    const context = useContext(FontScaleContext);
    if (!context) {
        throw new Error("useFontScale must be used within a FontScaleProvider");
    }
    return context;
}
