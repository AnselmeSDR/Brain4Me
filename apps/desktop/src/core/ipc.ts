export type IpcBridge = {
    invoke<T = any>(channel: string, ...args: any[]): Promise<T>;
};

export function getIpc(): IpcBridge | null {
    const anyWin = window as any;

    if (anyWin.bridge?.invoke) {
        return {
            invoke: (channel: string, ...args: any[]) => anyWin.bridge.invoke(channel, ...args),
        } satisfies IpcBridge;
    }

    if (anyWin.api?.invoke) {
        return {
            invoke: (channel: string, ...args: any[]) => anyWin.api.invoke(channel, ...args),
        } satisfies IpcBridge;
    }

    if (anyWin.electron?.ipcRenderer?.invoke) {
        return {
            invoke: (channel: string, ...args: any[]) => anyWin.electron.ipcRenderer.invoke(channel, ...args),
        } satisfies IpcBridge;
    }

    return null;
}
