import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { whyItems } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";

export function WhyChooseUs() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow={t("why.eyebrow")}
            title={t("why.title")}
          />
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {whyItems.map((item, index) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-soft font-heading text-[11px] font-bold text-navy">
                  {index + 1}
                </span>
                <p className="flex flex-1 items-center gap-2 border-b border-navy/10 pb-4 text-sm leading-relaxed text-navy/80">
                  <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {t(item)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
