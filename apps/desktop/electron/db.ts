import fs from "node:fs";
import Database from "better-sqlite3";
import path from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { pluginSettings, settings } from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

function dbFile(): string {
  const dir = process.env.BRAIN4ME_DB_DIR ?? path.resolve(process.cwd(), "data");
  const file = process.env.BRAIN4ME_DB_FILE ?? "brain4me.sqlite";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, file);
}

export function getDb() {
  if (_db) return _db;
  const sqlite = new Database(dbFile());
  // bootstrap table
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS plugin_settings (plugin_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1, settings TEXT)"
  );
  sqlite.exec("CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT)");
  const columns = sqlite.prepare("PRAGMA table_info(plugin_settings)").all() as Array<{ name: string }>;
  if (!columns.some((col) => col.name === "settings")) {
    sqlite.exec("ALTER TABLE plugin_settings ADD COLUMN settings TEXT");
  }
  _db = drizzle(sqlite);
  return _db;
}

export { pluginSettings, settings };
