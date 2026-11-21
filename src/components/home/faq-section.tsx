import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqAnswers, faqItems } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";

export function FaqSection({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations();

  return (
    <section className="section-pad bg-ivory">
      <div
        className={
          showHeading
            ? "container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
            : "container-site max-w-4xl"
        }
      >
        {showHeading ? (
          <SectionHeading
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            subtitle={t("faq.more")}
          />
        ) : null}
        <Accordion defaultValue={[]} className="border-t border-navy/10">
          {faqItems.map((question, index) => (
            <AccordionItem key={question} value={`faq-${index}`} className="border-b border-navy/10">
              <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-navy hover:no-underline">
                {t(question)}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-6 text-sm leading-relaxed text-navy/65">
                {t(faqAnswers[index])}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
