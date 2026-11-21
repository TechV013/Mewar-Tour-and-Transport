import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { hasAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await hasAdminSession())) redirect("/admin/login");

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
