import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

const siteName = "MEWAR TOUR AND TRANSPORT";

type PageMetadataInput = {
  locale: Locale;
  path: string;
  titleKey: string;
  descriptionKey: string;
};

export async function createPageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
}: PageMetadataInput): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const title = t(titleKey);
  const description = t(descriptionKey);
  const localizedPaths = Object.fromEntries(
    routing.locales.map((item) => [item, `/${item}${path}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: localizedPaths,
    },
    openGraph: {
      type: "website",
      siteName,
      title: `${title} | ${siteName}`,
      description,
      locale,
      url: `/${locale}${path}`,
    },
  };
}
