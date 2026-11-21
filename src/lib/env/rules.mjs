import { z } from "zod";

const trimmed = z.string().trim();
const secret = trimmed.min(16, "Use at least 16 characters");
const httpUrl = trimmed
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "Use an http(s) URL");
const postgresUrl = trimmed
  .url()
  .refine(
    (value) => /^postgres(ql)?:\/\//i.test(value),
    "Use a postgres:// or postgresql:// URL",
  );

/** Treat an empty string as "not configured" for every optional variable. */
const optionalValue = (schema) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    schema.optional(),
  );

/** @type {Record<string, import("zod").ZodTypeAny>} */
export const envFields = {
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: optionalValue(postgresUrl),
  ENQUIRY_DATA_FILE: optionalValue(trimmed),
  ADMIN_TOKEN: optionalValue(secret),
  ADMIN_SESSION_SECRET: optionalValue(secret),
  ADMIN_COOKIE_SECURE: optionalValue(z.enum(["true", "false"])),
  ENQUIRY_WEBHOOK_URL: optionalValue(httpUrl),
  ENQUIRY_WEBHOOK_SECRET: optionalValue(secret),
  NEXT_PUBLIC_SITE_URL: optionalValue(httpUrl),
  NEXT_PUBLIC_HERO_IMAGE: optionalValue(
    trimmed.refine(
      (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
      "Use a root-relative path or an http(s) URL",
    ),
  ),
  NEXT_PUBLIC_BUSINESS_PHONE: optionalValue(trimmed),
  NEXT_PUBLIC_BUSINESS_WHATSAPP: optionalValue(trimmed),
  NEXT_PUBLIC_BUSINESS_EMAIL: optionalValue(trimmed.email()),
  NEXT_PUBLIC_BUSINESS_ADDRESS: optionalValue(trimmed),
  NEXT_PUBLIC_INSTAGRAM_URL: optionalValue(httpUrl),
  NEXT_PUBLIC_FACEBOOK_URL: optionalValue(httpUrl),
  NEXT_PUBLIC_LINKEDIN_URL: optionalValue(httpUrl),
};

/**
 * Validates each variable independently so one bad value does not hide the
 * rest. `values` is internal: secrets must never be serialised to a response.
 */
export function validateEnvironment(source = process.env) {
  /** @type {Record<string, unknown>} */
  const values = {};
  /** @type {string[]} */
  const errors = [];

  for (const [key, schema] of Object.entries(envFields)) {
    const parsed = schema.safeParse(source[key]);
    if (parsed.success) {
      values[key] = parsed.data;
    } else {
      errors.push(`${key}: ${parsed.error.issues[0]?.message ?? "invalid value"}`);
    }
  }

  const read = (key) =>
    typeof values[key] === "string" && values[key] ? values[key] : undefined;

  /** @type {string[]} */
  const warnings = [];
  const production = values.NODE_ENV === "production";
  const adminToken = read("ADMIN_TOKEN");
  const webhookUrl = read("ENQUIRY_WEBHOOK_URL");
  const webhookSecret = read("ENQUIRY_WEBHOOK_SECRET");

  if (production && !adminToken) {
    warnings.push("ADMIN_TOKEN is not set; admin routes will be disabled.");
  }
  if (adminToken && adminToken.length < 32) {
    warnings.push("ADMIN_TOKEN is short; use 32 or more random characters.");
  }
  if (webhookUrl && !webhookSecret) {
    warnings.push(
      "ENQUIRY_WEBHOOK_SECRET is not set; receivers cannot verify signatures.",
    );
  }
  if (production && !read("DATABASE_URL")) {
    warnings.push(
      "DATABASE_URL is not set; enquiries use a local JSON file that is not durable on serverless hosts.",
    );
  }
  if (!read("NEXT_PUBLIC_SITE_URL")) {
    warnings.push(
      "NEXT_PUBLIC_SITE_URL is not set; canonical URLs and the sitemap default to localhost.",
    );
  }
  if (production && read("ADMIN_COOKIE_SECURE") === "false") {
    warnings.push(
      "ADMIN_COOKIE_SECURE=false in production; use this only for local HTTP testing.",
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    values,
    config: {
      nodeEnv: values.NODE_ENV,
      admin: Boolean(adminToken),
      database: Boolean(read("DATABASE_URL")),
      fileFallback: !read("DATABASE_URL"),
      webhook: Boolean(webhookUrl),
      webhookSigned: Boolean(webhookUrl && webhookSecret),
      siteUrl: read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    },
  };
}
