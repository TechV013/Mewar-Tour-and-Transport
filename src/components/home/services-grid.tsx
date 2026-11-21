import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { serviceItems } from "@/lib/constants";
import { MediaFrame } from "@/components/shared/media-frame";
import { SectionHeading } from "@/components/shared/section-heading";

export function ServicesGrid() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-ivory">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {serviceItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-lg border border-navy/10 bg-white transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_20px_45px_-30px_rgba(18,38,61,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex-row"
            >
              <MediaFrame
                icon={item.icon}
                alt={t(item.titleKey)}
                aspect="aspect-[4/3] sm:aspect-auto sm:w-[42%]"
                className="shrink-0"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-semibold text-navy">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/60">
                  {t(item.descriptionKey)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-[#9a7838]">
                  {t(item.ctaKey)}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
