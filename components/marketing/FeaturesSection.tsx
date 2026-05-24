import {
  IconBug,
  IconCode,
  IconActivity,
  IconGitBranch,
  IconPlugConnected,
  IconShieldCheck,
} from "@tabler/icons-react";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: boolean;
};

const FEATURES: Feature[] = [
  { icon: IconBug,           title: "AI Code Review",         description: "Catch bugs, logic errors, and anti-patterns before they hit production.", highlight: true },
  { icon: IconCode,          title: "Code Generation",        description: "Generate boilerplate, refactors, and entire modules with context-aware AI." },
  { icon: IconActivity,      title: "Real-time Analysis",     description: "Full-featured analysis API for CI/CD pipelines and editor plugins." },
  { icon: IconGitBranch,     title: "Repo Scanning",          description: "Connect GitHub to scan entire repositories across branches and PRs." },
  { icon: IconPlugConnected, title: "Integrations",           description: "Works with your existing workflow — VS Code, GitHub Actions, Slack." },
  { icon: IconShieldCheck,   title: "Security & Compliance",  description: "Detect secrets, vulnerabilities, and license violations automatically." },
];

const ACCENT = "#ccff00";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#050505] py-14 md:py-18">
      {/* Top divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 mb-12">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.3), transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section header */}
        <div className="mb-20 text-center">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: ACCENT }}>
            Platform
          </p>
          <h2 className="mb-5 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl md:text-6xl">
            Everything You Need<br />
            <span style={{ color: ACCENT }}>to Ship Clean Code</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-500 font-sans">
            A flexible code intelligence platform built for real production use — not just toy demos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: feature.highlight
                    ? "linear-gradient(135deg, rgba(204,255,0,0.08) 0%, rgba(204,255,0,0.02) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: feature.highlight
                    ? `1px solid rgba(204,255,0,0.35)`
                    : "1px solid rgba(255,255,255,0.08)",
                  clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                }}
              >
                {/* Corner accent for highlighted card */}
                {feature.highlight && (
                  <>
                    <div className="absolute top-0 left-0 w-10 h-px" style={{ background: ACCENT }} />
                    <div className="absolute top-0 left-0 h-10 w-px" style={{ background: ACCENT }} />
                  </>
                )}

                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center transition-colors duration-300"
                  style={{
                    border: feature.highlight
                      ? `1px solid rgba(204,255,0,0.5)`
                      : "1px solid rgba(255,255,255,0.1)",
                    color: feature.highlight ? ACCENT : "#71717a",
                  }}
                >
                  <Icon className="h-5 w-5" stroke={1.75} />
                </div>

                <h3 className="mb-2 text-[15px] font-black uppercase tracking-wide" style={{ color: feature.highlight ? ACCENT : "#fff" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 font-sans">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
