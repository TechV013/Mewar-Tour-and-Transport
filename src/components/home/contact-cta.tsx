"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { AppButton } from "@/components/shared/app-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { business, telHref, whatsappHref } from "@/lib/constants";
import { createEnquirySchemas } from "@/lib/validations/enquiry";

const inputClass =
  "h-11 w-full rounded-md border border-input bg-white px-3 text-sm text-navy outline-none transition-colors placeholder:text-navy/40 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25 aria-[invalid=true]:border-destructive";

export function ContactCta({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations();
  const schemas = useMemo(() => createEnquirySchemas(t), [t]);
  type Values = z.infer<typeof schemas.contact>;
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schemas.contact),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const phoneLink = telHref(business.phone) || "/contact-us";
  const whatsappLink = whatsappHref(business.whatsapp) || "/contact-us";

  return (
    <section className="section-pad bg-white">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          {showHeading ? (
            <SectionHeading
              eyebrow={t("contact.eyebrow")}
              title={t("contact.title")}
              subtitle={t("contact.description")}
            />
          ) : null}

          <div className={showHeading ? "mt-8 space-y-4" : "space-y-4"}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-lg border border-navy/10 p-5 transition-colors hover:border-gold/50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ivory text-navy">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-heading font-semibold text-navy">
                  {t("contact.whatsappTitle")}
                </span>
                <span className="mt-1 block text-sm text-navy/60">
                  {business.whatsapp || t("contact.whatsappBody")}
                </span>
              </span>
              <ArrowRight className="ml-auto mt-2 size-4 text-navy/40 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>

            <a
              href={phoneLink}
              className="group flex items-start gap-4 rounded-lg border border-navy/10 p-5 transition-colors hover:border-gold/50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ivory text-navy">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-heading font-semibold text-navy">
                  {t("contact.phoneTitle")}
                </span>
                <span className="mt-1 block text-sm text-navy/60">
                  {business.phone || t("contact.phoneBody")}
                </span>
              </span>
              <ArrowRight className="ml-auto mt-2 size-4 text-navy/40 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>

          <AppButton href="/#booking" variant="primary" size="lg" className="mt-8">
            <Mail className="size-4" aria-hidden="true" />
            {t("contact.requestQuotation")}
          </AppButton>
        </div>

        <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
          <h3 className="font-heading text-xl font-semibold text-navy">
            {t("contact.formTitle")}
          </h3>

          {sent ? (
            <div className="mt-6 flex gap-3 rounded-md border border-gold/40 bg-white p-5">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#1d7a55]" aria-hidden="true" />
              <p className="text-sm text-navy/75">{t("contact.success")}</p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit(async (values) => {
                const response = await fetch("/api/enquiries", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    service: "contact",
                    name: values.name,
                    phone: values.phone,
                    details: values,
                  }),
                });
                if (response.ok) {
                  setSent(true);
                  reset();
                }
              })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="text-xs font-semibold text-navy/80">
                    {t("contact.name")}
                  </label>
                  <input id="contact-name" className={`mt-1.5 ${inputClass}`} {...register("name")} />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-destructive" role="alert">{errors.name.message}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-xs font-semibold text-navy/80">
                    {t("contact.phone")}
                  </label>
                  <input id="contact-phone" type="tel" className={`mt-1.5 ${inputClass}`} {...register("phone")} />
                  {errors.phone ? (
                    <p className="mt-1 text-xs text-destructive" role="alert">{errors.phone.message}</p>
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="text-xs font-semibold text-navy/80">
                  {t("contact.email")}
                </label>
                <input id="contact-email" type="email" className={`mt-1.5 ${inputClass}`} {...register("email")} />
                {errors.email ? (
                  <p className="mt-1 text-xs text-destructive" role="alert">{errors.email.message}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs font-semibold text-navy/80">
                  {t("contact.message")}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder={t("contact.messagePlaceholder")}
                  className={`mt-1.5 h-auto py-3 ${inputClass}`}
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-destructive" role="alert">{errors.message.message}</p>
                ) : null}
              </div>
              <AppButton type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {t("contact.submit")}
              </AppButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
