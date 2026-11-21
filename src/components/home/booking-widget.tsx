"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BusFront,
  Car,
  CarFront,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppButton } from "@/components/shared/app-button";
import {
  createEnquirySchemas,
  type EnquiryService,
} from "@/lib/validations/enquiry";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-lg border border-navy/15 bg-white px-3.5 text-sm text-navy shadow-[inset_0_1px_2px_rgba(18,38,61,0.04)] outline-none transition placeholder:text-navy/40 focus-visible:border-gold focus-visible:ring-4 focus-visible:ring-gold/15 aria-[invalid=true]:border-destructive";

type Schemas = ReturnType<typeof createEnquirySchemas>;

type SubmitState = {
  status: "idle" | "loading" | "success" | "error";
  reference: string | null;
};

function useEnquirySubmit(service: EnquiryService) {
  const t = useTranslations("booking");
  const [state, setState] = useState<SubmitState>({
    status: "idle",
    reference: null,
  });

  async function submit(values: Record<string, unknown>) {
    setState({ status: "loading", reference: null });
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name: values.name,
          phone: values.phone,
          details: values,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = (await response.json()) as { reference: string };
      setState({ status: "success", reference: data.reference });
    } catch {
      setState({ status: "error", reference: null });
    }
  }

  function reset() {
    setState({ status: "idle", reference: null });
  }

  return { state, submit, reset, t };
}

