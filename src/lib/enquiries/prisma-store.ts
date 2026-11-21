import {
  Prisma,
  PrismaClient,
  type EnquiryService,
  type EnquiryStatus as PrismaEnquiryStatus,
} from "@prisma/client";
import type {
  CreateEnquiryInput,
  EnquiryRecord,
  EnquiryStore,
  EnquiryServiceValue,
  UpdateEnquiryInput,
} from "./types";

type EnquiryWithEvents = Prisma.EnquiryGetPayload<{
  include: { events: { orderBy: { createdAt: "asc" } } };
}>;

let client: PrismaClient | undefined;

function getClient() {
  if (!client) client = new PrismaClient();
  return client;
}

function mapRow(row: EnquiryWithEvents): EnquiryRecord {
  return {
    id: row.id,
    reference: row.reference,
    service: row.service.toLowerCase() as EnquiryServiceValue,
    name: row.name,
    phone: row.phone,
    email: row.email,
    details: row.details as Record<string, unknown>,
    status: row.status,
    notes: row.notes,
    quotedAmount:
      row.quotedAmount === null ? null : Number(row.quotedAmount.toString()),
    paymentLink: row.paymentLink,
    paymentReference: row.paymentReference,
    paymentNote: row.paymentNote,
    paymentLinkCreatedAt: row.paymentLinkCreatedAt
      ? row.paymentLinkCreatedAt.toISOString()
      : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    events: row.events.map((event) => ({
      id: event.id,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      note: event.note,
      actor: event.actor,
      createdAt: event.createdAt.toISOString(),
    })),
  };
}

const include = { events: { orderBy: { createdAt: "asc" as const } } };

export class PrismaEnquiryStore implements EnquiryStore {
  async ping(): Promise<void> {
    await getClient().$queryRaw`SELECT 1`;
  }

  async create(input: CreateEnquiryInput): Promise<EnquiryRecord> {
    const row = await getClient().enquiry.create({
      data: {
        reference: input.reference,
        service: input.service.toUpperCase() as EnquiryService,
        name: input.name,
        phone: input.phone,
        email: input.email,
        details: input.details as unknown as Prisma.InputJsonValue,
      },
      include,
    });
    return mapRow(row);
  }

  async list(): Promise<EnquiryRecord[]> {
    const rows = await getClient().enquiry.findMany({
      orderBy: { createdAt: "desc" },
      include,
    });
    return rows.map(mapRow);
  }

  async find(reference: string): Promise<EnquiryRecord | null> {
    const row = await getClient().enquiry.findUnique({
      where: { reference },
      include,
    });
    return row ? mapRow(row) : null;
  }

  async update(
    reference: string,
    input: UpdateEnquiryInput,
  ): Promise<EnquiryRecord | null> {
    const db = getClient();
    return db.$transaction(async (tx) => {
      const existing = await tx.enquiry.findUnique({ where: { reference } });
      if (!existing) return null;

      const data: Prisma.EnquiryUpdateInput = {};
      if (input.status) data.status = input.status as PrismaEnquiryStatus;
      if (input.notes !== undefined) data.notes = input.notes;
      if (input.quotedAmount !== undefined) data.quotedAmount = input.quotedAmount;

      if (input.paymentLink !== undefined) {
        const changed = input.paymentLink !== existing.paymentLink;
        data.paymentLink = input.paymentLink;
        data.paymentLinkCreatedAt = !changed
          ? undefined
          : input.paymentLink
            ? new Date()
            : null;
      }
      if (input.paymentReference !== undefined) {
        data.paymentReference = input.paymentReference;
      }
      if (input.paymentNote !== undefined) data.paymentNote = input.paymentNote;

      const row = await tx.enquiry.update({ where: { reference }, data, include });

      if (
        input.status &&
        input.status !== existing.status
      ) {
        await tx.enquiryEvent.create({
          data: {
            enquiryId: existing.id,
            fromStatus: existing.status,
            toStatus: input.status as PrismaEnquiryStatus,
            note: input.notes ?? null,
          },
        });
        const withEvents = await tx.enquiry.findUnique({
          where: { reference },
          include,
        });
        return withEvents ? mapRow(withEvents) : mapRow(row);
      }

      return mapRow(row);
    });
  }
}
