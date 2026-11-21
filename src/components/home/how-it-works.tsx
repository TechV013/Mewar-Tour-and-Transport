import { useTranslations } from "next-intl";
import { ClipboardList, MessageSquareText, BadgeCheck, CarFront } from "lucide-react";
import { processSteps } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import type { LucideIcon } from "lucide-react";

const icons: LucideIcon[] = [
  ClipboardList,
  MessageSquareText,
  BadgeCheck,
  CarFront,
];

export function HowItWorks() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-ivory">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("process.eyebrow")}
          title={t("process.title")}
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div key={step} className="relative text-center">
                {index < processSteps.length - 1 ? (
                  <span
                    className="absolute left-[calc(50%+3rem)] top-6 hidden w-[calc(100%-6rem)] border-t border-dashed border-navy/15 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative mx-auto flex size-12 items-center justify-center rounded-full border border-gold/40 bg-white text-navy">
                  <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <p className="mt-5 font-heading text-base font-semibold text-navy">
                  {t(step)}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-10 text-center text-xs text-navy/50">
          {t("process.note")}
        </p>
      </div>
    </section>
  );
}
