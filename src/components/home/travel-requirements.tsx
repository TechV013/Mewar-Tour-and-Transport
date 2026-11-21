import { useTranslations } from "next-intl";
import {
  BriefcaseBusiness,
  BusFront,
  Landmark,
  Mountain,
  Plane,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { requirements } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  temple: Landmark,
  plane: Plane,
  briefcase: BriefcaseBusiness,
  sparkles: Sparkles,
  mountain: Mountain,
};

export function TravelRequirements() {
  const t = useTranslations();

  return (
    <section className="section-pad bg-ivory">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("requirements.eyebrow")}
          title={t("requirements.title")}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requirements.map((item) => {
            const Icon = iconMap[item.icon] ?? BusFront;
            return (
              <div
                key={item.key}
                className="flex items-center gap-4 rounded-lg border border-navy/10 bg-white px-5 py-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ivory text-navy">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="font-heading text-base font-semibold text-navy">
                  {t(item.key)}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