function Field({
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-xs font-semibold text-navy/80">
        {label}
        {required ? <span className="ml-0.5 text-gold">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RadioPills({
  name,
  options,
  value,
  onChange,
  onBlur,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            onBlur={onBlur}
            className="peer sr-only"
          />
          <span className="inline-flex min-h-11 items-center rounded-lg border border-navy/15 bg-white px-4 py-2 text-xs font-semibold text-navy/70 transition-colors hover:border-gold peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function StepIndicator({
  step,
  t,
}: {
  step: "details" | "contact";
  t: (key: string) => string;
}) {
  const steps = [
    { id: "details" as const, number: 1, label: t("booking.steps.details") },
    { id: "contact" as const, number: 2, label: t("booking.steps.contact") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t("booking.title")}>
      {steps.map((item, index) => {
        const active = step === item.id;
        const complete = step === "contact" && index === 0;

        return (
          <div key={item.id} className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                active && "bg-navy text-white",
                complete && "bg-gold text-navy",
                !active && !complete && "border border-navy/20 text-navy/40",
              )}
              aria-hidden="true"
            >
              {complete ? "✓" : item.number}
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                active ? "text-navy" : "text-navy/45",
              )}
            >
              {item.label}
            </span>
            {index === 0 ? (
              <span className="mx-1 h-px w-6 bg-navy/15" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ContactFields({
  register,
  errors,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  t: (key: string) => string;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="enquiry-name"
          label={t("booking.contact.name")}
          error={errors.name?.message}
          required
        >
          <input
            id="enquiry-name"
            autoComplete="name"
            placeholder={t("booking.contact.namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            {...register("name")}
          />
        </Field>
        <Field
          id="enquiry-phone"
          label={t("booking.contact.phone")}
          error={errors.phone?.message}
          required
        >
          <input
            id="enquiry-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder={t("booking.contact.phonePlaceholder")}
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            {...register("phone")}
          />
        </Field>
      </div>
      <Field
        id="enquiry-email"
        label={`${t("booking.contact.email")} (${t("common.optional")})`}
        error={errors.email?.message}
      >
        <input
          id="enquiry-email"
          type="email"
          autoComplete="email"
          placeholder={t("booking.contact.emailPlaceholder")}
          aria-invalid={Boolean(errors.email)}
          className={inputClass}
          {...register("email")}
        />
      </Field>
      <div className="flex items-start gap-2.5 rounded-lg bg-ivory/80 p-3.5">
        <input
          id="enquiry-consent"
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-[#12263D]"
          aria-invalid={Boolean(errors.consent)}
          {...register("consent")}
        />
        <div>
          <label
            htmlFor="enquiry-consent"
            className="text-xs leading-relaxed text-navy/75"
          >
            {t("booking.consent")}
          </label>
          {errors.consent?.message ? (
            <p className="mt-1 text-xs text-destructive" role="alert">
              {String(errors.consent.message)}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function SubmitRow({
  state,
  t,
}: {
  state: SubmitState;
  t: (key: string) => string;
}) {
  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-navy/70">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {t("booking.submitting")}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <p className="text-sm font-medium text-destructive" role="alert">
        {t("booking.errors.generic")}
      </p>
    );
  }
  return (
    <AppButton
      type="submit"
      variant="gold"
      size="lg"
      className="w-full rounded-lg px-8 shadow-md shadow-gold/20 sm:w-auto"
    >
      {t("booking.submit")}
    </AppButton>
  );
}

function EnquirySuccess({
  state,
  onReset,
  t,
}: {
  state: SubmitState;
  onReset: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-gold/35 bg-ivory p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-[#1d7a55]" aria-hidden="true" />
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy">
            {t("booking.success.title")}
          </h3>
          <p className="mt-1 max-w-md text-sm text-navy/70">
            {t("booking.success.body")}
          </p>
          <p className="mt-3 text-sm font-semibold text-navy">
            {t("booking.success.reference")}:{" "}
            <span className="font-mono tracking-wide text-[#1d7a55]">
              {state.reference}
            </span>
          </p>
          <p className="mt-1 text-xs text-navy/50">
            {t("booking.success.note")}
          </p>
        </div>
      </div>
      <AppButton
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={onReset}
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        {t("booking.success.another")}
      </AppButton>
    </div>
  );
}

function TaxiForm({ schemas }: { schemas: Schemas }) {
  const t = useTranslations();
  const { state, submit, reset } = useEnquirySubmit("taxi");
  const [step, setStep] = useState<"details" | "contact">("details");
  type Values = z.infer<typeof schemas.taxi>;
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<Values>({
    resolver: zodResolver(schemas.taxi),
    defaultValues: {
      tripType: "one-way",
      pickup: "",
      destination: "",
      pickupDate: "",
      pickupTime: "",
      returnDate: "",
      passengers: "2",
      vehiclePreference: "no-preference",
      requirements: "",
      name: "",
      phone: "",
      email: "",
      consent: false,
    },
  });

  const tripType = watch("tripType");
  const vehicleOptions = [
    { value: "no-preference", label: t("booking.vehicleOptions.noPreference") },
    { value: "sedan", label: t("booking.vehicleOptions.sedan") },
    { value: "suv", label: t("booking.vehicleOptions.suv") },
    { value: "muv", label: t("booking.vehicleOptions.muv") },
  ];

  return (
    <div className="space-y-5">
      <StepIndicator step={step} t={t} />

      <Field id="taxi-trip" label={t("booking.taxi.tripType")} required>
        <RadioPills
          name="tripType"
          value={tripType}
          options={[
            { value: "one-way", label: t("booking.taxi.tripTypes.oneWay") },
            { value: "round-trip", label: t("booking.taxi.tripTypes.roundTrip") },
            { value: "local", label: t("booking.taxi.tripTypes.local") },
            { value: "airport", label: t("booking.taxi.tripTypes.airport") },
          ]}
          onChange={(value) =>
            setValue("tripType", value as Values["tripType"], {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      </Field>

      <form
        onSubmit={handleSubmit((values) => submit(values as Record<string, unknown>))}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="taxi-pickup"
            label={t("booking.taxi.pickup")}
            error={errors.pickup?.message}
            required
          >
            <input
              id="taxi-pickup"
              placeholder={t("booking.taxi.pickupPlaceholder")}
              aria-invalid={Boolean(errors.pickup)}
              className={inputClass}
              {...register("pickup")}
            />
          </Field>
          <Field
            id="taxi-destination"
            label={t("booking.taxi.destination")}
            error={errors.destination?.message}
            required={tripType !== "local"}
          >
            <input
              id="taxi-destination"
              placeholder={t("booking.taxi.destinationPlaceholder")}
              aria-invalid={Boolean(errors.destination)}
              className={inputClass}
              {...register("destination")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            id="taxi-date"
            label={t("booking.taxi.pickupDate")}
            error={errors.pickupDate?.message}
            required
          >
            <input
              id="taxi-date"
              type="date"
              aria-invalid={Boolean(errors.pickupDate)}
              className={inputClass}
              {...register("pickupDate")}
            />
          </Field>
          <Field
            id="taxi-time"
            label={t("booking.taxi.pickupTime")}
            error={errors.pickupTime?.message}
            required
          >
            <input
              id="taxi-time"
              type="time"
              aria-invalid={Boolean(errors.pickupTime)}
              className={inputClass}
              {...register("pickupTime")}
            />
          </Field>
          {tripType === "round-trip" ? (
            <Field
              id="taxi-return"
              label={t("booking.taxi.returnDate")}
              error={errors.returnDate?.message}
              required
            >
              <input
                id="taxi-return"
                type="date"
                aria-invalid={Boolean(errors.returnDate)}
                className={inputClass}
                {...register("returnDate")}
              />
            </Field>
          ) : null}
          <Field
            id="taxi-passengers"
            label={t("booking.taxi.passengers")}
            error={errors.passengers?.message}
            required
          >
            <input
              id="taxi-passengers"
              type="number"
              min={1}
              max={60}
              aria-invalid={Boolean(errors.passengers)}
              className={inputClass}
              {...register("passengers")}
            />
          </Field>
        </div>

        {step === "details" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-navy/50">{t("booking.continueNote")}</p>
            <AppButton
              type="button"
              variant="primary"
              size="md"
              className="rounded-lg"
              onClick={async () => {
                const valid = await trigger([
                  "tripType",
                  "pickup",
                  "destination",
                  "pickupDate",
                  "pickupTime",
                  "returnDate",
                  "passengers",
                  "vehiclePreference",
                ]);
                if (valid) setStep("contact");
              }}
            >
              {t("booking.continue")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </AppButton>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="taxi-vehicle"
                label={t("booking.taxi.vehiclePreference")}
              >
                <select
                  id="taxi-vehicle"
                  className={inputClass}
                  {...register("vehiclePreference")}
                >
                  {vehicleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="taxi-requirements"
                label={t("booking.taxi.requirements")}
              >
                <input
                  id="taxi-requirements"
                  placeholder={t("booking.taxi.requirementsPlaceholder")}
                  className={inputClass}
                  {...register("requirements")}
                />
              </Field>
            </div>
            <ContactFields register={register} errors={errors} t={t} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("details")}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t("booking.back")}
              </AppButton>
              {state.status === "success" ? (
                <EnquirySuccess
                  state={state}
                  t={t}
                  onReset={() => {
                    resetForm();
                    reset();
                    setStep("details");
                  }}
                />
              ) : (
                <SubmitRow state={state} t={t} />
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function BusForm({ schemas }: { schemas: Schemas }) {
  const t = useTranslations();
  const { state, submit, reset } = useEnquirySubmit("bus");
  const [step, setStep] = useState<"details" | "contact">("details");
  type Values = z.infer<typeof schemas.bus>;
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<Values>({
    resolver: zodResolver(schemas.bus),
    defaultValues: {
      pickup: "",
      destination: "",
      stops: "",
      journeyDate: "",
      returnDate: "",
      passengers: "20",
      seating: "no-preference",
      ac: "either",
      purpose: "",
      requirements: "",
      name: "",
      phone: "",
      email: "",
      consent: false,
    },
  });

  const ac = watch("ac");

  return (
    <div className="space-y-5">
      <StepIndicator step={step} t={t} />

      <form
        onSubmit={handleSubmit((values) => submit(values as Record<string, unknown>))}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="bus-pickup"
          label={t("booking.bus.pickup")}
          error={errors.pickup?.message}
          required
        >
          <input
            id="bus-pickup"
            placeholder={t("booking.bus.pickupPlaceholder")}
            aria-invalid={Boolean(errors.pickup)}
            className={inputClass}
            {...register("pickup")}
          />
        </Field>
        <Field
          id="bus-destination"
          label={t("booking.bus.destination")}
          error={errors.destination?.message}
          required
        >
          <input
            id="bus-destination"
            placeholder={t("booking.bus.destinationPlaceholder")}
            aria-invalid={Boolean(errors.destination)}
            className={inputClass}
            {...register("destination")}
          />
        </Field>
      </div>

      <Field id="bus-stops" label={t("booking.bus.stops")}>
        <input
          id="bus-stops"
          placeholder={t("booking.bus.stopsPlaceholder")}
          className={inputClass}
          {...register("stops")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="bus-date"
          label={t("booking.bus.journeyDate")}
          error={errors.journeyDate?.message}
          required
        >
          <input
            id="bus-date"
            type="date"
            aria-invalid={Boolean(errors.journeyDate)}
            className={inputClass}
            {...register("journeyDate")}
          />
        </Field>
        <Field
          id="bus-return"
          label={`${t("booking.bus.returnDate")} (${t("common.optional")})`}
          error={errors.returnDate?.message}
        >
          <input
            id="bus-return"
            type="date"
            aria-invalid={Boolean(errors.returnDate)}
            className={inputClass}
            {...register("returnDate")}
          />
        </Field>
        <Field
          id="bus-passengers"
          label={t("booking.bus.passengers")}
          error={errors.passengers?.message}
          required
        >
          <input
            id="bus-passengers"
            type="number"
            min={1}
            max={60}
            aria-invalid={Boolean(errors.passengers)}
            className={inputClass}
            {...register("passengers")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="bus-seating" label={t("booking.bus.seating")}>
          <select
            id="bus-seating"
            className={inputClass}
            {...register("seating")}
          >
            <option value="no-preference">
              {t("booking.vehicleOptions.noPreference")}
            </option>
            <option value="tempo">{t("booking.vehicleOptions.tempoTraveller")}</option>
            <option value="mini-bus">{t("booking.vehicleOptions.miniBus")}</option>
            <option value="luxury-bus">{t("booking.vehicleOptions.luxuryBus")}</option>
          </select>
        </Field>
        <Field id="bus-ac" label={t("booking.bus.ac")}>
          <RadioPills
            name="ac"
            value={ac}
            options={[
              { value: "ac", label: t("booking.bus.acOptions.ac") },
              { value: "non-ac", label: t("booking.bus.acOptions.nonAc") },
              { value: "either", label: t("booking.bus.acOptions.either") },
            ]}
            onChange={(value) =>
              setValue("ac", value as Values["ac"], {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </Field>
      </div>

        {step === "details" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-navy/50">{t("booking.continueNote")}</p>
            <AppButton
              type="button"
              variant="primary"
              size="md"
              className="rounded-lg"
              onClick={async () => {
                const valid = await trigger([
                  "pickup",
                  "destination",
                  "stops",
                  "journeyDate",
                  "returnDate",
                  "passengers",
                  "seating",
                  "ac",
                ]);
                if (valid) setStep("contact");
              }}
            >
              {t("booking.continue")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </AppButton>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="bus-purpose" label={t("booking.bus.purpose")}>
                <input
                  id="bus-purpose"
                  placeholder={t("booking.bus.purposePlaceholder")}
                  className={inputClass}
                  {...register("purpose")}
                />
              </Field>
              <Field id="bus-requirements" label={t("booking.bus.requirements")}>
                <input
                  id="bus-requirements"
                  placeholder={t("booking.bus.requirementsPlaceholder")}
                  className={inputClass}
                  {...register("requirements")}
                />
              </Field>
            </div>
            <ContactFields register={register} errors={errors} t={t} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("details")}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t("booking.back")}
              </AppButton>
              {state.status === "success" ? (
                <EnquirySuccess
                  state={state}
                  t={t}
                  onReset={() => {
                    resetForm();
                    reset();
                    setStep("details");
                  }}
                />
              ) : (
                <SubmitRow state={state} t={t} />
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function CarForm({ schemas }: { schemas: Schemas }) {
  const t = useTranslations();
  const { state, submit, reset } = useEnquirySubmit("car");
  const [step, setStep] = useState<"details" | "contact">("details");
  type Values = z.infer<typeof schemas.car>;
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<Values>({
    resolver: zodResolver(schemas.car),
    defaultValues: {
      rentalType: "with-driver",
      pickup: "",
      dropoff: "",
      startDate: "",
      startTime: "",
      returnDate: "",
      returnTime: "",
      category: "no-preference",
      passengers: "2",
      requirements: "",
      name: "",
      phone: "",
      email: "",
      consent: false,
    },
  });

  const rentalType = watch("rentalType");

  return (
    <div className="space-y-5">
      <StepIndicator step={step} t={t} />

      <form
        onSubmit={handleSubmit((values) => submit(values as Record<string, unknown>))}
        className="space-y-5"
      >
        <Field id="car-rental-type" label={t("booking.car.rentalType")} required>
        <RadioPills
          name="rentalType"
          value={rentalType}
          options={[
            { value: "with-driver", label: t("booking.car.rentalTypes.withDriver") },
            { value: "self-drive", label: t("booking.car.rentalTypes.selfDrive") },
          ]}
          onChange={(value) =>
            setValue("rentalType", value as Values["rentalType"], {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="car-pickup"
          label={t("booking.car.pickup")}
          error={errors.pickup?.message}
          required
        >
          <input
            id="car-pickup"
            placeholder={t("booking.car.pickupPlaceholder")}
            aria-invalid={Boolean(errors.pickup)}
            className={inputClass}
            {...register("pickup")}
          />
        </Field>
        <Field id="car-dropoff" label={t("booking.car.dropoff")}>
          <input
            id="car-dropoff"
            placeholder={t("booking.car.dropoffPlaceholder")}
            className={inputClass}
            {...register("dropoff")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          id="car-start-date"
          label={t("booking.car.startDate")}
          error={errors.startDate?.message}
          required
        >
          <input
            id="car-start-date"
            type="date"
            aria-invalid={Boolean(errors.startDate)}
            className={inputClass}
            {...register("startDate")}
          />
        </Field>
        <Field
          id="car-start-time"
          label={t("booking.car.startTime")}
          error={errors.startTime?.message}
          required
        >
          <input
            id="car-start-time"
            type="time"
            aria-invalid={Boolean(errors.startTime)}
            className={inputClass}
            {...register("startTime")}
          />
        </Field>
        <Field
          id="car-return-date"
          label={t("booking.car.returnDate")}
          error={errors.returnDate?.message}
          required
        >
          <input
            id="car-return-date"
            type="date"
            aria-invalid={Boolean(errors.returnDate)}
            className={inputClass}
            {...register("returnDate")}
          />
        </Field>
        <Field
          id="car-return-time"
          label={t("booking.car.returnTime")}
          error={errors.returnTime?.message}
          required
        >
          <input
            id="car-return-time"
            type="time"
            aria-invalid={Boolean(errors.returnTime)}
            className={inputClass}
            {...register("returnTime")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="car-category" label={t("booking.car.category")}>
          <select
            id="car-category"
            className={inputClass}
            {...register("category")}
          >
            <option value="no-preference">
              {t("booking.vehicleOptions.noPreference")}
            </option>
            <option value="sedan">{t("booking.vehicleOptions.sedan")}</option>
            <option value="suv">{t("booking.vehicleOptions.suv")}</option>
            <option value="muv">{t("booking.vehicleOptions.muv")}</option>
          </select>
        </Field>
        <Field
          id="car-passengers"
          label={t("booking.car.passengers")}
          error={errors.passengers?.message}
          required
        >
          <input
            id="car-passengers"
            type="number"
            min={1}
            max={60}
            aria-invalid={Boolean(errors.passengers)}
            className={inputClass}
            {...register("passengers")}
          />
        </Field>
      </div>

        {step === "details" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-navy/50">{t("booking.continueNote")}</p>
            <AppButton
              type="button"
              variant="primary"
              size="md"
              className="rounded-lg"
              onClick={async () => {
                const valid = await trigger([
                  "rentalType",
                  "pickup",
                  "dropoff",
                  "startDate",
                  "startTime",
                  "returnDate",
                  "returnTime",
                  "category",
                  "passengers",
                ]);
                if (valid) setStep("contact");
              }}
            >
              {t("booking.continue")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </AppButton>
          </div>
        ) : (
          <div className="space-y-5">
            <Field id="car-requirements" label={t("booking.car.requirements")}>
              <input
                id="car-requirements"
                placeholder={t("booking.car.requirementsPlaceholder")}
                className={inputClass}
                {...register("requirements")}
              />
            </Field>
            <ContactFields register={register} errors={errors} t={t} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("details")}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t("booking.back")}
              </AppButton>
              {state.status === "success" ? (
                <EnquirySuccess
                  state={state}
                  t={t}
                  onReset={() => {
                    resetForm();
                    reset();
                    setStep("details");
                  }}
                />
              ) : (
                <SubmitRow state={state} t={t} />
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export function BookingWidget({
  initialTab = "taxi",
}: {
  initialTab?: "taxi" | "bus" | "car";
}) {
  const t = useTranslations("booking");
  const rootT = useTranslations();
  const schemas = useMemo(() => createEnquirySchemas(rootT), [rootT]);

  const tabItems = [
    { value: "taxi", label: t("tabs.taxi"), icon: CarFront },
    { value: "bus", label: t("tabs.bus"), icon: BusFront },
    { value: "car", label: t("tabs.car"), icon: Car },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_30px_90px_-35px_rgba(6,16,30,0.75)] ring-1 ring-navy/5">
      <Tabs defaultValue={initialTab} className="w-full">
        <div className="border-b border-navy/10 bg-gradient-to-br from-white via-white to-ivory/70 px-5 py-5 sm:px-8 sm:py-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a662b]">
            <ShieldCheck className="size-3" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-navy sm:text-[28px]">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/60">
            {t("subtitle")}
          </p>

          <TabsList
            variant="line"
            aria-label={t("title")}
            className="mt-5 h-auto w-full max-w-2xl justify-start gap-1 rounded-none border-b border-navy/10 bg-transparent p-0"
          >
            {tabItems.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-12 flex-1 rounded-none px-2 text-sm font-semibold text-navy/55 after:bg-gold data-[active]:bg-transparent data-[active]:text-navy sm:px-4"
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="bg-white px-5 py-6 sm:px-8 sm:py-7">
          <TabsContent value="taxi" className="mt-0">
            <TaxiForm schemas={schemas} />
          </TabsContent>
          <TabsContent value="bus" className="mt-0">
            <BusForm schemas={schemas} />
          </TabsContent>
          <TabsContent value="car" className="mt-0">
            <CarForm schemas={schemas} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-navy/10 bg-ivory/70 px-5 py-3 text-xs text-navy/60 sm:px-8">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-gold" aria-hidden="true" />
          {t("assurance.noPayment")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-gold" aria-hidden="true" />
          {t("assurance.review")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-gold" aria-hidden="true" />
          {t("assurance.quote")}
        </span>
      </div>
    </div>
  );
}
