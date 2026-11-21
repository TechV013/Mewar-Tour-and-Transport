import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ContactCta } from "@/components/home/contact-cta";
import { FaqSection } from "@/components/home/faq-section";
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
    path: "/faqs",
    titleKey: "pages.faqs.title",
    descriptionKey: "pages.faqs.description",
  });
}

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FaqsContent />;
}

function FaqsContent() {
  const t = useTranslations();

  return (
    <>
      <PageHero
        eyebrow={t("faq.eyebrow")}
        title={t("pages.faqs.title")}
        subtitle={t("pages.faqs.description")}
        primary={{ label: t("contact.requestQuotation"), href: "/#booking" }}
        icon="taxi"
        imageAlt={t("pages.faqs.title")}
      />
      <FaqSection showHeading={false} />
      <ContactCta showHeading={false} />
    </>
  );
}
