import type { Manifest } from "./plugin-types";
import hello from "@/plugins/hello/manifest";

// Registre interne pour le MVP ; plus tard, on scannera un dossier /plugins
const manifests: Manifest[] = [
  // Plugins internes (démo)
  hello,
];

export function register(manifest: Manifest) {
  if (!manifests.find((p) => p.id === manifest.id)) {
    manifests.push(manifest);
  }
}
export function list(): Manifest[] { return manifests; }
export function get(id: string) { return manifests.find((p) => p.id === id); }
