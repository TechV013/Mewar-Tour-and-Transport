import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { AppButton } from "@/components/shared/app-button";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * Remaining placeholders. Full public content pages now have their own routes;
 * these stay until owner-verified About and legal content is available.
 */
const plannedRoutes = new Set([
  "about-us",
  "privacy-policy",
  "terms",
  "cancellation-policy",
]);

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const path = slug.join("/");

  if (!plannedRoutes.has(path)) {
    notFound();
  }

  setRequestLocale(locale);

  return <PlaceholderContent />;
}

function PlaceholderContent() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-ivory">
      <div className="container-site">
        <SectionHeading
          as="h1"
          eyebrow={t("nav.home")}
          title={t("legal.pageTitle")}
          subtitle={t("legal.pageBody")}
        />
        <div className="mt-8">
          <AppButton href="/" variant="primary" size="md">
            {t("nav.home")}
          </AppButton>
        </div>
      </div>
    </section>
  );
}
