import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-px w-8 shrink-0",
            light ? "bg-gold" : "bg-gold",
          )}
        />
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-gold" : "text-gold",
          )}
        >
          {eyebrow}
        </p>
      </div>
      <Heading
        className={cn(
          "mt-4 text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.65rem]",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
