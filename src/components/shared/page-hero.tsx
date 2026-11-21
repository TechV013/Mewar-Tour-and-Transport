import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";
import { cn } from "@/lib/utils";

type HeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "gold" | "outline" | "light";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary?: HeroAction;
  secondary?: HeroAction;
  icon: string;
  imageAlt: string;
  imageSrc?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  icon,
  imageAlt,
  imageSrc,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-navy text-white", className)}>
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {subtitle}
          </p>
          {primary || secondary ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary ? (
                <AppButton href={primary.href} variant={primary.variant ?? "gold"} size="lg">
                  {primary.label}
                </AppButton>
              ) : null}
              {secondary ? (
                <AppButton href={secondary.href} variant={secondary.variant ?? "light"} size="lg">
                  {secondary.label}
                </AppButton>
              ) : null}
            </div>
          ) : null}
        </div>
        <MediaFrame
          src={imageSrc}
          alt={imageAlt}
          icon={icon}
          aspect="aspect-[5/4]"
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="rounded-xl border border-white/10 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]"
          priority
        />
      </div>
    </section>
  );
}
