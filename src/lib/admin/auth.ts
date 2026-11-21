import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminCookieSecure, getAdminSessionSecret, getAdminToken } from "@/lib/env";

const COOKIE_NAME = "mtt_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function sessionSecret(): string | null {
  const configured = getAdminSessionSecret();
  if (configured) return configured;
  const token = getAdminToken();
  if (!token) return null;
  return createHmac("sha256", token)
    .update("mtt-admin-session-secret")
    .digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminToken() && sessionSecret());
}

export function verifyAdminToken(token: string): boolean {
  const configured = getAdminToken();
  if (!configured) return false;
  const submitted = createHash("sha256").update(token).digest();
  const expected = createHash("sha256").update(configured).digest();
  return (
    submitted.length === expected.length && timingSafeEqual(submitted, expected)
  );
}

function safeEqualStrings(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signPayload(payload: string): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function hasAdminSession(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [version, expiresAt, signature] = value.split(".");
  if (version !== "v1" || !/^\d+$/.test(expiresAt ?? "")) return false;
  if (Number(expiresAt) <= Date.now()) return false;

  const expected = signPayload(`${version}.${expiresAt}`);
  return Boolean(expected && signature && safeEqualStrings(signature, expected));
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `v1.${expiresAt}`;
  const signature = signPayload(payload);
  if (!signature) throw new Error("Admin is not configured");

  const secure = getAdminCookieSecure();

  (await cookies()).set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
