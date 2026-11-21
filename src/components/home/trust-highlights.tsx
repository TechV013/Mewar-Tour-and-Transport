import { useTranslations } from "next-intl";
import {
  ClipboardCheck,
  CarFront,
  Globe2,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const items: { key: string; Icon: LucideIcon }[] = [
  { key: "trust.items.fleet", Icon: CarFront },
  { key: "trust.items.nationwide", Icon: Globe2 },
  { key: "trust.items.assistance", Icon: Headset },
  { key: "trust.items.managed", Icon: ClipboardCheck },
];

export function TrustHighlights() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("trust.eyebrow")}
          title={t("trust.title")}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, Icon }) => (
            <div
              key={key}
              className="group rounded-lg border border-navy/10 bg-white p-6 transition-colors hover:border-gold/50 hover:bg-ivory"
            >
              <div className="flex size-11 items-center justify-center rounded-md bg-ivory text-navy transition-colors group-hover:bg-navy group-hover:text-gold">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-heading text-base font-semibold text-navy">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
