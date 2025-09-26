import type { Manifest } from "@/core/plugin-types";

const manifest: Manifest = {
  id: "calendar",
  name: "Calendrier",
  description: "Aperçu calendrier statique",
  entry: () => import("./index"),
};

export default manifest;
