"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  business,
  navItems,
  telHref,
  whatsappHref,
} from "@/lib/constants";
import { AppButton } from "@/components/shared/app-button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const phoneLink = telHref(business.phone) || "/contact-us";
  const whatsappLink = whatsappHref(business.whatsapp) || "/contact-us";

  return (
    <header className="relative z-50">
      <div className="hidden bg-navy text-white/80 lg:block">
        <div className="container-site flex h-9 items-center justify-between text-xs">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
            {t("hero.note")}
          </p>
          <div className="flex items-center gap-5">
            <a
              href={phoneLink}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {t("header.phoneLabel")}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              {t("header.whatsappLabel")}
            </a>
            <div className="[&_div]:border-white/20 [&_button]:text-white/70 [&_button[data-pressed=true]]:bg-gold [&_button[data-pressed=true]]:text-navy [&_div]:bg-transparent">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-site flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={business.name}
            className="flex shrink-0 flex-col leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="font-heading text-xl font-bold tracking-tight text-navy sm:text-[22px]">
              MEWAR
            </span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-[9px]">
              Tour and Transport
            </span>
          </Link>

          <nav
            className="hidden items-center gap-5 xl:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 text-[13px] font-medium text-navy/75 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    active && "text-navy",
                  )}
                >
                  {t(item.key)}
                  {active ? (
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-gold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block lg:hidden">
              <LanguageSwitcher compact />
            </div>
            <AppButton
              href="/#booking"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              {t("header.bookNow")}
            </AppButton>

            <Sheet open={open} onOpenChange={setOpen}>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={t("nav.openMenu")}
                className="inline-flex size-10 items-center justify-center rounded-md border border-navy/15 text-navy transition-colors hover:bg-ivory xl:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
              <SheetContent side="right" className="w-[85vw] p-0 sm:max-w-sm">
                <SheetHeader className="border-b border-navy/10 p-6 pr-12">
                  <SheetTitle className="text-navy">{business.name}</SheetTitle>
                </SheetHeader>
                <nav
                  className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
                  aria-label="Mobile navigation"
                >
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-3 text-base font-medium text-navy transition-colors hover:bg-ivory"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </nav>
                <div className="space-y-3 border-t border-navy/10 p-4">
                  <LanguageSwitcher />
                  <AppButton
                    href="/#booking"
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    {t("header.bookNow")}
                  </AppButton>
                  <div className="flex gap-2">
                    <AppButton
                      href={phoneLink}
                      external={!phoneLink.startsWith("/")}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {t("common.callNow")}
                    </AppButton>
                    <AppButton
                      href={whatsappLink}
                      external={!whatsappLink.startsWith("/")}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      {t("common.whatsapp")}
                    </AppButton>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
