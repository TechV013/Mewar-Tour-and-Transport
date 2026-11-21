import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BusFront,
  Car,
  CarFront,
  ShieldCheck,
} from "lucide-react";
import { BookingWidget } from "@/components/home/booking-widget";
import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";

const heroImage =
  process.env.NEXT_PUBLIC_HERO_IMAGE || "/images/hero-art.svg";

export function Hero() {
  const t = useTranslations();

  const services = [
    { icon: CarFront, label: t("booking.tabs.taxi") },
    { icon: BusFront, label: t("booking.tabs.bus") },
    { icon: Car, label: t("booking.tabs.car") },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-navy pt-12 text-white lg:pt-16">
      <div className="absolute inset-0 -z-30">
        <MediaFrame
          src={heroImage}
          alt={t("hero.artAlt")}
          icon="taxi"
          aspect="h-full w-full"
          imageClassName="object-[68%_center] md:object-center"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-navy via-navy/90 to-navy/25" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container-site relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {t("hero.eyebrow")}
            </div>

            <h1 className="mt-6 text-balance font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[4rem]">
              {t("hero.headline")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {t("hero.support")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-2 text-xs text-white/60 sm:text-sm">
                <span
                  className="size-1.5 rounded-full bg-gold"
                  aria-hidden="true"
                />
                {t("hero.note")}
              </span>
              <AppButton
                href="/our-fleet"
                variant="light"
                size="sm"
                className="rounded-full"
              >
                {t("hero.secondaryCta")}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </AppButton>
            </div>
          </div>

          <div
            className="hidden shrink-0 rounded-2xl border border-white/15 bg-navy/35 p-4 backdrop-blur-xl lg:block"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2">
              {services.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex size-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold"
                  title={label}
                >
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          id="booking"
          className="relative z-10 mt-10 scroll-mt-24 pb-14 lg:mt-12 lg:pb-20"
        >
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
