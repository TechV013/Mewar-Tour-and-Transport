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
import { carRentalPages } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

type CarRentalPage = (typeof carRentalPages)[number];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    carRentalPages.map((item) => ({ locale, rentalType: item.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rentalType: string }>;
}): Promise<Metadata> {
  const { locale, rentalType } = await params;
  const page = carRentalPages.find((item) => item.slug === rentalType);

  if (!page) return {};

  return createPageMetadata({
    locale: locale as Locale,
    path: `/car-rentals/${rentalType}`,
    titleKey: page.titleKey,
    descriptionKey: page.descriptionKey,
  });
}

export default async function CarRentalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; rentalType: string }>;
}) {
  const { locale, rentalType } = await params;
  const page = carRentalPages.find((item) => item.slug === rentalType);

  if (!page) notFound();

  setRequestLocale(locale);

  return <CarRentalDetailContent page={page} />;
}

function CarRentalDetailContent({ page }: { page: CarRentalPage }) {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t(page.eyebrowKey)}
        title={t(page.titleKey)}
        subtitle={t(page.descriptionKey)}
        primary={{ label: t("hero.primaryCta"), href: "#booking" }}
        secondary={{
          label: t("nav.carRentals"),
          href: "/car-rentals",
          variant: "light",
        }}
        icon={page.slug === "self-drive" ? "selfDrive" : "chauffeur"}
        imageAlt={t(page.titleKey)}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={t("common.learnMore")}
            title={t("pages.car.introTitle")}
            subtitle={t("pages.car.introBody")}
          />
          <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
            <CheckList items={page.benefitKeys} />
          </div>
        </div>
      </section>

      {page.slug === "self-drive" ? (
        <section className="bg-white pb-4">
          <div className="container-site">
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-5">
              <p className="text-sm leading-relaxed text-navy/70">
                <span className="font-semibold text-navy">
                  {t("pages.car.noteTitle")}:{" "}
                </span>
                {t("pages.car.note")}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <HowItWorks />
      <BookingSection initialTab="car" />
    </>
  );
}
