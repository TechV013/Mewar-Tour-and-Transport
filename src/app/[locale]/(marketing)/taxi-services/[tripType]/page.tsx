import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HowItWorks } from "@/components/home/how-it-works";
import { BookingSection } from "@/components/shared/booking-section";
import { CheckList } from "@/components/shared/check-list";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { routing, type Locale } from "@/i18n/routing";
import { taxiTypePages } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

type TaxiTypePage = (typeof taxiTypePages)[number];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    taxiTypePages.map((item) => ({ locale, tripType: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tripType: string }>;
}): Promise<Metadata> {
  const { locale, tripType } = await params;
  const page = taxiTypePages.find((item) => item.slug === tripType);

  if (!page) return {};

  return createPageMetadata({
    locale: locale as Locale,
    path: `/taxi-services/${tripType}`,
    titleKey: page.titleKey,
    descriptionKey: page.descriptionKey,
  });
}

export default async function TaxiTypePage({
  params,
}: {
  params: Promise<{ locale: string; tripType: string }>;
}) {
  const { locale, tripType } = await params;
  const page = taxiTypePages.find((item) => item.slug === tripType);

  if (!page) notFound();

  setRequestLocale(locale);

  return <TaxiTypeContent page={page} />;
}

function TaxiTypeContent({ page }: { page: TaxiTypePage }) {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t(page.eyebrowKey)}
        title={t(page.titleKey)}
        subtitle={t(page.descriptionKey)}
        primary={{ label: t("hero.primaryCta"), href: "#booking" }}
        secondary={{
          label: t("nav.taxiServices"),
          href: "/taxi-services",
          variant: "light",
        }}
        icon="taxi"
        imageAlt={t(page.titleKey)}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={t("common.learnMore")}
            title={t("pages.taxi.includesTitle")}
            subtitle={t("pages.taxi.introBody")}
          />
          <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
            <CheckList items={page.benefitKeys} />
          </div>
        </div>
      </section>

      <HowItWorks />
      <BookingSection initialTab="taxi" />
    </>
  );
}
