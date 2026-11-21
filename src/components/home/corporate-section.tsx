import { useTranslations } from "next-intl";
import { Check, Building2 } from "lucide-react";
import { corporateItems } from "@/lib/constants";
import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";
import { SectionHeading } from "@/components/shared/section-heading";

export function CorporateSection() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-navy text-white">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t("corporate.eyebrow")}
            title={t("corporate.title")}
            subtitle={t("corporate.description")}
            tone="light"
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {corporateItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {t(item)}
              </li>
            ))}
          </ul>
          <AppButton href="/corporate-transport" variant="gold" size="lg" className="mt-9">
            <Building2 className="size-4" aria-hidden="true" />
            {t("corporate.cta")}
          </AppButton>
        </div>

        <MediaFrame
          icon="briefcase"
          alt={t("corporate.title")}
          aspect="aspect-[4/3]"
          className="rounded-lg border border-white/10"
        />
      </div>
    </section>
  );
}
