/**
 * Business information is intentionally left unconfigured until the owner
 * supplies verified details. Values can be provided through NEXT_PUBLIC_* env
 * variables without touching component code.
 */
export const business = {
  name: "MEWAR TOUR AND TRANSPORT",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim() ?? "",
  whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP?.trim() ?? "",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL?.trim() ?? "",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim() ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() ?? "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ?? "",
};

export function telHref(value: string) {
  if (!value) return "";
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(value: string, message?: string) {
  if (!value) return "";
  const number = value.replace(/[^\d]/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${query}`;
}

export const navItems = [
  { href: "/", key: "nav.home" },
  { href: "/taxi-services", key: "nav.taxiServices" },
  { href: "/bus-charter", key: "nav.busCharter" },
  { href: "/car-rentals", key: "nav.carRentals" },
  { href: "/our-fleet", key: "nav.ourFleet" },
  { href: "/corporate-transport", key: "nav.corporateTransport" },
  { href: "/about-us", key: "nav.aboutUs" },
  { href: "/contact-us", key: "nav.contactUs" },
] as const;

export const serviceItems = [
  {
    href: "/taxi-services",
    titleKey: "services.items.taxi.title",
    descriptionKey: "services.items.taxi.description",
    ctaKey: "services.items.taxi.cta",
    icon: "taxi",
  },
  {
    href: "/bus-charter",
    titleKey: "services.items.bus.title",
    descriptionKey: "services.items.bus.description",
    ctaKey: "services.items.bus.cta",
    icon: "bus",
  },
  {
    href: "/car-rentals/with-driver",
    titleKey: "services.items.chauffeur.title",
    descriptionKey: "services.items.chauffeur.description",
    ctaKey: "services.items.chauffeur.cta",
    icon: "chauffeur",
  },
  {
    href: "/car-rentals/self-drive",
    titleKey: "services.items.selfDrive.title",
    descriptionKey: "services.items.selfDrive.description",
    ctaKey: "services.items.selfDrive.cta",
    icon: "selfDrive",
  },
] as const;

export const taxiTypePages = [
  {
    slug: "one-way",
    titleKey: "pages.taxiTypes.oneWay.title",
    descriptionKey: "pages.taxiTypes.oneWay.description",
    eyebrowKey: "booking.taxi.tripTypes.oneWay",
    benefitKeys: [
      "pages.taxiTypes.oneWay.benefits.direct",
      "pages.taxiTypes.oneWay.benefits.timing",
      "pages.taxiTypes.oneWay.benefits.luggage",
      "pages.taxiTypes.oneWay.benefits.quote",
    ],
  },
  {
    slug: "round-trip",
    titleKey: "pages.taxiTypes.roundTrip.title",
    descriptionKey: "pages.taxiTypes.roundTrip.description",
    eyebrowKey: "booking.taxi.tripTypes.roundTrip",
    benefitKeys: [
      "pages.taxiTypes.roundTrip.benefits.combined",
      "pages.taxiTypes.roundTrip.benefits.return",
      "pages.taxiTypes.roundTrip.benefits.contact",
      "pages.taxiTypes.roundTrip.benefits.quote",
    ],
  },
  {
    slug: "local",
    titleKey: "pages.taxiTypes.local.title",
    descriptionKey: "pages.taxiTypes.local.description",
    eyebrowKey: "booking.taxi.tripTypes.local",
    benefitKeys: [
      "pages.taxiTypes.local.benefits.flexible",
      "pages.taxiTypes.local.benefits.duration",
      "pages.taxiTypes.local.benefits.stops",
      "pages.taxiTypes.local.benefits.quote",
    ],
  },
  {
    slug: "airport",
    titleKey: "pages.taxiTypes.airport.title",
    descriptionKey: "pages.taxiTypes.airport.description",
    eyebrowKey: "booking.taxi.tripTypes.airport",
    benefitKeys: [
      "pages.taxiTypes.airport.benefits.flight",
      "pages.taxiTypes.airport.benefits.terminal",
      "pages.taxiTypes.airport.benefits.luggage",
      "pages.taxiTypes.airport.benefits.review",
    ],
  },
] as const;

export type TaxiTypeSlug = (typeof taxiTypePages)[number]["slug"];

export const carRentalPages = [
  {
    slug: "with-driver",
    titleKey: "pages.carTypes.withDriver.title",
    descriptionKey: "pages.carTypes.withDriver.description",
    eyebrowKey: "pages.carTypes.withDriver.eyebrow",
    benefitKeys: [
      "pages.carTypes.withDriver.benefits.driver",
      "pages.carTypes.withDriver.benefits.duration",
      "pages.carTypes.withDriver.benefits.purpose",
      "pages.carTypes.withDriver.benefits.quote",
    ],
  },
  {
    slug: "self-drive",
    titleKey: "pages.carTypes.selfDrive.title",
    descriptionKey: "pages.carTypes.selfDrive.description",
    eyebrowKey: "pages.carTypes.selfDrive.eyebrow",
    benefitKeys: [
      "pages.carTypes.selfDrive.benefits.documents",
      "pages.carTypes.selfDrive.benefits.agreement",
      "pages.carTypes.selfDrive.benefits.handover",
      "pages.carTypes.selfDrive.benefits.review",
    ],
  },
] as const;

export type CarRentalSlug = (typeof carRentalPages)[number]["slug"];

export const taxiIncludes = [
  "pages.taxi.includes.route",
  "pages.taxi.includes.vehicle",
  "pages.taxi.includes.quote",
  "pages.taxi.includes.support",
] as const;

export const busIncludes = [
  "pages.bus.includes.vehicle",
  "pages.bus.includes.route",
  "pages.bus.includes.group",
  "pages.bus.includes.timing",
  "pages.bus.includes.requirements",
] as const;

export const corporateIncludes = [
  "pages.corporate.includes.single",
  "pages.corporate.includes.review",
  "pages.corporate.includes.quote",
  "pages.corporate.includes.contact",
] as const;

export const fleetCategories = [
  { key: "fleet.categories.sedan", icon: "sedan", seats: "4", luggage: "2" },
  { key: "fleet.categories.suv", icon: "suv", seats: "6", luggage: "3" },
  { key: "fleet.categories.muv", icon: "muv", seats: "7", luggage: "3" },
  {
    key: "fleet.categories.tempoTraveller",
    icon: "tempo",
    seats: "9–12",
    luggage: "4",
  },
  { key: "fleet.categories.miniBus", icon: "miniBus", seats: "16–25", luggage: "6" },
  {
    key: "fleet.categories.luxuryBus",
    icon: "luxuryBus",
    seats: "30–45",
    luggage: "10",
  },
] as const;

export const requirements = [
  { key: "requirements.items.family", icon: "users" },
  { key: "requirements.items.pilgrimage", icon: "temple" },
  { key: "requirements.items.airport", icon: "plane" },
  { key: "requirements.items.corporate", icon: "briefcase" },
  { key: "requirements.items.weddings", icon: "sparkles" },
  { key: "requirements.items.tourism", icon: "mountain" },
] as const;

export const corporateItems = [
  "corporate.items.employee",
  "corporate.items.events",
  "corporate.items.institutional",
  "corporate.items.group",
  "corporate.items.custom",
] as const;

export const whyItems = [
  "why.items.ownFleet",
  "why.items.verified",
  "why.items.transparent",
  "why.items.personal",
  "why.items.flexible",
  "why.items.support",
] as const;

export const processSteps = [
  "process.steps.one",
  "process.steps.two",
  "process.steps.three",
  "process.steps.four",
] as const;

export const faqItems = [
  "faq.items.booking.q",
  "faq.items.payment.q",
  "faq.items.areas.q",
  "faq.items.bus.q",
  "faq.items.selfDrive.q",
  "faq.items.changes.q",
] as const;

export const faqAnswers = [
  "faq.items.booking.a",
  "faq.items.payment.a",
  "faq.items.areas.a",
  "faq.items.bus.a",
  "faq.items.selfDrive.a",
  "faq.items.changes.a",
] as const;

export const footerServiceLinks = [
  { href: "/taxi-services/one-way", key: "booking.taxi.tripTypes.oneWay" },
  { href: "/taxi-services/round-trip", key: "booking.taxi.tripTypes.roundTrip" },
  { href: "/taxi-services/local", key: "booking.taxi.tripTypes.local" },
  { href: "/taxi-services/airport", key: "booking.taxi.tripTypes.airport" },
  { href: "/bus-charter", key: "nav.busCharter" },
  { href: "/car-rentals/with-driver", key: "services.items.chauffeur.title" },
  { href: "/car-rentals/self-drive", key: "services.items.selfDrive.title" },
] as const;

export const footerLegalLinks = [
  { href: "/privacy-policy", key: "legal.privacy" },
  { href: "/terms", key: "legal.terms" },
  { href: "/cancellation-policy", key: "legal.cancellation" },
  { href: "/faqs", key: "nav.faqs" },
] as const;
