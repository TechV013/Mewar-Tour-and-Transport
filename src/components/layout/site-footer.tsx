import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  business,
  footerLegalLinks,
  footerServiceLinks,
  navItems,
  telHref,
  whatsappHref,
} from "@/lib/constants";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function SiteFooter() {
  const t = useTranslations();

  const socials = [
    { url: business.instagram, label: "Instagram", Icon: Instagram },
    { url: business.facebook, label: "Facebook", Icon: Facebook },
    { url: business.linkedin, label: "LinkedIn", Icon: Linkedin },
  ].filter((item) => item.url);

  return (
    <footer className="bg-navy text-white">
      <div className="container-site py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex flex-col leading-none">
              <span className="font-heading text-2xl font-bold tracking-tight">
                MEWAR
              </span>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                Tour and Transport
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {t("footer.description")}
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-white/70">
              {business.phone ? (
                <a
                  href={telHref(business.phone)}
                  className="flex items-center gap-2.5 hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden="true" />
                  {business.phone}
                </a>
              ) : null}
              {business.whatsapp ? (
                <a
                  href={whatsappHref(business.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold"
                >
                  <MessageCircle className="size-4 text-gold" aria-hidden="true" />
                  {business.whatsapp}
                </a>
              ) : null}
              {business.email ? (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2.5 hover:text-gold"
                >
                  <Mail className="size-4 text-gold" aria-hidden="true" />
                  {business.email}
                </a>
              ) : null}
              {!business.phone && !business.whatsapp && !business.email ? (
                <p className="text-xs text-white/45">
                  {t("footer.detailsPending")}
                </p>
              ) : null}
            </div>

            {socials.length ? (
              <div className="mt-6 flex gap-2">
                {socials.map(({ url, label, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-xs text-white/45">
                {t("footer.detailsPending")}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              {t("footer.columns.explore")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              {t("footer.columns.services")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {footerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              {t("footer.columns.legal")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {business.name}. {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/45">{t("footer.language")}</span>
            <div className="[&_div]:border-white/20 [&_div]:bg-transparent [&_button]:text-white/70 [&_button[data-pressed=true]]:bg-gold [&_button[data-pressed=true]]:text-navy">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
