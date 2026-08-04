import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Read Turso credentials from src/config.ts (same source the app uses). */
export function loadTursoFromConfig() {
  const text = readFileSync(path.join(root, "src/config.ts"), "utf8");
  const databaseUrl = text.match(/databaseUrl:\s*"([^"]+)"/)?.[1];
  const authToken = text.match(/authToken:\s*"([^"]+)"/)?.[1];

  if (!databaseUrl || !authToken) {
    throw new Error(
      "Could not read turso.databaseUrl / turso.authToken from src/config.ts",
    );
  }

  return { databaseUrl, authToken };
}
