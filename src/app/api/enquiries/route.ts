import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { logServerError } from "@/lib/observability/log";
import { clientIp, checkRateLimit } from "@/lib/security/rate-limit";
import { getEnquiryStore } from "@/lib/enquiries/store";
import { notifyEnquiry } from "@/lib/enquiries/webhook";
import {
  extractEmail,
  serverEnquirySchema,
} from "@/lib/validations/enquiry-server";

export const runtime = "nodejs";

function createReference() {
  return `MTT-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function respond(
  body: { message?: string; reference?: string; receivedAt?: string; status?: string },
  status: number,
  requestId: string,
) {
  const response = NextResponse.json(body, { status });
  response.headers.set("x-request-id", requestId);
  return response;
}

export async function POST(request: Request) {
  const headerId = request.headers.get("x-request-id")?.trim();
  const requestId = headerId ? headerId.slice(0, 64) : randomUUID();

  if (!checkRateLimit(`enquiry:${clientIp(request)}`)) {
    return respond(
      { message: "Too many requests. Please try again later." },
      429,
      requestId,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return respond({ message: "Invalid JSON body" }, 400, requestId);
  }

  const result = serverEnquirySchema.safeParse(payload);
  if (!result.success) {
    return respond({ message: "Invalid enquiry details" }, 400, requestId);
  }

  try {
    const store = await getEnquiryStore();
    let reference = createReference();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (!(await store.find(reference))) break;
      reference = createReference();
    }

    const { service, name, phone, details } = result.data;
    const record = await store.create({
      reference,
      service,
      name,
      phone,
      email: extractEmail(details),
      details,
    });

    await notifyEnquiry(record);

    return respond(
      {
        reference: record.reference,
        receivedAt: record.createdAt,
        status: "New",
      },
      201,
      requestId,
    );
  } catch (error) {
    logServerError("enquiry.create", error, { requestId });
    return respond(
      { message: "Unable to store the enquiry right now" },
      500,
      requestId,
    );
  }
}
