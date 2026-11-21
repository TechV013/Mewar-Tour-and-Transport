import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <p className="font-heading text-6xl font-semibold text-gold">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-navy">
          {t("legal.pageTitle")}
        </h1>
        <p className="mt-3 text-sm text-navy/60">{t("legal.pageBody")}</p>
        <AppButton href="/" variant="primary" size="md" className="mt-7">
          {t("nav.home")}
        </AppButton>
      </div>
    </div>
  );
}
