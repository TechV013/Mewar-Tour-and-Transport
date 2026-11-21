import { z } from "zod";

type Translate = (key: string) => string;

const phonePattern = /^[6-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function createEnquirySchemas(t: Translate) {
  const required = (key: string) => z.string().trim().min(1, t(key));

  const contactFields = {
    name: z.string().trim().min(2, t("booking.errors.nameRequired")),
    phone: z
      .string()
      .trim()
      .regex(phonePattern, t("booking.errors.phoneInvalid")),
    email: z
      .string()
      .trim()
      .refine((value) => value === "" || emailPattern.test(value), {
        message: t("booking.errors.emailInvalid"),
      }),
    consent: z.boolean().refine((value) => value, {
      message: t("booking.errors.consentRequired"),
    }),
  };

  const passengers = z
    .string()
    .trim()
    .regex(/^\d+$/, t("booking.errors.passengersInvalid"))
    .refine((value) => {
      const count = Number(value);
      return count >= 1 && count <= 60;
    }, t("booking.errors.passengersInvalid"));

  const taxi = z
    .object({
      tripType: z.enum(["one-way", "round-trip", "local", "airport"]),
      pickup: required("booking.errors.pickupRequired"),
      destination: z.string().trim(),
      pickupDate: required("booking.errors.dateRequired"),
      pickupTime: required("booking.errors.timeRequired"),
      returnDate: z.string(),
      passengers,
      vehiclePreference: z.string(),
      requirements: z.string(),
      ...contactFields,
    })
    .superRefine((value, ctx) => {
      if (value.tripType !== "local" && !value.destination) {
        ctx.addIssue({
          code: "custom",
          path: ["destination"],
          message: t("booking.errors.destinationRequired"),
        });
      }
      if (
        value.tripType === "round-trip" &&
        value.returnDate &&
        value.returnDate < value.pickupDate
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["returnDate"],
          message: t("booking.errors.returnAfterPickup"),
        });
      }
    });

  const bus = z
    .object({
      pickup: required("booking.errors.pickupRequired"),
      destination: required("booking.errors.destinationRequired"),
      stops: z.string(),
      journeyDate: required("booking.errors.dateRequired"),
      returnDate: z.string(),
      passengers,
      seating: z.string(),
      ac: z.enum(["ac", "non-ac", "either"]),
      purpose: z.string(),
      requirements: z.string(),
      ...contactFields,
    })
    .refine(
      (value) => !value.returnDate || value.returnDate >= value.journeyDate,
      {
        path: ["returnDate"],
        message: t("booking.errors.returnAfterPickup"),
      },
    );

  const car = z
    .object({
      rentalType: z.enum(["with-driver", "self-drive"]),
      pickup: required("booking.errors.pickupRequired"),
      dropoff: z.string(),
      startDate: required("booking.errors.dateRequired"),
      startTime: required("booking.errors.timeRequired"),
      returnDate: required("booking.errors.dateRequired"),
      returnTime: required("booking.errors.timeRequired"),
      category: z.string(),
      passengers,
      requirements: z.string(),
      ...contactFields,
    })
    .refine((value) => value.returnDate >= value.startDate, {
      path: ["returnDate"],
      message: t("booking.errors.returnAfterPickup"),
    });

  const contact = z.object({
    name: contactFields.name,
    phone: contactFields.phone,
    email: contactFields.email,
    message: z.string().trim().min(10, t("booking.errors.required")),
  });

  return { taxi, bus, car, contact };
}

export type EnquiryService = "taxi" | "bus" | "car" | "contact";
