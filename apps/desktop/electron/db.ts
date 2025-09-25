import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { pluginSettings } from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

function dbFile(): string {
  const userDir = app.getPath("userData");
  return path.join(userDir, "data.db");
}

export function getDb() {
  if (_db) return _db;
  const sqlite = new Database(dbFile());
  // bootstrap table
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS plugin_settings (plugin_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1)"
  );
  _db = drizzle(sqlite);
  return _db;
}

export { pluginSettings };
