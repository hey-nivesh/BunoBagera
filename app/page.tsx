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
  description: "Identify issues, optimize code, and deploy cleaner codebases. AI-assisted automated code reviews matching your team's rules.",
  keywords: [
    "AI code review tool",
    "automated PR analysis",
    "smart static analysis",
    "code quality assistant",
    "GitHub bot review",
    "automated code audit online",
    "software debugging AI",
    "automated security code scanner",
    "clean code review",
    "code refactoring AI assistant"
  ],
  openGraph: {
    title: "BuboBagera — Smart AI Code Reviewer for Real Projects",
    description: "Identify issues, optimize code, and deploy cleaner codebases. AI-assisted automated code reviews matching your team's rules.",
    type: "website",
    locale: "en_US",
    siteName: "BuboBagera",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuboBagera — Smart AI Code Reviewer for Real Projects",
    description: "Identify issues, optimize code, and deploy cleaner codebases. AI-assisted automated code reviews matching your team's rules.",
    creator: "@BuboBagera",
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