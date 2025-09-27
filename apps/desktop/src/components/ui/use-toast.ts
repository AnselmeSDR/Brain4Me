import * as React from "react";

import { type ToastActionElement, type ToastProps } from "./toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export type ToastOptions = ToastProps & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};

export type ToasterToast = ToastOptions & {
    id: string;
};

type Action =
    | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
    | { type: typeof actionTypes.UPDATE_TOAST; toast: Partial<ToasterToast> }
    | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
    | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

interface State {
    toasts: ToasterToast[];
}

const initialState: State = {
    toasts: [],
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
                ),
            };

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
            }

            return {
                ...state,
                toasts: state.toasts.map((toast) =>
                    toastId === undefined || toast.id === toastId
                        ? {
                              ...toast,
                              open: false,
                          }
                        : toast
                ),
            };
        }

        case actionTypes.REMOVE_TOAST:
            if (!action.toastId) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
            };
    }
}

const listeners: Array<(state: State) => void> = [];

let memoryState = initialState;

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

export function toast({ ...props }: ToastOptions) {
    const id = genId();

    const update = (props: ToastOptions) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
        });

    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            duration: props.duration ?? 4000,
            onOpenChange: (open) => {
                props.onOpenChange?.(open);
                if (!open) {
                    dismiss();
                }
            },
        },
    });

    return {
        id,
        dismiss,
        update,
    };
}

export function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    };
}
