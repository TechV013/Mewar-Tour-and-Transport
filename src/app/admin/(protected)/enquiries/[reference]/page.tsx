import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEnquiryAction } from "@/app/admin/actions";
import { getEnquiryStore } from "@/lib/enquiries/store";
import { enquiryStatuses } from "@/lib/enquiries/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function labelFor(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default async function EnquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { reference } = await params;
  const { updated } = await searchParams;
  const record = await (await getEnquiryStore()).find(reference);
  if (!record) notFound();

  let paymentUrl: string | null = null;
  if (record.paymentLink) {
    try {
      const parsed = new URL(record.paymentLink);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        paymentUrl = record.paymentLink;
      }
    } catch {
      paymentUrl = null;
    }
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-[#8a662b] hover:underline">
        ← All enquiries
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">{record.reference}</h1>
          <p className="mt-2 text-sm text-navy/65">
            {record.service} enquiry received {formatDate(record.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold text-[#8a662b]">
          {record.status}
        </span>
      </div>

      {updated ? (
        <p className="mt-6 rounded-md border border-[#1d7a55]/30 bg-[#1d7a55]/5 p-4 text-sm text-[#1d7a55]" role="status">
          Enquiry updated.
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-navy/10 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold">Customer</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-navy/55">Name</dt>
              <dd className="mt-1 text-sm font-medium">{record.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-navy/55">Phone</dt>
              <dd className="mt-1 text-sm font-medium">{record.phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-navy/55">Email</dt>
              <dd className="mt-1 text-sm font-medium">{record.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-navy/55">Service</dt>
              <dd className="mt-1 text-sm font-medium capitalize">{record.service}</dd>
            </div>
          </dl>

          <h2 className="mt-8 font-heading text-lg font-semibold">Journey details</h2>
          <dl className="mt-4 divide-y divide-navy/5">
            {Object.entries(record.details).map(([key, value]) => (
              <div key={key} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                <dt className="text-xs font-medium text-navy/55">{labelFor(key)}</dt>
                <dd className="break-words text-sm text-navy">
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : value === "" || value === null || value === undefined
                      ? "—"
                      : String(value)}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 font-heading text-lg font-semibold">Payment link</h2>
          {!record.paymentLink ? (
            <p className="mt-3 text-sm text-navy/60">
              No payment link recorded yet. Add one below after sending a quotation.
            </p>
          ) : (
            <dl className="mt-4 space-y-3 rounded-lg border border-navy/10 bg-ivory/40 p-4">
              <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
                <dt className="text-xs font-medium text-navy/55">Payment URL</dt>
                <dd className="break-all text-sm text-navy">
                  {paymentUrl ? (
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8a662b] underline underline-offset-2"
                    >
                      {paymentUrl}
                    </a>
                  ) : (
                    <span>{record.paymentLink} (invalid URL)</span>
                  )}
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
                <dt className="text-xs font-medium text-navy/55">External reference</dt>
                <dd className="break-words text-sm text-navy">
                  {record.paymentReference || "—"}
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
                <dt className="text-xs font-medium text-navy/55">Added</dt>
                <dd className="text-sm text-navy">
                  {record.paymentLinkCreatedAt
                    ? formatDate(record.paymentLinkCreatedAt)
                    : "—"}
                </dd>
              </div>
              {record.paymentNote ? (
                <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
                  <dt className="text-xs font-medium text-navy/55">Internal note</dt>
                  <dd className="break-words text-sm text-navy">{record.paymentNote}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-navy/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold">Update enquiry</h2>
            <form action={updateEnquiryAction} className="mt-5 space-y-4">
              <input type="hidden" name="reference" value={record.reference} />
              <div>
                <label htmlFor="status" className="block text-xs font-semibold text-navy/75">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={record.status}
                  className="mt-1.5 h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold"
                >
                  {enquiryStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quotedAmount" className="block text-xs font-semibold text-navy/75">
                  Quoted amount (optional)
                </label>
                <input
                  id="quotedAmount"
                  name="quotedAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={record.quotedAmount ?? ""}
                  className="mt-1.5 h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold"
                />
              </div>
              <div className="border-t border-navy/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy/55">
                  Payment link (created outside this app)
                </p>
                <div className="mt-3">
                  <label htmlFor="paymentLink" className="block text-xs font-semibold text-navy/75">
                    Payment URL
                  </label>
                  <input
                    id="paymentLink"
                    name="paymentLink"
                    type="url"
                    maxLength={2000}
                    placeholder="https://..."
                    defaultValue={record.paymentLink ?? ""}
                    className="mt-1.5 h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold"
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="paymentReference" className="block text-xs font-semibold text-navy/75">
                    External payment reference
                  </label>
                  <input
                    id="paymentReference"
                    name="paymentReference"
                    type="text"
                    maxLength={120}
                    defaultValue={record.paymentReference ?? ""}
                    className="mt-1.5 h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold"
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="paymentNote" className="block text-xs font-semibold text-navy/75">
                    Payment note (internal)
                  </label>
                  <textarea
                    id="paymentNote"
                    name="paymentNote"
                    rows={2}
                    maxLength={2000}
                    defaultValue={record.paymentNote ?? ""}
                    className="mt-1.5 w-full rounded-md border border-navy/20 bg-white p-3 text-sm outline-none focus-visible:border-gold"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-navy/75">
                  Internal notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  maxLength={2000}
                  defaultValue={record.notes ?? ""}
                  className="mt-1.5 w-full rounded-md border border-navy/20 bg-white p-3 text-sm outline-none focus-visible:border-gold"
                />
              </div>
              <button
                type="submit"
                className="h-10 w-full rounded-md bg-navy text-sm font-semibold text-white transition-colors hover:bg-[#1b3555]"
              >
                Save update
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-navy/10 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold">Activity</h2>
            {record.events.length === 0 ? (
              <p className="mt-3 text-sm text-navy/60">No status changes yet.</p>
            ) : (
              <ol className="mt-4 space-y-4">
                {record.events.map((event) => (
                  <li key={event.id} className="border-l-2 border-gold pl-4">
                    <p className="text-sm font-medium">
                      {event.fromStatus ?? "Created"} → {event.toStatus}
                    </p>
                    <p className="mt-1 text-xs text-navy/55">{formatDate(event.createdAt)}</p>
                    {event.note ? (
                      <p className="mt-2 break-words text-sm text-navy/75">{event.note}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
