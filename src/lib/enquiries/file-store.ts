import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getDataFile } from "@/lib/env";
import type {
  EnquiryRecord,
  EnquiryStore,
  CreateEnquiryInput,
  UpdateEnquiryInput,
} from "./types";

/**
 * Zero-config fallback used while DATABASE_URL is not set. All access is
 * serialized because Next.js can handle concurrent requests in one process.
 */
export class FileEnquiryStore implements EnquiryStore {
  private queue: Promise<unknown> = Promise.resolve();

  private get filePath() {
    return getDataFile() || path.join(process.cwd(), ".data", "enquiries.json");
  }

  private serialize<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task, task);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async readAll(): Promise<EnquiryRecord[]> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as EnquiryRecord[]) : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  private async writeAll(records: EnquiryRecord[]) {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(records, null, 2), "utf8");
  }

  async ping(): Promise<void> {
    await this.readAll();
  }

  async create(input: CreateEnquiryInput): Promise<EnquiryRecord> {
    return this.serialize(async () => {
      const records = await this.readAll();
      const now = new Date().toISOString();
      const record: EnquiryRecord = {
        id: randomUUID(),
        reference: input.reference,
        service: input.service,
        name: input.name,
        phone: input.phone,
        email: input.email,
        details: input.details,
        status: "NEW",
        notes: null,
        quotedAmount: null,
        paymentLink: null,
        paymentReference: null,
        paymentNote: null,
        paymentLinkCreatedAt: null,
        createdAt: now,
        updatedAt: now,
        events: [],
      };
      records.push(record);
      await this.writeAll(records);
      return record;
    });
  }

  async list(): Promise<EnquiryRecord[]> {
    return this.serialize(async () => {
      const records = await this.readAll();
      return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
  }

  async find(reference: string): Promise<EnquiryRecord | null> {
    return this.serialize(async () => {
      const records = await this.readAll();
      return records.find((item) => item.reference === reference) ?? null;
    });
  }

  async update(
    reference: string,
    input: UpdateEnquiryInput,
  ): Promise<EnquiryRecord | null> {
    return this.serialize(async () => {
      const records = await this.readAll();
      const index = records.findIndex((item) => item.reference === reference);
      if (index < 0) return null;

      const current = records[index];
      const now = new Date().toISOString();
      const paymentLink =
        input.paymentLink === undefined ? current.paymentLink : input.paymentLink;
      const paymentLinkChanged = paymentLink !== (current.paymentLink ?? null);

      const updated: EnquiryRecord = {
        ...current,
        status: input.status ?? current.status,
        notes: input.notes ?? current.notes,
        quotedAmount:
          input.quotedAmount === undefined
            ? current.quotedAmount
            : input.quotedAmount,
        paymentLink,
        paymentReference:
          input.paymentReference === undefined
            ? current.paymentReference ?? null
            : input.paymentReference,
        paymentNote:
          input.paymentNote === undefined
            ? current.paymentNote ?? null
            : input.paymentNote,
        paymentLinkCreatedAt: paymentLinkChanged
          ? paymentLink
            ? now
            : null
          : current.paymentLinkCreatedAt ?? null,
        updatedAt: now,
        events: current.events ?? [],
      };

      if (updated.status !== current.status || updated.notes !== current.notes) {
        updated.events = [
          ...updated.events,
          {
            id: randomUUID(),
            fromStatus: current.status,
            toStatus: updated.status,
            note: updated.notes !== current.notes ? updated.notes : null,
            actor: "admin",
            createdAt: updated.updatedAt,
          },
        ];
      }

      records[index] = updated;
      await this.writeAll(records);
      return updated;
    });
  }
}
