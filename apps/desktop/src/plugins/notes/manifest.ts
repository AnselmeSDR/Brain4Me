import type { Manifest } from "@/core/plugin-types";

const manifest: Manifest = {
  id: "notes",
  name: "Notes",
  description: "Bloc-notes local (exemple)",
  icon: "DocumentTextIcon",
  entry: () => import("./index"),
};

export default manifest;
