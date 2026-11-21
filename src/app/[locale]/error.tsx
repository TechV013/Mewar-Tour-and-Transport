"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Log only the framework digest; error messages may contain user input.
    console.error("[client-error]", error.digest ?? "unknown");
  }, [error.digest]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-3xl font-semibold text-navy">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/70">{t("body")}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <AppButton variant="primary" size="md" onClick={reset}>
            {t("retry")}
          </AppButton>
          <AppButton href="/" variant="outline" size="md">
            {t("home")}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
