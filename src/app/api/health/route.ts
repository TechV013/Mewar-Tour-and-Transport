import { NextResponse } from "next/server";
import { getEnvironmentReport } from "@/lib/env";
import { getEnquiryStore } from "@/lib/enquiries/store";
import { logServerError } from "@/lib/observability/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const report = getEnvironmentReport();
  let storeStatus: "ok" | "unavailable" = "ok";

  try {
    await (await getEnquiryStore()).ping();
  } catch (error) {
    storeStatus = "unavailable";
    logServerError("health.store", error, { route: "/api/health" });
  }

  const healthy = report.ok && storeStatus === "ok";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checkedAt: new Date().toISOString(),
      store: storeStatus,
      config: report.config,
      errors: report.errors,
      warnings: report.warnings,
    },
    { status: healthy ? 200 : 503 },
  );
}
