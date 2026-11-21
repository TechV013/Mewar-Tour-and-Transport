"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe2 } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("header");

  const options = [
    { value: "en", label: t("english") },
    { value: "hi", label: t("hindi") },
  ] as const;

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-navy/15 bg-white p-1"
      role="group"
      aria-label={t("languageLabel")}
    >
      {!compact ? (
        <Globe2 className="ml-1.5 size-4 text-navy/60" aria-hidden="true" />
      ) : null}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => router.replace(pathname, { locale: option.value })}
          aria-pressed={locale === option.value}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            locale === option.value
              ? "bg-navy text-white"
              : "text-navy/70 hover:bg-ivory hover:text-navy",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
