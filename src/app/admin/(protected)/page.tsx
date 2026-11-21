import Link from "next/link";
import { getEnquiryStore } from "@/lib/enquiries/store";
import {
  enquiryServices,
  enquiryStatuses,
  type EnquiryRecord,
} from "@/lib/enquiries/types";

export const dynamic = "force-dynamic";

type Search = {
  status?: string;
  service?: string;
  q?: string;
  error?: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildHref(search: Search, changes: Partial<Search>) {
  const next = new URLSearchParams();
  const merged = { ...search, ...changes };
  for (const [key, value] of Object.entries(merged)) {
    if (value) next.set(key, value);
  }
  const query = next.toString();
  return query ? `/admin?${query}` : "/admin";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const search = await searchParams;
  const records = await (await getEnquiryStore()).list();

  const status = enquiryStatuses.find((item) => item === search.status);
  const service = enquiryServices.find((item) => item === search.service);
  const query = search.q?.trim().toLowerCase() ?? "";

  const filtered: EnquiryRecord[] = records.filter((item) => {
    if (status && item.status !== status) return false;
    if (service && item.service !== service) return false;
    if (!query) return true;
    return [item.reference, item.name, item.phone, item.email ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Enquiries</h1>
          <p className="mt-2 text-sm text-navy/65">
            {records.length} received · {records.filter((item) => item.status === "NEW").length} awaiting review
          </p>
        </div>
        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            aria-label="Search enquiries by reference, name or phone"
            defaultValue={search.q ?? ""}
            placeholder="Reference, name or phone"
            className="h-10 w-64 rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold"
          />
          {status ? <input type="hidden" name="status" value={status} /> : null}
          {service ? <input type="hidden" name="service" value={service} /> : null}
          <button type="submit" className="h-10 rounded-md bg-navy px-4 text-sm font-medium text-white">
            Search
          </button>
        </form>
      </div>

      {search.error ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
          The requested update could not be completed.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Link
          href={buildHref(search, { status: undefined })}
          className={`rounded-full border px-3 py-1.5 ${!status ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-navy"}`}
        >
          All statuses
        </Link>
        {enquiryStatuses.map((item) => (
          <Link
            key={item}
            href={buildHref(search, { status: item })}
            className={`rounded-full border px-3 py-1.5 ${status === item ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-navy"}`}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-navy/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-navy/10 bg-ivory text-xs uppercase tracking-wide text-navy/60">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-navy/60">
                  No enquiries match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.reference} className="border-b border-navy/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${item.reference}`}
                      className="font-medium text-[#8a662b] underline-offset-4 hover:underline"
                    >
                      {item.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{item.service}</td>
                  <td className="px-4 py-3">
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-xs text-navy/55">{item.phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-medium text-[#8a662b]">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy/65">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {enquiryServices.map((item) => (
          <Link
            key={item}
            href={buildHref(search, { service: service === item ? undefined : item })}
            className={`rounded-full border px-3 py-1.5 capitalize ${service === item ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-navy"}`}
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
