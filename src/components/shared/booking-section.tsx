import { useTranslations } from "next-intl";
import { BookingWidget } from "@/components/home/booking-widget";
import { SectionHeading } from "@/components/shared/section-heading";

export function BookingSection({
  initialTab = "taxi",
}: {
  initialTab?: "taxi" | "bus" | "car";
}) {
  const t = useTranslations();

  return (
    <section id="booking" className="section-pad bg-ivory">
      <div className="container-site space-y-10">
        <SectionHeading
          eyebrow={t("booking.badge")}
          title={t("booking.title")}
          subtitle={t("booking.subtitle")}
          align="center"
        />
        <BookingWidget initialTab={initialTab} />
      </div>
    </section>
  );
}
