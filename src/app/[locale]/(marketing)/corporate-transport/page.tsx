import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ContactCta } from "@/components/home/contact-cta";
import { BookingSection } from "@/components/shared/booking-section";
import { CheckList } from "@/components/shared/check-list";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/routing";
import { corporateIncludes, corporateItems } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/corporate-transport",
    titleKey: "pages.corporate.title",
    descriptionKey: "pages.corporate.description",
  });
}

export default async function CorporateTransportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CorporateTransportContent />;
}

function CorporateTransportContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("nav.corporateTransport")}
        title={t("pages.corporate.title")}
        subtitle={t("pages.corporate.description")}
        primary={{ label: t("common.requestQuotation"), href: "#booking" }}
        icon="briefcase"
        imageAlt={t("pages.corporate.title")}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={t("corporate.eyebrow")}
            title={t("pages.corporate.introTitle")}
            subtitle={t("pages.corporate.introBody")}
          />
          <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-navy">
              {t("pages.corporate.includesTitle")}
            </h2>
            <div className="mt-5">
              <CheckList items={corporateIncludes} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("services.eyebrow")}
            title={t("pages.corporate.capabilitiesTitle")}
            subtitle={t("pages.corporate.capabilitiesBody")}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {corporateItems.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-navy/10 bg-white p-5 text-sm font-medium text-navy"
              >
                {t(item)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingSection initialTab="bus" />
      <ContactCta showHeading={false} />
    </>
  );
}
