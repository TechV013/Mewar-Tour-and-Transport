import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/shared/page-hero";
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
    path: "/contact-us",
    titleKey: "pages.contact.title",
    descriptionKey: "pages.contact.description",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("contact.eyebrow")}
        title={t("pages.contact.title")}
        subtitle={t("pages.contact.description")}
        primary={{ label: t("hero.primaryCta"), href: "/#booking" }}
        icon="chauffeur"
        imageAlt={t("pages.contact.title")}
      />
      <ContactCta showHeading={false} />
    </>
  );
}
