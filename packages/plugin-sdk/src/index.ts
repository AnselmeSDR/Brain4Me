export * from "./types";

export interface SDK {
  ui: {
    toast(msg: string): void;
  };
  settings: {
    get<T = unknown>(): Promise<T>;
    set<T = unknown>(values: T): Promise<void>;
  };
}

export function createSDK(impl: SDK): SDK {
  return impl;
}
