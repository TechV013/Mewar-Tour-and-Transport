import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const paths = [
  "",
  "/taxi-services",
  "/taxi-services/one-way",
  "/taxi-services/round-trip",
  "/taxi-services/local",
  "/taxi-services/airport",
  "/bus-charter",
  "/car-rentals",
  "/car-rentals/with-driver",
  "/car-rentals/self-drive",
  "/corporate-transport",
  "/our-fleet",
  "/about-us",
  "/contact-us",
  "/faqs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [
            alt,
            `${baseUrl}/${alt}${path}`,
          ]),
        ),
      },
    })),
  );
}
