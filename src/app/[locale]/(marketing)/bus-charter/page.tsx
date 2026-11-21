import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { BookingSection } from "@/components/shared/booking-section";
import { CheckList } from "@/components/shared/check-list";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/routing";
import { busIncludes, requirements } from "@/lib/constants";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/bus-charter",
    titleKey: "pages.bus.title",
    descriptionKey: "pages.bus.description",
  });
}

export default async function BusCharterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BusCharterContent />;
}

function BusCharterContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("nav.busCharter")}
        title={t("pages.bus.title")}
        subtitle={t("pages.bus.description")}
        primary={{ label: t("hero.primaryCta"), href: "#booking" }}
        icon="bus"
        imageAlt={t("pages.bus.title")}
      />

      <section className="section-pad bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={t("common.learnMore")}
            title={t("pages.bus.introTitle")}
            subtitle={t("pages.bus.introBody")}
          />
          <div className="rounded-xl border border-navy/10 bg-ivory p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-navy">
              {t("pages.bus.includesTitle")}
            </h2>
            <div className="mt-5">
              <CheckList items={busIncludes} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-site">
          <SectionHeading
            eyebrow={t("requirements.eyebrow")}
            title={t("pages.bus.usesTitle")}
            subtitle={t("pages.bus.usesBody")}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((item) => (
              <div
                key={item.key}
                className="rounded-lg border border-navy/10 bg-white p-5 text-sm font-medium text-navy"
              >
                {t(item.key)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingSection initialTab="bus" />
    </>
  );
}
