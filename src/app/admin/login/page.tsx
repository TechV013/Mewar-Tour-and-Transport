import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasAdminSession()) redirect("/admin");
  const { error } = await searchParams;
  const configured = isAdminConfigured();

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-heading text-3xl font-semibold">Admin sign in</h1>
      <p className="mt-3 text-sm text-navy/65">
        This area is for viewing and updating enquiries. It is not visible to visitors.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Admin access is not configured. Set ADMIN_TOKEN in the server environment.
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
          That token is not valid. Please try again.
        </p>
      ) : null}

      <form action={loginAction} className="mt-8 space-y-5 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="admin-token" className="block text-xs font-semibold text-navy/80">
            Admin token
          </label>
          <input
            id="admin-token"
            name="token"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 h-11 w-full rounded-md border border-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-gold focus-visible:ring-4 focus-visible:ring-gold/15"
          />
        </div>
        <button
          type="submit"
          className="h-11 w-full rounded-md bg-navy text-sm font-semibold text-white transition-colors hover:bg-[#1b3555]"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
