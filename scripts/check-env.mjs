import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateEnvironment } from "../src/lib/env/rules.mjs";

function parseEnvFile(raw) {
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const source = { ...process.env };

for (const file of [".env", ".env.local"]) {
  try {
    const raw = await readFile(path.join(process.cwd(), file), "utf8");
    // Real process variables win; file values only fill gaps.
    for (const [key, value] of Object.entries(parseEnvFile(raw))) {
      if (!(key in source)) source[key] = value;
    }
  } catch {
    // Missing env files are fine.
  }
}

const report = validateEnvironment(source);

console.log("Environment check");
console.log("-----------------");
console.log(`Status: ${report.ok ? "valid" : "invalid"}`);
console.log(`Node env: ${report.config.nodeEnv}`);
console.log(
  `Admin: ${report.config.admin ? "configured" : "disabled"} | Database: ${report.config.database ? "configured" : "local JSON fallback"} | Webhook: ${report.config.webhook ? (report.config.webhookSigned ? "configured + signed" : "configured but unsigned") : "disabled"}`,
);
console.log(`Canonical URL: ${report.config.siteUrl}`);

if (report.errors.length) {
  console.log("\nErrors:");
  for (const error of report.errors) console.log(`  - ${error}`);
}
if (report.warnings.length) {
  console.log("\nWarnings:");
  for (const warning of report.warnings) console.log(`  - ${warning}`);
}

process.exitCode = report.ok ? 0 : 1;
