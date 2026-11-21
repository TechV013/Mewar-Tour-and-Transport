import { hasDatabase } from "@/lib/env";
import { FileEnquiryStore } from "./file-store";
import type { EnquiryStore } from "./types";

let store: EnquiryStore | undefined;

/**
 * Uses Neon/Postgres when DATABASE_URL is configured, otherwise a local JSON
 * file. The Prisma module is loaded lazily so builds and local runs work
 * without a database connection.
 */
export async function getEnquiryStore(): Promise<EnquiryStore> {
  if (store) return store;

  if (hasDatabase()) {
    const { PrismaEnquiryStore } = await import("./prisma-store");
    store = new PrismaEnquiryStore();
  } else {
    store = new FileEnquiryStore();
  }

  return store;
}
