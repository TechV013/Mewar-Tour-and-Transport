import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { BookingSection } from "@/components/shared/booking-section";
import { LinkCard } from "@/components/shared/link-card";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/car-rentals",
    titleKey: "pages.car.title",
    descriptionKey: "pages.car.description",
  });
}

export default async function CarRentalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CarRentalsContent />;
}

function CarRentalsContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("nav.carRentals")}
        title={t("pages.car.title")}
        subtitle={t("pages.car.description")}
        primary={{ label: t("hero.primaryCta"), href: "#booking" }}
        icon="chauffeur"
        imageAlt={t("pages.car.title")}
      />

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("services.eyebrow")}
            title={t("pages.car.introTitle")}
            subtitle={t("pages.car.introBody")}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <LinkCard
              href="/car-rentals/with-driver"
              icon="chauffeur"
              title={t("pages.car.withDriverTitle")}
              description={t("services.items.chauffeur.description")}
              ctaLabel={t("services.items.chauffeur.cta")}
              imageAlt={t("pages.car.withDriverTitle")}
            />
            <LinkCard
              href="/car-rentals/self-drive"
              icon="selfDrive"
              title={t("pages.car.selfDriveTitle")}
              description={t("services.items.selfDrive.description")}
              ctaLabel={t("services.items.selfDrive.cta")}
              imageAlt={t("pages.car.selfDriveTitle")}
            />
          </div>
          <div className="mt-10 flex gap-3 rounded-lg border border-gold/30 bg-gold/5 p-5">
            <p className="text-sm leading-relaxed text-navy/70">
              <span className="font-semibold text-navy">
                {t("pages.car.noteTitle")}:{" "}
              </span>
              {t("pages.car.note")}
            </p>
          </div>
        </div>
      </section>

      <BookingSection initialTab="car" />
    </>
  );
}
