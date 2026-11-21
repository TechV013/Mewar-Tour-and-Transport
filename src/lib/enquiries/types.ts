export const enquiryServices = ["taxi", "bus", "car", "contact"] as const;
export type EnquiryServiceValue = (typeof enquiryServices)[number];

export const enquiryStatuses = [
  "NEW",
  "QUOTED",
  "CONFIRMED",
  "CANCELLED",
] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryEventRecord = {
  id: string;
  fromStatus: EnquiryStatus | null;
  toStatus: EnquiryStatus;
  note: string | null;
  actor: string;
  createdAt: string;
};

export type EnquiryRecord = {
  id: string;
  reference: string;
  service: EnquiryServiceValue;
  name: string;
  phone: string;
  email: string | null;
  details: Record<string, unknown>;
  status: EnquiryStatus;
  notes: string | null;
  quotedAmount: number | null;
  paymentLink: string | null;
  paymentReference: string | null;
  paymentNote: string | null;
  paymentLinkCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  events: EnquiryEventRecord[];
};

export type CreateEnquiryInput = {
  reference: string;
  service: EnquiryServiceValue;
  name: string;
  phone: string;
  email: string | null;
  details: Record<string, unknown>;
};

export type UpdateEnquiryInput = {
  status?: EnquiryStatus;
  notes?: string;
  quotedAmount?: number | null;
  paymentLink?: string | null;
  paymentReference?: string | null;
  paymentNote?: string | null;
};

export interface EnquiryStore {
  /** Cheap dependency check used by /api/health. */
  ping(): Promise<void>;
  create(input: CreateEnquiryInput): Promise<EnquiryRecord>;
  list(): Promise<EnquiryRecord[]>;
  find(reference: string): Promise<EnquiryRecord | null>;
  update(
    reference: string,
    input: UpdateEnquiryInput,
  ): Promise<EnquiryRecord | null>;
}
