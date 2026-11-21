import { validateEnvironment } from "./env/rules.mjs";

type InternalReport = ReturnType<typeof validateEnvironment>;

export type EnvironmentReport = Omit<InternalReport, "values">;

// Environment variables do not change during a running process, so validate
// once and reuse the result. `values` stays internal because it holds secrets.
const internal: InternalReport = validateEnvironment(process.env);

export function getEnvironmentReport(): EnvironmentReport {
  const { ok, errors, warnings, config } = internal;
  return { ok, errors, warnings, config };
}

function read(key: string): string | undefined {
  const value: unknown = internal.values[key];
  return typeof value === "string" && value ? value : undefined;
}

export function getSiteUrl(): string {
  return internal.config.siteUrl;
}

export function hasDatabase(): boolean {
  return internal.config.database;
}

export function getDataFile(): string | undefined {
  return read("ENQUIRY_DATA_FILE");
}

export function getAdminToken(): string | null {
  return read("ADMIN_TOKEN") ?? null;
}

export function getAdminSessionSecret(): string | null {
  return read("ADMIN_SESSION_SECRET") ?? null;
}

export function getAdminCookieSecure(): boolean {
  const override = read("ADMIN_COOKIE_SECURE");
  if (override) return override === "true";
  return process.env.NODE_ENV === "production";
}

export function getWebhookConfig(): { url: string; secret: string | null } | null {
  const url = read("ENQUIRY_WEBHOOK_URL");
  if (!url) return null;
  return { url, secret: read("ENQUIRY_WEBHOOK_SECRET") ?? null };
}
