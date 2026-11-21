import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Luggage, Users } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/routing";
import { fleetCategories } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/our-fleet",
    titleKey: "pages.fleet.title",
    descriptionKey: "pages.fleet.description",
  });
}

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FleetContent />;
}

function FleetContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("nav.ourFleet")}
        title={t("pages.fleet.title")}
        subtitle={t("pages.fleet.description")}
        primary={{ label: t("hero.primaryCta"), href: "/#booking" }}
        icon="suv"
        imageAlt={t("pages.fleet.title")}
      />

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("fleet.eyebrow")}
            title={t("pages.fleet.introTitle")}
            subtitle={t("pages.fleet.introBody")}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleetCategories.map((item) => (
              <article
                key={item.key}
                className="overflow-hidden rounded-xl border border-navy/10 bg-white"
              >
                <MediaFrame
                  icon={item.icon}
                  alt={t(item.key)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="p-5">
                  <h2 className="font-heading text-lg font-semibold text-navy">
                    {t(item.key)}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-navy/60">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-gold" aria-hidden="true" />
                      {t("fleet.seats")}: {item.seats}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Luggage className="size-3.5 text-gold" aria-hidden="true" />
                      {t("fleet.luggage")}: {item.luggage}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs text-navy/50">{t("common.sampleData")}</p>

          <div className="mt-8 rounded-lg border border-gold/30 bg-gold/5 p-5">
            <p className="text-sm leading-relaxed text-navy/70">
              <span className="font-semibold text-navy">
                {t("pages.fleet.noteTitle")}:{" "}
              </span>
              {t("pages.fleet.note")}
            </p>
          </div>

          <div className="mt-8">
            <AppButton href="/#booking" variant="primary" size="lg">
              {t("fleet.viewAll")}
            </AppButton>
          </div>
        </div>
      </section>
    </>
  );
}
