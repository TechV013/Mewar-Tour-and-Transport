import { ArrowRight } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { MediaFrame } from "@/components/shared/media-frame";

export function LinkCard({
  href,
  icon,
  title,
  description,
  ctaLabel,
  imageAlt,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  imageAlt: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy/10 bg-white transition-colors hover:border-gold/60">
      <MediaFrame
        icon={icon}
        alt={imageAlt}
        aspect="aspect-[16/9]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold text-navy">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/65">{description}</p>
        <AppButton
          href={href}
          variant="ghost"
          size="sm"
          className="mt-5 self-start px-0 text-gold hover:text-navy"
        >
          {ctaLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </AppButton>
      </div>
    </article>
  );
}
