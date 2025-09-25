import type { Manifest } from "./plugin-types";

// Internal registry for MVP; later, scan userData/plugins
const manifests: Manifest[] = [];

// register internal demo plugins
export function register(manifest: Manifest) {
  manifests.push(manifest);
}
export function list(): Manifest[] { return manifests; }
export function get(id: string) { return manifests.find(p => p.id === id); }
