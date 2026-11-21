import { createHmac } from "node:crypto";
import { getWebhookConfig } from "@/lib/env";
import { logServerWarning } from "@/lib/observability/log";
import type { EnquiryRecord } from "./types";

/**
 * Best-effort notification. A webhook failure never blocks or rolls back an
 * enquiry, and neither the URL, payload, nor secret is written to logs.
 */
export async function notifyEnquiry(record: EnquiryRecord): Promise<void> {
  const config = getWebhookConfig();
  if (!config) return;
  const { url, secret } = config;

  const body = JSON.stringify({
    type: "enquiry.created",
    createdAt: new Date().toISOString(),
    data: {
      reference: record.reference,
      service: record.service,
      name: record.name,
      phone: record.phone,
      email: record.email,
      details: record.details,
      status: record.status,
      enquiryCreatedAt: record.createdAt,
    },
  });

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "user-agent": "mtt-enquiry-webhook/1",
  };
  if (secret) {
    headers["x-mtt-signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      logServerWarning("enquiry.webhook", "delivery failed", {
        reference: record.reference,
        status: response.status,
      });
    }
  } catch {
    logServerWarning("enquiry.webhook", "delivery failed", {
      reference: record.reference,
    });
  }
}
