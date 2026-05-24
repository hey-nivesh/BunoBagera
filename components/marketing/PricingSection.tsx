"use client";

import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

type Plan = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    name: "Starter", monthlyPrice: 0, yearlyPrice: 0,
    description: "Perfect for individuals and side projects.",
    features: ["50 reviews / month", "Basic issue detection", "1 GitHub repo", "Community support"],
    cta: "Get Started Free", href: "/signup", highlighted: false,
  },
  {
    name: "Pro", monthlyPrice: 29, yearlyPrice: 23,
    description: "Best for growing teams shipping fast.",
    features: ["Unlimited reviews", "AI-powered fixes", "Up to 10 repos", "Advanced security scanning", "Priority support"],
    cta: "Start Free Trial", href: "/signup", highlighted: true, badge: "Most Popular",
  },
  {
    name: "Enterprise", monthlyPrice: 99, yearlyPrice: 79,
    description: "For large teams with advanced needs.",
    features: ["Unlimited everything", "Private model deployment", "SSO / SAML", "Dedicated account manager", "SLA guarantee"],
    cta: "Contact Sales", href: "#contact", highlighted: false,
  },
];

const ACCENT = "#ccff00";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="bg-[#050505] py-14 md:py-18">
      {/* Top divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 mb-12">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: ACCENT }}>Pricing</p>
          <h2 className="mb-4 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl md:text-6xl">
            Flexible Plans<br /><span style={{ color: ACCENT }}>for Every Team</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base text-zinc-500 font-sans">
            Choose the right plan to scale your code quality.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex items-center gap-1 p-1"
            style={{ border: "1px solid rgba(204,255,0,0.2)", background: "rgba(204,255,0,0.03)" }}
          >
            <button
              id="billing-monthly"
              onClick={() => setIsYearly(false)}
              className="px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-all"
              style={!isYearly ? { background: ACCENT, color: "#000" } : { color: "#71717a" }}
            >
              Monthly
            </button>
            <button
              id="billing-yearly"
              onClick={() => setIsYearly(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-all"
              style={isYearly ? { background: ACCENT, color: "#000" } : { color: "#71717a" }}
            >
              Yearly
              <span
                className="text-[10px] font-black px-2 py-0.5"
                style={isYearly ? { border: "1px solid rgba(0,0,0,0.3)", color: "#000" } : { border: `1px solid rgba(204,255,0,0.3)`, color: ACCENT }}
              >
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className="relative flex flex-col p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: plan.highlighted
                    ? "linear-gradient(160deg, rgba(204,255,0,0.08) 0%, rgba(204,255,0,0.02) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: plan.highlighted ? `1px solid rgba(204,255,0,0.4)` : "1px solid rgba(255,255,255,0.08)",
                  clipPath: plan.highlighted
                    ? "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
                    : "none",
                }}
              >
                {/* Highlighted corner accents */}
                {plan.highlighted && (
                  <>
                    <div className="absolute top-0 left-0 w-12 h-px" style={{ background: ACCENT }} />
                    <div className="absolute top-0 left-0 h-12 w-px" style={{ background: ACCENT }} />
                    <div className="absolute bottom-0 right-0 w-12 h-px" style={{ background: ACCENT }} />
                    <div className="absolute bottom-0 right-0 h-12 w-px" style={{ background: ACCENT }} />
                  </>
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span
                      className="px-5 py-1.5 text-[11px] font-black uppercase tracking-widest text-black"
                      style={{ background: ACCENT }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-black uppercase tracking-wider" style={{ color: plan.highlighted ? ACCENT : "#fff" }}>
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 font-sans">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tight text-white">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && <span className="mb-1.5 text-sm text-zinc-500 font-sans">/ month</span>}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-1 text-xs text-zinc-600 font-sans">Billed annually — ${price * 12} / year</p>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center"
                        style={{
                          border: plan.highlighted ? `1px solid rgba(204,255,0,0.4)` : "1px solid rgba(255,255,255,0.1)",
                          color: plan.highlighted ? ACCENT : "#71717a",
                        }}
                      >
                        <IconCheck className="h-3 w-3" stroke={3} />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className="block text-center w-full py-3.5 text-sm font-black uppercase tracking-widest transition-all duration-200 active:scale-95"
                  style={plan.highlighted
                    ? { background: ACCENT, color: "#000", clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }
                    : { border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
