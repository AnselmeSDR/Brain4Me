import { register } from "./plugin-registry";
import hello from "@/plugins/hello/manifest";

export function registerInternalPlugins() {
  register(hello);
}
