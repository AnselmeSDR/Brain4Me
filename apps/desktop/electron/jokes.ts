import { eq } from "drizzle-orm";

import { getDb, settings } from "./db";
import { log } from "node:console";

export const SUPPORTED_JOKE_LANGUAGES = ["de", "en", "es", "fr", "pt"] as const;
export type JokeLanguage = (typeof SUPPORTED_JOKE_LANGUAGES)[number];

export type JokeSettings = {
  enabled: boolean;
  language: JokeLanguage;
};

const DEFAULT_JOKE_SETTINGS: JokeSettings = {
  enabled: true,
  language: "fr",
};

let cachedJoke: { text: string; language: JokeLanguage; expiresAt: number } | null = null;

export function resolveJokeLanguage(value: string | undefined): JokeLanguage {
  return (SUPPORTED_JOKE_LANGUAGES as readonly string[]).includes(value ?? "")
    ? (value as JokeLanguage)
    : DEFAULT_JOKE_SETTINGS.language;
}

export async function readJokeSettings(): Promise<JokeSettings> {
  try {
    const db = getDb();
    const rows = await db.select().from(settings).where(eq(settings.key, "topbar.joke"));
    if (!rows.length || !rows[0].value) {
      return DEFAULT_JOKE_SETTINGS;
    }

    const parsed = JSON.parse(rows[0].value) as Partial<JokeSettings> | null;
    const enabled = typeof parsed?.enabled === "boolean" ? parsed.enabled : DEFAULT_JOKE_SETTINGS.enabled;
    const language = resolveJokeLanguage(parsed?.language as string | undefined);
    return { enabled, language };
  } catch (error) {
    console.warn("[jokes] failed to read joke settings", error);
    return DEFAULT_JOKE_SETTINGS;
  }
}

async function fetchJoke(language: JokeLanguage): Promise<string> {
  const endpoint = `https://v2.jokeapi.dev/joke/Any?lang=${language}`;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = (await response.json()) as {
      error?: boolean;
      type?: "single" | "twopart";
      joke?: string;
      setup?: string;
      delivery?: string;
      message?: string;
    };
    if (data.error) {
      throw new Error(data.message ?? "Joke API error");
    }
    if (data.type === "twopart" && data.setup && data.delivery) {
      return `${data.setup}\n${data.delivery}`;
    }
    return data.joke ?? "Joke indisponible pour le moment.";
  } catch (error) {
    console.error("[jokes] failed to fetch joke", error);
    return "Joke en pause — le serveur fait une sieste.";
  }
}

export async function getJoke(force = false): Promise<string | null> {
  const settings = await readJokeSettings();
  if (!settings.enabled) {
    cachedJoke = null;
    return null;
  }

  const now = Date.now();
  if (force) {
    cachedJoke = null;
  }

  if (!cachedJoke || cachedJoke.language !== settings.language || cachedJoke.expiresAt <= now) {
    const text = await fetchJoke(settings.language);
    cachedJoke = {
      text,
      language: settings.language,
      expiresAt: now + 1000 * 60 * 60,
    };
  }

  return cachedJoke.text;
}

export function invalidateJokeCache() {
  cachedJoke = null;
}
