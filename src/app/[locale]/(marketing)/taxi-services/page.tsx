import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { BookingSection } from "@/components/shared/booking-section";
import { CheckList } from "@/components/shared/check-list";
import { LinkCard } from "@/components/shared/link-card";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/routing";
import { taxiIncludes, taxiTypePages } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/taxi-services",
    titleKey: "pages.taxi.title",
    descriptionKey: "pages.taxi.description",
  });
}

export default async function TaxiServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TaxiServicesContent />;
}

function TaxiServicesContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("nav.taxiServices")}
        title={t("pages.taxi.title")}
        subtitle={t("pages.taxi.description")}
        primary={{ label: t("hero.primaryCta"), href: "#booking" }}
        icon="taxi"
        imageAlt={t("pages.taxi.title")}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={t("common.learnMore")}
            title={t("pages.taxi.introTitle")}
            subtitle={t("pages.taxi.introBody")}
          />
          <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-navy">
              {t("pages.taxi.includesTitle")}
            </h2>
            <div className="mt-5">
              <CheckList items={taxiIncludes} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("services.eyebrow")}
            title={t("pages.taxi.typesTitle")}
            subtitle={t("pages.taxi.typesBody")}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {taxiTypePages.map((item) => (
              <LinkCard
                key={item.slug}
                href={`/taxi-services/${item.slug}`}
                icon="taxi"
                title={t(item.titleKey)}
                description={t(item.descriptionKey)}
                ctaLabel={t("common.viewDetails")}
                imageAlt={t(item.titleKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <BookingSection initialTab="taxi" />
    </>
  );
}
