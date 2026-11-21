/**
 * Minimal structured logging for server-side diagnostic hooks. Only an
 * allowlist of context keys is written, so customer details, tokens and webhook
 * payloads cannot reach logs by accident.
 */

const allowedContextKeys = [
  "reference",
  "requestId",
  "reason",
  "route",
  "service",
  "status",
] as const;

type LogValue = string | number | boolean | null | undefined;
type LogContext = Record<string, LogValue>;

function safeContext(context: LogContext): Record<string, LogValue> {
  const result: Record<string, LogValue> = {};
  for (const key of allowedContextKeys) {
    const value = context[key];
    if (value !== undefined) result[key] = value;
  }
  return result;
}

function errorName(error: unknown): string {
  if (error instanceof Error) return error.name;
  return typeof error === "string" ? "Error" : "UnknownError";
}

export function logServerError(
  scope: string,
  error: unknown,
  context: LogContext = {},
): void {
  const entry: Record<string, unknown> = {
    level: "error",
    scope,
    at: new Date().toISOString(),
    error: errorName(error),
    context: safeContext(context),
  };

  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    entry.developmentMessage = error.message;
  }

  console.error(JSON.stringify(entry));
}

export function logServerWarning(
  scope: string,
  reason: string,
  context: LogContext = {},
): void {
  console.warn(
    JSON.stringify({
      level: "warn",
      scope,
      at: new Date().toISOString(),
      reason,
      context: safeContext(context),
    }),
  );
}
