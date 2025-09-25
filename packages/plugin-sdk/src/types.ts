export type SettingsSchema = Record<string, any>;

export interface PluginManifest {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  entry: () => Promise<{ default: React.ComponentType<any> }>;
  settingsSchema?: SettingsSchema;
  coreApiVersion?: string;
}
