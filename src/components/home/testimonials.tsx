import { useTranslations } from "next-intl";
import { MessageSquareQuote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
        />
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-dashed border-navy/20 bg-ivory px-6 py-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-gold">
            <MessageSquareQuote className="size-5" aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-heading text-lg font-semibold text-navy">
            {t("emptyTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy/60">
            {t("emptyBody")}
          </p>
        </div>
      </div>
    </section>
  );
}
