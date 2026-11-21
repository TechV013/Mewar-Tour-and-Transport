import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The public API accepts the same payload the forms already send, but rechecks
 * every field on the server and bounds its size before anything is stored.
 */
export const serverEnquirySchema = z.object({
  service: z.enum(["taxi", "bus", "car", "contact"]),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  details: z
    .record(z.string(), z.unknown())
    .superRefine((value, ctx) => {
      if (JSON.stringify(value).length > 8000) {
        ctx.addIssue({
          code: "custom",
          message: "Enquiry details are too large",
        });
      }
      for (const [key, item] of Object.entries(value)) {
        if (key.length > 80 || (typeof item === "string" && item.length > 2000)) {
          ctx.addIssue({
            code: "custom",
            message: "Enquiry detail field is too large",
            path: [key],
          });
        }
      }
    }),
});

export function extractEmail(details: Record<string, unknown>): string | null {
  const value = details.email;
  if (typeof value !== "string") return null;
  const email = value.trim();
  return email !== "" && emailPattern.test(email) ? email : null;
}
