import { useTranslations } from "next-intl";
import { Luggage, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fleetCategories } from "@/lib/constants";
import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";
import { SectionHeading } from "@/components/shared/section-heading";

export function FleetShowcase() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t("fleet.eyebrow")}
            title={t("fleet.title")}
            subtitle={t("fleet.subtitle")}
          />
          <AppButton href="/our-fleet" variant="outline" size="sm" className="shrink-0">
            {t("fleet.viewAll")}
          </AppButton>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fleetCategories.map((vehicle) => (
            <article
              key={vehicle.key}
              className="overflow-hidden rounded-lg border border-navy/10 bg-white transition-colors hover:border-gold/50"
            >
              <MediaFrame
                icon={vehicle.icon}
                alt={t(vehicle.key)}
                aspect="aspect-[16/10]"
              />
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-navy">
                  {t(vehicle.key)}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy/65">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-gold" aria-hidden="true" />
                    {t("fleet.seats")}: {vehicle.seats}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Luggage className="size-3.5 text-gold" aria-hidden="true" />
                    {t("fleet.luggage")}: {vehicle.luggage}
                  </span>
                  <span>{t("fleet.ac")}</span>
                </div>
                <p className="mt-3 text-xs text-navy/40">{t("fleet.specs")}</p>
                <Link
                  href="/our-fleet"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-[#9a7838]"
                >
                  {t("common.viewDetails")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-navy/40">{t("common.sampleData")}</p>
      </div>
    </section>
  );
}
