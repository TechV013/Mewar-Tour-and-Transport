"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  createAdminSession,
  hasAdminSession,
  verifyAdminToken,
} from "@/lib/admin/auth";
import { getEnquiryStore } from "@/lib/enquiries/store";
import { enquiryStatuses } from "@/lib/enquiries/types";
import { logServerWarning } from "@/lib/observability/log";

export async function loginAction(formData: FormData) {
  const token = typeof formData.get("token") === "string" ? String(formData.get("token")) : "";
  if (!verifyAdminToken(token)) redirect("/admin/login?error=1");
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

const paymentLinkSchema = z.string().trim().max(2000).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
});

const updateSchema = z.object({
  reference: z.string().regex(/^MTT-[A-Z0-9]{6}$/),
  status: z.enum(enquiryStatuses),
  notes: z.string().trim().max(2000),
  quotedAmount: z.string().trim().refine(
    (value) =>
      value === "" ||
      (Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 10_000_000),
  ),
  paymentLink: paymentLinkSchema,
  paymentReference: z.string().trim().max(120),
  paymentNote: z.string().trim().max(2000),
});

export async function updateEnquiryAction(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin/login");

  const parsed = updateSchema.safeParse({
    reference: formData.get("reference"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
    quotedAmount: formData.get("quotedAmount") ?? "",
    paymentLink: formData.get("paymentLink") ?? "",
    paymentReference: formData.get("paymentReference") ?? "",
    paymentNote: formData.get("paymentNote") ?? "",
  });
  if (!parsed.success) {
    logServerWarning("admin.update", "invalid update payload", {
      route: "/admin",
    });
    redirect("/admin?error=invalid");
  }

  const optional = (value: string) => (value === "" ? null : value);
  const store = await getEnquiryStore();
  const updated = await store.update(parsed.data.reference, {
    status: parsed.data.status,
    notes: parsed.data.notes,
    quotedAmount:
      parsed.data.quotedAmount === "" ? null : Number(parsed.data.quotedAmount),
    paymentLink: optional(parsed.data.paymentLink),
    paymentReference: optional(parsed.data.paymentReference),
    paymentNote: optional(parsed.data.paymentNote),
  });
  if (!updated) {
    logServerWarning("admin.update", "enquiry not found", {
      reference: parsed.data.reference,
    });
    redirect("/admin?error=missing");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${updated.reference}`);
  redirect(`/admin/enquiries/${updated.reference}?updated=1`);
}
