import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pluginSettings = sqliteTable("plugin_settings", {
  pluginId: text("plugin_id").primaryKey(),
  enabled: integer("enabled").notNull().default(0),
  settings: text("settings"),
});

export const settings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
});
