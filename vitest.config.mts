import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

// Load .env.local if present
const envPath = path.resolve(import.meta.dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:startlite@localhost:5433/startlite";
process.env.BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET ||
  "test-secret-at-least-32-characters-long";
process.env.IP_HASH_SECRET =
  process.env.IP_HASH_SECRET || "test-ip-hash-secret-value-32-chars";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
  test: {
    include: ["lib/**/*.test.ts", "db/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", ".agents/**"],
  },
});
