import type { Manifest } from "@/core/plugin-types";

const manifest: Manifest = {
  id: "hello",
  name: "Hello Plugin",
  description: "Plugin de démonstration",
  entry: () => import("./index")
};
export default manifest;
