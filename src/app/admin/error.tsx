"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin-client-error]", error.digest ?? "unknown");
  }, [error.digest]);

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-8 text-center">
      <h1 className="font-heading text-2xl font-semibold">
        The dashboard could not be loaded
      </h1>
      <p className="mt-3 text-sm text-navy/70">
        Please try again. If this keeps happening, check the server logs.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-md bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md border border-navy/25 px-5 text-sm font-semibold text-navy hover:bg-ivory"
        >
          Back to enquiries
        </Link>
      </div>
    </div>
  );
}
