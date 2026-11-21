import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory font-sans text-navy">
        <header className="border-b border-white/10 bg-navy text-white">
          <div className="container-site flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/admin" className="font-heading text-lg font-semibold tracking-wide">
              MTT <span className="text-gold">Admin</span>
            </Link>
            <Link href="/en" className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
              View public site
            </Link>
          </div>
        </header>
        <main className="container-site py-10">{children}</main>
      </body>
    </html>
  );
}
