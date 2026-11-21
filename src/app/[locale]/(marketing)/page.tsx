import { ContactCta } from "@/components/home/contact-cta";
import { CorporateSection } from "@/components/home/corporate-section";
import { FaqSection } from "@/components/home/faq-section";
import { FleetShowcase } from "@/components/home/fleet-showcase";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ServicesGrid } from "@/components/home/services-grid";
import { Testimonials } from "@/components/home/testimonials";
import { TravelRequirements } from "@/components/home/travel-requirements";
import { TrustHighlights } from "@/components/home/trust-highlights";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustHighlights />
      <ServicesGrid />
      <FleetShowcase />
      <TravelRequirements />
      <CorporateSection />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <FaqSection />
      <ContactCta />
    </>
  );
}
