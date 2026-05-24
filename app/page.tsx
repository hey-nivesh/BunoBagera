import type { Metadata } from "next";

import NavBar from "@/components/marketing/NavBar";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import UseCaseSection from "@/components/marketing/UseCaseSection";
import TryItSection from "@/components/marketing/TryItSection";
import PricingSection from "@/components/marketing/PricingSection";
import ContactSection from "@/components/marketing/ContactSection";
import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "BuboBagera — Smart AI Code Reviewer for Real Projects",
  description:
    "Catch bugs, enforce standards, and ship production-ready code — powered by Claude AI. AI-powered code review for teams of any size.",
  openGraph: {
    title: "BuboBagera — Smart AI Code Reviewer for Real Projects",
    description:
      "Catch bugs, enforce standards, and ship production-ready code — powered by Claude AI.",
    type: "website",
  },
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans antialiased">
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <UseCaseSection />
        <TryItSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}